const fs = require("fs");
const utilsFiles = require('./files');
const utilsUrl = require('./url')
const dbcontroller = require('./dbcontroller')

//爬虫机器人
const spideRob = function () {
    this.FileSys = new utilsFiles()
    this.URLSys = new utilsUrl()
    this.dbcontroller = new dbcontroller()
}


spideRob.prototype.start = async function () {
    // await this.spideSort()
    // await this.spideList()
    this.dbcontroller.start()
}



//爬取动漫分类
spideRob.prototype.spideSort = async function () {
    console.log('开始爬取动漫分类')
    let data = await this.URLSys.getHtmlList(this.URLSys.url.sort, this.URLSys.rule.sort)
    let sort = Object.assign({}, data)
    fs.writeFileSync('utils/sort.txt', JSON.stringify(sort))
    
}


//爬取动漫列表
spideRob.prototype.spideList = async function () {
    console.log('开始爬取动漫列表')
    let list = JSON.parse(fs.readFileSync('utils/sort.txt'))
    list = Object.values(list)
    list.concat([]).map(async item => {
        let url = this.URLSys.domin + item;
        let data = await this.URLSys.getHtmlList(url, this.URLSys.rule.list)
        this.FileSys.createDir(data, this.FileSys.dirName)
    })
}

module.exports = spideRob