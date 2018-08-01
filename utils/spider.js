const utilsFiles = require('./files');
const utilsUrl = require('./url')

//爬虫机器人
const spideRob = function () {
    this.FileSys = new utilsFiles()
    this.URLSys = new utilsUrl()
}


spideRob.prototype.start = async function () {
    this.spideSort(this.URLSys).then(_ => {
       await this.FileSys.getFileNamelist('files')
       await this.spideSortList(this.FileSys.folder)
    }).catch(error => console.log(error.message))
}

//爬取分类
spideRob.prototype.spideSort = async function () {
    this.URLSys.getHtmlList(this.URLSys.url.sort, this.URLSys.rule.sort)
}

//爬去分类下的文件列表
spideRob.prototype.spideSortList = async function (list) {
    list.concat([]).map(item => {
        let url = this.URLSys.domin + (item.split('files')[1]).replace(/\\/g, "/")
        this.URLSys.getHtmlList(url,this.URLSys.rule.list,true)
    })

}

module.exports = spideRob