/*
 * @Author: DaskV
 * @Date: 2018-07-31 15:50:29
 * @LastEditors: DaskV
 * @LastEditTime: 2018-07-31 18:52:43
 * @Description: 文件系统
 * 
 * 暂未使用,后续增加下载功能后会使用该IO
 */
const fs = require("fs");
const mkdirp = require('mkdirp');
const path = require('path');


const utilsFile = function () {
    this.dirName = 'files'
    this.folder = []
}

//创建目录
utilsFile.prototype.createDir = function (types, dirName) {
    types.forEach(item => {
        let path = dirName + item
        fs.exists(path, isexists => { 
            //判断文件夹是否存在
            if (!isexists) {
                mkdirp(path)
            }
        })
    })
}



//获取目录列表
utilsFile.prototype.getFileNamelist = async function(rootPath){
    this.folder = []
    getFileNameRs(rootPath,this.folder)   
}



//递归查询文件目录
const getFileNameRs = function (pathParam,folder) {
    // 同步读取目录
    let files =  fs.readdirSync(pathParam)     
    files.forEach(filename=>{
        let filePath = path.join(pathParam,filename)  
        // 同步读取文件状态
        let stats = fs.statSync(filePath)
        let isDir = stats.isDirectory()
        if(isDir){              
            folder.push(filePath)
            getFileNameRs(filePath,folder)               
        }      
    })
}

module.exports = utilsFile