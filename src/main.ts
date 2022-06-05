import * as tvTime from 'tvtime-api'
import * as aList from './anilis/func'
import { QuickDB } from 'quick.db';
import {syncShow, sleep} from './functions'
const db = new QuickDB({filePath:"./data.sqlite"});
const q = require('../my_modules/quick.db')
const db2 = q('./local.sqlite')

const main = async () => {
    require('dotenv').config();
    const myCred= process.env.bb!
    const cache = new db2.table('cache')
    let complete=    await cache.get('synced')

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










