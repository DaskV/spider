const request = require("superagent")
const cheerio = require("cheerio")
require('superagent-proxy')(request)
const dbcontroller = require('../controller/db.controller')

let controller = new dbcontroller()

const utilsUrl = function () {
    this.domin = 'http://www.zzzfun.com'
    this.url = {
        sort: this.domin + '/vod-type-id-1-page-1.html', //日漫
        domestic:this.domin + '/vod-type-id-2.html',//国漫
        new:this.domin + '/vod-type-id-42.html', //新番
        movie:this.domin + '/vod-show-id-3.html',//剧场版
        tv:this.domin + '/vod-type-id-4.html' // 影视剧
        
    }
    this.rule = {
        sort: '#vType',
        region:"#vArea",
        list: '.search-result a',
        play:'.episode-wrap',
        playRegion:'#transArea',
        video:'#playleft',
        state:'.content-count > .count-item:nth-child(2) > span:nth-child(2)',
        cv:'.content-count > .count-item:nth-child(3) > span:nth-child(2) > a',
        pagination:'.page_link:nth-last-child(1)'
    }
}

utilsUrl.prototype.spideRquest = function (url,handle,link,obj = { parent : {} ,child : {} }) {
    return new Promise((resolve, reject) => {
        request
            .get(url)
            .end((err, res) => {
                if (err) {
                    return reject(err)
                }
                let $ = cheerio.load(res.text)        
                resolve(handle($))         
            })       
    }).catch(e=>{
        console.error('爬取url失败:',`${e.message},${url}`)       
        controller.methods.comicsFailSave({
            url,
            link,
            parent:obj.parent,
            child:obj.child
        })
    })       
}


module.exports = utilsUrl