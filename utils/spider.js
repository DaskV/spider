const fs = require('fs');
const cheerio = require("cheerio");
const mkdirp = require('mkdirp');
const utilsFiles = require('./files');
const utilsUrl = require('./url')

//爬虫机器人
exports.spideRob = async function (ctx,next) {
    let FileSys = new utilsFiles()
    let URLSys = new utilsUrl()
    await spideSort(URLSys).catch(error => console.log(error.message))
    FileSys.getFileNamelist('files')   
}


//爬取分类
async function spideSort(URLSys){  
    URLSys.getHtmlList(URLSys.url.sort,URLSys.rule.sort)
}

//爬去分类下的文件列表
async function spideSortList(){

}