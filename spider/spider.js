const utilsUrl = require('./url')
const dbcontroller = require('../controller/db.controller')
const helper = require('./helper')
const request = require("superagent")



//爬虫机器人
const spideRob = function () {
    this.URLSys = new utilsUrl()
    this.dbcontroller = new dbcontroller()
}


spideRob.prototype.start = async function () {
    const startTime = new Date().getTime()
    this.dbcontroller.start()
    // await this.spideStart(this.URLSys.url.sort,'日漫')
    // await this.spideStart(this.URLSys.url.domestic,'国漫')
    // await this.spideStart(this.URLSys.url.movie,'剧场版')
    await this.spideStart(this.URLSys.url.tv,'影视剧')
    // await this.spideStart(this.URLSys.url.new,'新番')
    // await this.spideBanner()
    const endTime = new Date().getTime()
    console.log('用时(秒):',(endTime - startTime)/1000)

}






//爬虫开始
spideRob.prototype.spideStart = async function(url,name){
    console.log(`开始——爬取${name}`)
        name == '新番' || await this.spideSort(name)    
        const count = await handlePagination(url)
        await this.spideList(url,count,name)
        await this.spidePlays(name)   
        await this.failUrlreSpide(url,name)
    console.log(`结束——爬取${name}`)
}


//爬取动漫 分类、语言
spideRob.prototype.spideSort = async function (name) {
    console.log(`开始——爬取${name} 分类、语言`)
    let stuffs = await this.URLSys.spideRquest(this.URLSys.url.sort,$=>{
        let obj = {
            sorts:[],
            regions:[]
        }
        //分类
        $(this.URLSys.rule.sort).find('a').each(function(index){
            if(index !=0){
                obj.sorts.push({
                    name : $(this).text(),
                    url:$(this).attr('href'),
                    belong:name
                })
            }       
        })
        //语言  
        $(this.URLSys.rule.region).find('a').each(function(index){
            if(index !=0){
                obj.regions.push({
                    name : $(this).text(),
                    url:$(this).attr('href'),
                    belong:name
                })
            }       
        })
        return obj
    },0,{parent:{ belong:name },child:{}})
    console.log(`结束——爬取${name} 分类、语言`)
    //存写入数据库
    console.log('开始——分类写入数据库')
    for(let item of stuffs.sorts){
        await this.dbcontroller.methods.sortsSave(item)
    }    
    console.log('结束——分类写入数据库')

    console.log('开始——语言写入数据库')
    for(let item of stuffs.regions){
        await this.dbcontroller.methods.regionsSave(item)
    }
    console.log('结束——语言写入数据库')
}

//爬取动漫列表
spideRob.prototype.spideList = async function (url,count,name) {
    let sorts = await this.dbcontroller.methods.sortsGet()
    console.log('开始——爬取动漫列表')  
    let data = []
    for(let page=1 ; page< count+1; page++){
        let head = url.split(".html")[0]
        const pageUrl = head + `-page-${page}`
        let pagelist = await this.URLSys.spideRquest(pageUrl, $=>{
            return handleListDom($,sorts,name)
        },2)
        data = data.concat(pagelist)
    }
    for(let key of data){
        await this.dbcontroller.methods.comicsSave(key)
    }
    console.log('结束——爬取动漫列表')

}

//处理列表分页
async function handlePagination(url){
    spideRob.call(this)
    return await this.URLSys.spideRquest(url, $=>{
        let src =  $(this.URLSys.rule.pagination).attr("href")
        const count =  src.substring(src.indexOf('page-')+5,src.indexOf('.html'))
        return Number(count) 
    },1)
}


//爬取动漫剧集
spideRob.prototype.spidePlays= async function(types){
    let list = await this.dbcontroller.methods.comicsGet({'types':types})
    let regions = await this.dbcontroller.methods.regionsGet()
    console.log('开始——爬取动漫剧集')
    for(let item of list){
        let url = this.URLSys.domin + item.url    
        let data = await this.URLSys.spideRquest(url, $=>{
            return handlePlayListDom($,regions,item)
        },3,{ parent : item })
        console.log(`开始爬取——${item.name}`)
        let child = await this.spidePlaysDetails(data,item)
        await this.dbcontroller.methods.comicsChildSave(item,child)
        console.log(`结束爬取——${item.name}`)          
    }
    console.log('结束——爬取动漫剧集')
}

//爬去剧集内容详情
spideRob.prototype.spidePlaysDetails= async function(data,item){
    let child = []
    for(let key of data){
        console.log(`${key.name}`)
        let playsUrl = this.URLSys.domin + key.url
        let videoUrl = await this.URLSys.spideRquest(playsUrl, $=>{
            return handleVideoUrl($,{ parent : item, child:key })
        },4,{ parent : item, child:key })
        key['videoUrl'] = videoUrl
        child.push(key)      
    }
    return child
}


//处理动漫剧集dom
function handlePlayListDom($,regions,item){
    spideRob.call(this)
    let index = 0
    let data = []  
    let compare = []
    let regionList = []
    let l = $(".slider-list").length 
    if(l>1){
        $(".slider-list").each(function(i){
            let degree = 1
            const text = $(this).find("span").text()
            if(text.indexOf('No.S')>-1){
                degree = 1
            }
            if(text.indexOf('No.A')>-1){
                degree = 2
            }
            if(text.indexOf('No.B')>-1){
                degree = 3
            }
            if(text.indexOf('No.T')>-1){
                degree = 4
            }
            if(text.indexOf('No.K')>-1){
                degree = 5
            }
            compare.push({
                i:i,
                degree:degree,
                text:text
            })
        })
        index = compare.sort((a,b) =>{
            return a.degree - b.degree
        })[0].i
        console.log(`${compare[0].text}`)
    }
    //获取集数
    $(this.URLSys.rule.play).find(".episode").eq(index).find("li").each(function(idx){
        data.push({
            index:idx,
            name:$(this).find("span").text(),
            url:$(this).find('a').attr('href')
        })
    })
    //获取语言
    regions.forEach(value=>{
        if(value.name == $(this.URLSys.rule.playRegion).text()){
            item['regionId'] = value.id
        }
    })     
    //获取状态
    item['state'] = ($(this.URLSys.rule.state).text()).replace(/\s+/g, "")
    //获取声优
    let cv = []
    $(this.URLSys.rule.cv).each(function(){
        cv.push($(this).text())
    })
    item['cv'] = cv.join("、")
    
    return data
}



//处理动漫列表dom
function handleListDom($,sorts,types){
    let data = []
    $(this.URLSys.rule.list).each(function(){
        let stateName = $(this).find(".title-sub span:nth-child(1)").text()
        let name = $(this).find(".title-big").text()        
        let sortNameList = $(this).find(".title-sub span:nth-child(3)").text().split(",")

        let sortsIds = []
        sorts.forEach(item=>{
            sortNameList.forEach(value=>{
                if(value == item.name){
                    sortsIds.push(item.id)
                }
            })
        })      
        data.push({
            name:name,
            stateName:stateName,     
            describe:$(this).find(".d-descr").text(),
            sortId:sortsIds,
            cover:$(this).find(".d-cover-big img").attr("src"),
            url:$(this).attr("href"),
            types : types
        })       
        console.log(`爬取${name}成功`)                                     
    })
    return data
}



//获取播放播放器Url
async function handleVideoUrl($,comics = { parent : {} , child:{} }){
    this.comics = comics
    let scriptHtml = $("#bofang_box script").eq(0).html()
    let obj = JSON.parse(scriptHtml.substr(16,scriptHtml.length))
    let url = unescape(helper.base64decode(obj.url)) 
    // flash 播放器类型
    if(obj.from == 'jiexi'){
        return ""
        // await flashPlayer(url) 暂未找到办法
    }

    //mp4 播放器类型
    else{  
       
        let from = obj.from == 'odb' ?  'oda' : obj.from  
        return mp4Player(url,from)
    }
   
}   

//MP4类 播放器类型
async function mp4Player(url,from){
    spideRob.call(this)
    handleVideoUrl.bind(this)
    //iframe 跳转 mp4播放器
    const compareUrl = url.toUpperCase()
    if(compareUrl.indexOf('.MP4')>-1 || from == 'ksyun' || from == 'san' || from == 'bit' || from == 'hecai'){
        url = isContainChinese(url)
        const realUrl = `${this.URLSys.domin}/static/danmu/${from}.php?${url}`
        console.log(realUrl)
        return realUrl
    }
    console.log(url)
    //video mp4
    return await getRealUrl(url)
    
}
//请求真正的url
function getRealUrl(url){
    spideRob.call(this)
    handleVideoUrl.bind(this)
    return new Promise((resolve, reject) => {
        request.get(url).end((err, res) => {
            if (err) {
                return reject(err)
            }
            resolve(res.text)             
        })
    }).catch(e=>{
        console.error('爬取视频路径失败:',`${e.message},${url}`)
        this.dbcontroller.methods.comicsFailSave({
            url:url,
            link:6,
            parent:this.comics.parent,
            child:this.comics.child
        })
    })   
}

//判断是否包含中文
function isContainChinese(str){
    if(/.*[\u4e00-\u9fa5]+.*$/.test(str)){
        return encodeURI(str)
    }
    return str
}



//flash 播放器类型
async function flashPlayer(url){
    spideRob.call(this)
    const nextUrl = `https://jx.52088cj.com/?url=${url}`
    const getUrl = `https://jx.52088cj.com/jx?url=${helper.flashBaseEncode(url)}&&ref=${helper.flashBaseEncode(nextUrl)}` 
    return await this.URLSys.spideRquest(getUrl,$=>{
        let scriptHtml = $("html").html()
        console.log( scriptHtml.substr(scriptHtml.indexOf('post'),scriptHtml.length))
    })

}

//失败链接的再爬取
spideRob.prototype.failUrlreSpide = async function(url,name){
    console.log('开始——爬取错误链接')
    let list = await this.dbcontroller.methods.comicsFailGet()
    for(let item of list){
        switch(item.link){
            case 0 : 
                    await this.spideSort(item.parent.belong)
                    break
            case 1 : 
                    const count = await handlePagination(url)
                    await this.spideList(count)
                    break
            case 2 :
                    let pagelist = await this.URLSys.spideRquest(item.url, $=>{
                        return handleListDom($,list,name)
                    },2)
                    for(let key of pagelist){
                        await this.dbcontroller.methods.comicsSave(key)
                    }
                    break
            case 3 :
                    let regions = await this.dbcontroller.methods.regionsGet()
                    let data = await this.URLSys.spideRquest(item.url, $=>{
                        return handlePlayListDom($,regions,item)
                    },3)
                    let child = await this.spidePlaysDetails(data,item.parent)
                    await this.dbcontroller.methods.comicsChildSave(item.parent,child)
                    break
            case 4 : 
                    let playsUrl = this.URLSys.domin + item.child.url            
                    let videoUrl = await this.URLSys.spideRquest(playsUrl, $=>{
                        return handleVideoUrl($)
                    },4)
                    item.child['videoUrl'] = videoUrl
                    await this.dbcontroller.methods.comicsChildAppend(item.parent.id,item.child)
                    break
            case 5 :
                    item.child['videoUrl'] = await this.URLSys.spideRquest(item.url,$=>{
                        let videoUrl = $("body video source").attr("src")
                        return videoUrl
                    },5)
                    await this.dbcontroller.methods.comicsChildAppend(item.parent.id,item.child)
                    break
            case 6 : 
                    item.child['videoUrl'] = await getRealUrl(item.url)
                    await this.dbcontroller.methods.comicsChildAppend(item.parent.id,item.child)
                    break                  
        }
        await this.dbcontroller.methods.comicsFailRemove(item.id)
    }
    console.log('结束——爬取错误链接')
}



spideRob.prototype.spideBanner = async function(){
    console.log('开始——爬取banner')
    let list = await this.URLSys.spideRquest(this.URLSys.domin,$=>{
        let array = []
        $(".banner .51buypic li").each(function(index){       
           if(index >0){
                $img = $(this).find("img") 
                array.push({
                    cover:$img.attr("src"),
                    comicsName:$img.attr("alt"),
                    updateTime:new Date()
               })
           }          
        })
        return array
    })
    for(let item of list){
        await this.dbcontroller.methods.bannerSave(item)
    }
    console.log('结束——爬取banner')
}

module.exports = spideRob