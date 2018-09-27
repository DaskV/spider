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
    name: String
})


//动漫状态
const comicState = new Schema({
    stateId: ObjectId,
    name: String
})


//动漫
const comics = new Schema({
    name: String,
    sortId: ObjectId,
    regionId: ObjectId,
    regionName:String,   
    stateId: ObjectId,
    stateName:String,
    point: String,
    cover:String,
    describe: String,
    year: String,
    plays: [Schema.Types.Mixed]
})



mongoose.model('sorts', sorts)
mongoose.model('regions', regions)
mongoose.model('comicState', comicState)
mongoose.model('comics', comics)