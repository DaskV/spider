const mongoose = require('mongoose')
require('./db.model')

const sortsModel =  mongoose.model('sorts')
const regionsModel = mongoose.model('regions')
const comicStateModel = mongoose.model('comicState')
const comicsModel = mongoose.model('comics')



//获取分类
exports.sortsGet = async (param) =>{  
    return await sortsModel.find(param,err =>{
        if(err){
            console.log('get sorts失败',err)
            return
        } 
    })
}
//分类保存
exports.sortsSave =  async (param) =>{   
    const sorts = new sortsModel(param)
    const exists = await sortsModel.findOne({"name":param.name})
    if(!exists){
        sorts.save(err=>{
            if(err){
                console.log('save sorts失败',err)
                return
            }
        })
    }
    else{
        sorts.update({"url":param.url})
    }
}


//获取地区
exports.regionsGet = async (param) =>{  
    return await regionsModel.find(param,err =>{
        if(err){
            console.log('get sorts失败',err)
            return
        } 
    })
}

//保存地区
exports.regionsSave =  async (param) =>{   
    const regions = new regionsModel(param)
    const exists = await regionsModel.findOne({"name":param.name})
    if(!exists){
        regions.save(err=>{
            if(err){
                console.log('save sorts失败',err)
                return
            }
        })
    }
    else{
        regions.update({"url":param.url})
    }
}

// exports.regionsCompare = async (name,next = false)=>{
//     let list = await this.regionsGet(name)   
//     if(list.length == 0 && next){
//         await this.regionsSave(name)
//         list = await this.regionsGet(name)
//     }
//     return list
// }


// exports.regionsGet = async (name)=>{
//     return await regionsModel.find({"name":name},(err) =>{
//         if(err){
//             console.log('get regions失败',err)
//             return
//         }
//     })
// }

// exports.regionsSave = async (name) =>{  
//     const exists = await regionsModel.findOne({"name":name})  
//     if(!exists){
//         const regions = new regionsModel({"name":name})
//         regions.save(err=>{
//             if(err){
//                 console.log('save regions 失败',err)
//             }
//         })
//     }
    
// }


//获取动漫
exports.comicsGet = async (name) =>{
    return await comicsModel.find({"name":name},(err) =>{
        if(err){
            console.log('get regions失败',err)
            return
        }
    })
}

//获取动漫保存
exports.comicsSave = async (param) =>{
    const comics = new comicsModel(param)
    const exists = await comicsModel.findOne({"name":param.name})
    if(!exists){
        comics.save(err=>{
            if(err){
                console.log('save sorts失败',err)
                return
            }
        })
    }
    else{
        comics.update(param)
    }
}