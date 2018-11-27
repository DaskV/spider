
const spider = require('./spider/spider')
const schedule = require("node-schedule")

// const task = () =>{
//     schedule.scheduleJob('30 1 1 * * *', ()=>{
//         console.log('开始执行爬虫任务:'+ new Date())
//         let spideRob = new spider()
//         spideRob.start()
//     })
// }
// task()

        let spideRob = new spider()
        spideRob.start()



