const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
//分类
const sorts = new Schema({
    name: String,
    url:String
})


//地区
const regions = new Schema({
    name: String,
    url:String
})


//动漫状态
const comicState = new Schema({
    stateId: ObjectId,
    name: String
})


//动漫
const comics = new Schema({
    name: String,
    sortId: Array,
    regionId: ObjectId,  
    cover:String,
    describe: String,
    url:String
})



mongoose.model('sorts', sorts)
mongoose.model('regions', regions)
mongoose.model('comicState', comicState)
mongoose.model('comics', comics)