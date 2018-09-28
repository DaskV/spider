const request = require("superagent")
const cheerio = require("cheerio")

const utilsUrl = function () {
    this.domin = 'http://www.zzzfun.com/'
    this.url = {
        sort: this.domin + '?m=vod-type-id-1.html',
    }
    this.rule = {
        sort: '#vType',
        region:"vArea",
        list: '.search-result a',
        play:'.episode-wrap',
        video
    }
}

utilsUrl.prototype.getHtmlList = function (url,handle) {
    return new Promise((resolve, reject) => {
        request.get(url).end((err, res) => {
            if (err) {
                reject(err)
            }
            let $ = cheerio.load(res.text)        
            resolve(handle($))
        })
    })
}




module.exports = utilsUrl