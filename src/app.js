const express = require("express")
require('./db/mongoose')
const {getFilings} = require('./getFilings')
const {downloadDisclosures} = require('./downloader')
const {hasStockReport,getFilerName} = require('./pdfAnalyzer')
const {convertPDFtoPNG} = require('./convertPDFtoPNG')
const router = require('./routers/router')
const axios = require('axios');
const cron = require('node-cron');
const {sendTweet} = require('./twitter')

const app = express()

app.use(express.json())
app.use(router)
module.exports = app

const baseUrl = "https://disclosures-clerk.house.gov"

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const addAllItems = async() => {
  getFilings().then(async(res) => {
    for(let i=0;i<res.length;i++){
      await axios.post(`http://localhost:${process.env.PORT}/addFiling?url=${res[i]}`)
    } 
  })
}


const findNewItems = () =>{
  getFilings().then(async(res)=>{
    for(let i =0;i<res.length;i++){
      try{
        await axios.get(`http://localhost:${process.env.PORT}/getFilingByUrl?url=${res[i]}`)
        .then(res => {
          //console.log(res.status)
        }).catch(async error => {
          if(error.response.status === 404){
            await handleNewItem(baseUrl+res[i])
            await axios.post(`http://localhost:${process.env.PORT}/addFiling?url=${res[i]}`)
          }
          else{
            console.log(error.response.status)
          }
        })
      }catch(e){
        console.log(e)
      }
      //await sleep(500)
    }
  })
}

//Gets called if 404 response from local database (Item doesnt exist yet)
const handleNewItem = (link) => {
  return new Promise(async(resolve)=>{
    await downloadDisclosures(link)
    const filerName = await getFilerName()
    if(await hasStockReport()){
      let tweet = `Senator ${filerName} has filed a new stock trade \n\nSource: ${link} \n\n#${filerName.replaceAll(' ','').replace(".","")} #stocks #trading`
      await convertPDFtoPNG() //converts the most recent report to an image to be uploaded by twitter
      sendTweet(tweet)
      console.log(tweet)
      resolve()
    }
    resolve()
  })
}

// async function main() {
//   await axios.get(`http://localhost:${process.env.PORT}/getFilingByUrl?url=/public_disc/ptr-pdfs/2022/20021323.pdf`)
// }

// main()
//findNewItems()

cron.schedule('02 09 * * 1-5', () => {
  findNewItems()
}, {
  scheduled: true,
});