import {ShowInfo} from './tvT/types'
import * as aList from './anilis/func'
import { QuickDB } from 'quick.db';
const db = new QuickDB({filePath:"./data.sqlite"});
const q = require('../my_modules/quick.db')
const db2 = q('./local.sqlite')
import * as tvTime from './tvT/index'
import {SeasonWatch} from './types'


export async function getWatched (tvRes:ShowInfo):Promise<SeasonWatch[]> {
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



   export let matchSeasons = async (data:any[],data2:any[]) => {
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

   export  const syncShow= async(id:string)=>{
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
    
export async function sleep(ms: number) {
    return new Promise((sendMessage) => setTimeout(sendMessage, ms))
}

