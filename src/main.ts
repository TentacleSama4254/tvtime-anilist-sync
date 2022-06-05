import * as tvTime from './tvT/index'
import * as aList from './anilis/func'
import { QuickDB } from 'quick.db';
import {syncShow, sleep} from './functions'
const cache = new QuickDB({filePath:"./data.sqlite"});

const main = async () => {
    require('dotenv').config();
    const myCred= process.env.bb!
    let complete:any=    await cache.get('synced')

await tvTime.login(process.env.TVuser!, process.env.TVpass!)
const allShows =await tvTime.shows()

for (let i = 0; i < allShows.length; i++) {
    const show = allShows[i]
    
    try {
       if(!complete?.includes(show.id)) await syncShow(show.id)
       await cache.push('synced',show.id)
        }catch(e){
            //console.log(e)
            console.log('Normie')
            await cache.push('failed',show.id)

        }
        await sleep(500)
}



}

























main()
process.on('uncaughtExeption', async (exp) => {
    console.log('uncaught exeption  ' + exp)
})
process.on('unhandledRejection', (err) => {
    console.log(err)
   
})










