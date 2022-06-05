import * as tvTime from 'tvtime-api'
import {ShowInfo} from 'tvtime-api/src/types'
import * as aList from './anilis/func'
const q = require('../my_modules/quick.db')
const db = q('./local.sqlite')

const main = async () => {
    require('dotenv').config();
    const myCred= process.env.bb!
    const cache = new db.table('cache')

await tvTime.login(process.env.TVuser!, process.env.TVpass!)
//await tvTime.shows().then(console.log)

try {
//await syncShow('289886')
await cache.set('well','done')
}catch{
    console.log('Normie')
}

}

























main()
process.on('uncaughtExeption', async (exp) => {
    console.log('uncaught exeption  ' + exp)
})
process.on('unhandledRejection', (err) => {
    console.log(err)
   
})

let getWatched = async (tvRes:ShowInfo) => {
let season:any=[]
tvRes.seasons.forEach(s=>{
    let epiT = s.episodes.length
    let epiW = s.episodes.filter(e=>e.watched).length
    let sesN = s.name
    let stat = epiW==0?'PLANNING':epiW==epiT?'COMPLETED':'IN_PROGRESS'
    let year = s.episodes[0].airDate.split('-')[0]
    season.push({season:sesN,episodes:epiT,watched:epiW,status:stat,year:year})
})
return season;
}

let matchSeasons = async (data:any[],data2:any[]) => {
    let final :any[]=[]
data.forEach(d=>{
    let obj:any = {}
   
let found =data2.find(d2=>d2.seasonYear.toString()==d.year)
console.log(found)
// data2.forEach(d2=>{
//     console.log(d2.seasonYear.toString())
//     console.log(d.year)
// })
obj['tvT']= d
obj['anilist']= found	
if (found) final.push(obj)


})

console.log(JSON.stringify(final,undefined,2))
return final
}










const syncShow= async(id:string)=>{
    require('dotenv').config();
    const myCred= process.env.bb!

    let show = await tvTime.show(id)
    //console.log(JSON.stringify(show,undefined,2))
    let watched =await getWatched(show)
    //console.log(watched)
   console.log(show.name)
    let aniS =await aList.fetchAnilistMedia(show.name)
    //    console.log(JSON.stringify(aniS,undefined,2))
    
    let aniArr =aniS.Media.relations.nodes.filter((n:any)=>n.type=='ANIME')
    
    if(watched[0].status=='COMPLETED'){
    await aList.setMediaStatus(aniS.Media.id,myCred,'COMPLETED').then(console.log)
    }else if(watched[0].status=='PLANNING'){
        await aList.setMediaStatus(aniS.Media.id,myCred,'PLANNING').then(console.log)
    }else{
    await aList.updateUserList(aniS.Media.id,watched[0].watched,7,myCred).then(console.log)    
    await aList.setMediaStatus(aniS.Media.id,myCred,'PAUSED').then(console.log)
    }
    
    
    
    if (watched.length>1) {
        let matched =await matchSeasons(watched,aniArr)
        matched.forEach(async(m)=>{
            if(watched[0].status=='COMPLETED'){
                await       aList.setMediaStatus(m.anilist.id,myCred,'COMPLETED').then(console.log)}else if(watched[0].status=='PLANNING'){
                    await aList.setMediaStatus(m.anilist.id,myCred,'PLANNING').then(console.log)
                }else{
                    await          aList.updateUserList(m.anilist.id,m.tvT.watched,7,myCred).then(console.log)    
                    await           aList.setMediaStatus(m.anilist.id,myCred,'PAUSED').then(console.log)
                }
        })
    
    }
    
}