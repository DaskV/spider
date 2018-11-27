const request = require("superagent")
const cheerio = require("cheerio")
require('superagent-proxy')(request)
const dbcontroller = require('../controller/db.controller')

let controller = new dbcontroller()

const utilsUrl = function () {
    this.domin = 'http://www.zzzfun.com'
    this.url = {
        sort: this.domin + '/vod-type-id-1-page-1.html'
        
    }
    this.rule = {
        sort: '#vType',
        region:"#vArea",
        list: '.search-result a',
        play:'.episode-wrap',
        video:'#playleft',
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