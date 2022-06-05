import * as tvTime from 'tvtime-api'
import {ShowInfo} from 'tvtime-api/src/types'
import * as aList from './anilis/func'
import { QuickDB } from 'quick.db';
const db = new QuickDB({filePath:"./data.sqlite"});
import { getWatched,syncShow } from './functions';
import {SeasonWatch} from './types'
import { Console } from 'console';
import cron from 'node-cron'

const main = async () => {
    require('dotenv').config();
    const myCred= process.env.bb!


    await tvTime.login(process.env.TVuser!, process.env.TVpass!)
    tvTime.recent().then(async (res) => {
        let records:any = await db.get(`showsRecords`)
        console.log(records);
    for (let i = 0; i < res.length; i++) {
        let show= res[i]
       
            console.log(show.name)
            let showData = await tvTime.show(show.id)
            let watchData = await getWatched(showData)
            console.log(watchData)

            watchData.forEach(async (season) => {
                let newWatched= season.watched
                season['name']= show.name+ ' '+ season.season
                if(records && records[show.id+'_'+season.season.replace(' ','')]?.watched!==newWatched ){
                    syncShow(show.id)
                    }
                       await db.set(`showsRecords.${show.id+'_'+season.season.replace(' ','')}`,season)
                        
            })
            //db.set(`shows.${show.id}`,show)
        
    }

    }).catch(console.log)
}

cron.schedule('*/10 * * * *', () => main())
