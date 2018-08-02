const mongoose = require('mongoose')

function dbcontroller(){
    this.dbUrl = 'mongodb://localhost:27017/'
}

//开启数据库服务
dbcontroller.prototype.start = function(){
    this.connect(this.dbUrl)
}

dbcontroller.prototype.connect = function(url){
    mongoose.connect(url,function(err){
        if(err)
            console.log('连接数据库失败')
        else
            console.log('连接数据库成功')
    })
}

module.exports = dbcontroller