import fetch from 'node-fetch';
import axios from 'axios'
import * as aList from './anilis/func'
var request = require('request');
require('dotenv').config();


(async () => {
  const myCred= process.env.bb!

    await  aList.fetchUserData(myCred).then(async(res) => {
         console.log(res)
    let m =await aList.fetchAnilistMedia('game of thrones')
         console.log(m)
        // aList.updateUserList(m.id,6,7,myCred).then(console.log)
        //aList.addMediaIdToList(m.id,myCred).then(console.log)
                aList.setMediaStatus(m.Media.id,myCred,'PLANNING').then(console.log)

        //aList.setMediaStatus(m.id,myCred,'COMPLETED').then(console.log)
      
     
     }).catch(console.log)

     //aList.createThread('Desuwa',myCred).then(console.log).catch(console.log)



    })()
    



  