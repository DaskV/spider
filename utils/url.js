/*
 * @Author: DaskV
 * @Date: 2018-07-31 16:04:16
 * @LastEditors: DaskV
 * @LastEditTime: 2018-07-31 18:12:26
 * @Description: url系统
 */

const request = require("superagent");
const cheerio = require("cheerio");
const utilsFiles = require('./files');

const utilsUrl = function () {
    this.domin = 'http://www.dilidili.wang'
    this.url = {
        sort: this.domin + '/tvdh/'
    }
    this.rule = {
        sort: '.tag-list',
        list: '.anime_list dl',
    }
}

utilsUrl.prototype.getHtmlList = function (url, rule, allInfo = false) {
    let types = allInfo ? {} : []
    return new Promise((resolve, reject) => {
        request.get(url).end((err, res) => {
            if (err) {
                reject(err)
            }
            let $ = cheerio.load(res.text)
            $(rule).each(function () {
                let src = $(this).find('dt a').attr('href')
                if (!allInfo) {
                    types.push(src)
                } else {
                    let img = $(this).find('dt img').attr('src')
                    let name = $(this).find('h3 a').text()

                }

            })
            resolve(types)
        })
    })
}




module.exports = utilsUrl