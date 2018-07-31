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

let utilsUrl = function(){
    this.domin = 'http://www.dilidili.wang'
    this.url = {
        sort:  this.domin + '/tvdh/'
    },
    this.rule = {
        sort:'.tag-list a',
        list:'.anime_list a'
    }
}

utilsUrl.prototype.getHtmlList = async function(url,rule){
    let types = []
    request.get(url).end((err, res) => {
        if (err) {
            console.log(err)
        }      
        let $ = cheerio.load(res.text)
        $(rule).each(function(){       
            let src = $(this).attr('href')
            types.push(src)            
        })   
        let FileSys = new utilsFiles()
        FileSys.createDir(types,FileSys.dirName)
    })
}

module.exports = utilsUrl