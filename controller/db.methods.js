const mongoose = require('mongoose')
require('./db.model')

const sortsModel =  mongoose.model('sorts')
const regionsModel = mongoose.model('regions')
const comicsModel = mongoose.model('comics')
const comicsFailModel = mongoose.model('comicsFail')




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
}



//获取动漫
exports.comicsGet = async (param) =>{
    return await comicsModel.find(param,(err) =>{
        if(err){
            console.log('get comics失败',err)
            return
        }
    })
}

//动漫保存
exports.comicsSave = async (param) =>{
    const comics = new comicsModel(param)
    const exists = await comicsModel.findOne({"name":param.name})
    if(!exists){
        comics.save(err=>{
            if(err){
                console.log('save comics失败',err)
                return
            }
        })
    }
    else{
        comics.update(param)
    }
}


//更新动漫剧集
exports.comicsChildSave = async (name,child) =>{
    await comicsModel.update({'name':name},{ children:child },{ multi :true },function(err){
        if(err){
            console.log(`更新${name} 剧集失败`,err)
            return
        }
        console.log(`更新${name} 剧集成功`)
    })
}


//追加动漫剧集
exports.comicsChildAppend = async (id,child) =>{
    await comicsModel.update({'id':id},{ '$push':{ children : child } },function(err){
        if(err){
            console.log(`追加剧集失败`,err)
            return
        }
        console.log(`追加剧集成功`)
    })
}

//失败链接保存
exports.comicsFailSave = async (param) =>{
    const comicsFail = new comicsFailModel(param)
    const exists = await comicsFailModel.findOne({"url":param.url})
    if(!exists){
        comicsFail.save(err=>{
            if(err){
                console.log('save comicsFail失败',err)
                return
            }
        })
    }
}

//获取失败链接列表
exports.comicsFailGet = async (param) =>{
    return await comicsFailModel.find({},(err) =>{
        if(err){
            console.log('get comicsFail失败',err)
            return
        }
    })

}

//删除失败链接
exports.comicsFailRemove = async (id) =>{
    comicsFailModel.findByIdAndRemove(id,(err)=>{
        if(err){
            console.log('remove comicsFail失败',err)
            return
        }
    })
}