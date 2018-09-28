const request = require("superagent")
const utilsUrl = require('./url')
const dbcontroller = require('../controller/db.controller')


//爬虫机器人
const spideRob = function () {
    this.URLSys = new utilsUrl()
    this.dbcontroller = new dbcontroller()
}


spideRob.prototype.start = async function () {
    this.dbcontroller.start()
    await this.spideSort() 
    await this.spideList()
   
}



//爬取动漫 分类、语言
spideRob.prototype.spideSort = async function () {
    console.log('开始——爬取动漫 分类、语言')
    let stuffs = await this.URLSys.getHtmlList(this.URLSys.url.sort,$=>{
        let obj = {
            sorts:[],
            regions:[]
        }
        //分类
        $(this.URLSys.rule.sort).find('a').each(function(index){
            if(index !=0){
                obj.sorts.push({
                    name : $(this).text(),
                    url:$(this).attr('href')
                })
            }       
        })
        //语言
        $(this.URLSys.rule.region).find('a').each(function(index){
            if(index !=0){
                obj.regions.push({
                    name : $(this).text(),
                    url:$(this).attr('href')
                })
            }       
        })
        return obj
    })
    console.log('结束——爬取动漫 分类、语言')
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
spideRob.prototype.spideList = async function () {
    let list = await this.dbcontroller.methods.sortsGet()
    console.log('开始——爬取动漫列表')
    for(let item of list){
        let url = this.URLSys.domin + item.url
        let data = await this.URLSys.getHtmlList(url, $=>{
            return handleListDom($,list)
        })

        for(var key of data){
            await this.dbcontroller.methods.comicsSave(key)
        }
    }
    console.log('结束——爬取动漫列表')

}
//处理动漫列表dom
function handleListDom($,array){
    spideRob.call(this)
    let data = []
    $(this.URLSys.rule.list).each(function(){
        let stateName = $(this).find(".title-sub span:nth-child(1)").text()
        let name = $(this).find(".title-big").text()
        let sortNameList = $(this).find(".title-sub span:nth-child(2)").split("&nbsp;")
        let sortsIds = []
        array.forEach(item=>{
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
            url:$(this).attr("href")
        })       
        console.log(`爬取${name}成功`)                                     
    })
    return data
}


//爬取动漫剧集
spideRob.prototype.spidePlays= async function(){
    let list = await this.dbcontroller.methods.comicsGet()
    console.log('开始——爬取动漫剧集')
    for(var item of list){
        let url = this.URLSys.domin + item.url
        let data = await this.URLSys.getHtmlList(url, $=>{
            return handlePlayListDom($)
        })
        for(var key of data){
            let playsUrl = this.URLSys.domin + key.url
            let videoUrl = await this.URLSys.getHtmlList(playsUrl, $=>{
                return handleVideoDom($)
            })
            key['videoUrl'] = videoUrl
        }
    }
    console.log('结束——爬取动漫剧集')
}
//处理动漫剧集dom
function handlePlayListDom($){
    spideRob.call(this)
    let index = 0
    let data = []  
    let compare = []
    let l = $(".episode-wrap").length
    if(l>1){
        $(".episode-wrap ul").each(function(i){
            compare.push({
                i:i,
                count: $(this).find("li").length
            })
        })
        index = compare.sort((a,b)=>{
            return b.count - a.count
        })[0].i
    }
    $(this.URLSys.rule.play).eq(0).find("li").each(function(idx){
        data.push({
            index:idx,
            name:$(this).find("span").text(),
            url:$(this).find('a').attr('href')
        })
    })
    return data
}

//处理播放播放器dom
function handleVideoDom($){
    spideRob.call(this)
    let $iframe = $(this.URLSys.rule.video).find("iframe")
    let isIframe = $iframe.length > 0 ? true : false
    let videoUrl
    if(isIframe){
        let url = $iframe.attr("src")
        videoUrl = await new Promise((reslove,reject)=>{
            request.posy('http://y2.mt2t.com:91/ifr/api').send({
                url:url,
                type:'',
                from:'mt2t.com',
                device:'',
                up:0
            }).end((err,res)=>{
                res = JSON.parse(res)
                if (err) {
                    reject(err,"爬取IFrame Video失败")
                }
                reslove(res.url)
            })
        }) 
    }
    else{
        videoUrl = $(this.URLSys.rule.video).find('source').attr("src")
    }

    return videoUrl
}

module.exports = spideRob