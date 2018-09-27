const request = require("superagent");
const cheerio = require("cheerio");

const utilsUrl = function () {
    this.domin = 'http://www.dilidili.wang'
    this.url = {
        sort: this.domin + '/tvdh/'
    }
    this.rule = {
        sort: '.tag-list ',
        list: '.anime_list dl',
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