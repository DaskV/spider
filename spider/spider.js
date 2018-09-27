const fs = require("fs");
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



//爬取动漫分类
spideRob.prototype.spideSort = async function () {
    console.log('开始——爬取动漫分类')
    let data = await this.URLSys.getHtmlList(this.URLSys.url.sort,$=>{
        let data = []
        $(this.URLSys.rule.sort).find('dd>a').each(function(){
            data.push({
                name : $(this).text(),
                url:$(this).attr('href')
            })
        })
        return data
    })
    console.log('结束——爬取动漫分类')
    //存写入数据库
    console.log('开始——分类写入数据库')

    for(let item of data){
        await this.dbcontroller.methods.sortsSave(item)
    }    
    console.log('结束——分类写入数据库')
}


//爬取动漫列表
spideRob.prototype.spideList = async function () {
    let list = await this.dbcontroller.methods.sortsGet()
    console.log('开始爬取动漫列表')
    for(let item of list){
        let url = this.URLSys.domin + item.url
        let self = this
        let data = await this.URLSys.getHtmlList(url, $=>{
            return handleDom($,item)
        })

        for(var key of data){
            await this.dbcontroller.methods.comicsSave(key)
        }
    }

}

function handleDom($,item){
    spideRob.call(this)
    let data = []
    $(this.URLSys.rule.list).each(function(){
        let stateName = $(this).find("dd p:nth-last-child(1)").text()
        stateName = stateName.split("状态: ")[1]
        let regionName = $(this).find("dd .d_label").eq(0).text()
        regionName = regionName.split("地区：")[1]
        data.push({
            stateName:stateName,
            name:$(this).find("dd h3 a").text(),
            regionName:regionName,
            year:$(this).find("dd .d_label:nth-child(2) a").text(),
            describe:$(this).find("dd p:nth-last-child(2)").text(),
            sortId:item.id,
            cover:$(this).find("dt img").attr("src"),
            point:$(this).find("dd p:nth-last-child(4)").text(),
        })                                            
    })
    return data
}


module.exports = spideRob