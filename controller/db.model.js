const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

//剧情分类
const sorts = new Schema({
    name: String,
    url:String,
    belong:String
})


//地区
const regions = new Schema({
    name: String,
    url:String,
    belong:String
})

//动漫
const comics = new Schema({
    name: String,
    sortId: Array,
    regionId: String,  
    state:String,
    cover:String,
    describe: String,
    cv:String,
    url:String,
    children:Array,
    types:String
})

//爬取失败
const comicsFail = new Schema({
    link:Number,
    url:String,
    parent:Object,
    child:Object
})

//banner 记录
const banner = new Schema({
    comicsId:ObjectId,
    comicsName:String,
    cover:String,
    updateTime:Date
})



mongoose.model('sorts', sorts)
mongoose.model('regions', regions)
mongoose.model('comics', comics)
mongoose.model('comicsFail', comicsFail)
mongoose.model('banner', banner)

