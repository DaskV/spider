const mongoose = require('mongoose')
const methods = require('./db.methods')

function dbcontroller(){
    // this.dbUrl = 'mongodb://148.70.112.142:27017/'
    this.dbUrl = 'mongodb://127.0.0.1:27017/'
    this.methods = methods
}

//开启数据库服务
dbcontroller.prototype.start = function(){
    this.connect(this.dbUrl)
}

//连接数据库
dbcontroller.prototype.connect = function(url){
    mongoose.connect(url,(err)=>{
        if(err){
            console.log(err)
            // console.log('数据库连接失败')
        }          
        else{
            console.log('数据库连接成功')       
        }       
    })
}

//断开数据库
dbcontroller.prototype.disconnect = function(url){
    mongoose.disconnect(function(){
        console.log('数据库连接已断开')
    })
}



module.exports = dbcontroller