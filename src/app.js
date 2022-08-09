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

const addAllItems = async() => {
  getFilings().then(async(res) => {
    for(let i=0;i<res.length;i++){
      await axios.post(`http://[::1]:${process.env.PORT}/addFiling?url=${res[i]}`)
    } 
  })
}

const findNewItems = () =>{
  getFilings().then(async(res)=>{
    for(let i =0;i<res.length;i++)
      await axios.get(`http://[::1]:${process.env.PORT}/getFilingByUrl?url=${res[i]}`)
      .then(res => {
        //console.log(res.status)
      }).catch(async error => {
        if(error.response.status === 404){
          handleNewItem(baseUrl+res[i])
          await axios.post(`http://[::1]:${process.env.PORT}/addFiling?url=${res[i]}`)
        }
        else{
          console.log(error.response.status)
        }
      })
  })
}
//Gets called if 404 response from local database (Item doesnt exist yet)
const handleNewItem = async (link) => {
  await downloadDisclosures(link)
  const filerName = await getFilerName()
  if(await hasStockReport()){
    let tweet = `${filerName} has filed a new stock trade \n\nSource: ${link} \n\n#${filerName.replaceAll(' ','')} #stocks #trading`
    await convertPDFtoPNG() //converts the most recent report to an image to be uploaded by twitter
    //sendTweet(tweet)
    console.log(tweet)
  }
}

findNewItems()

cron.schedule('*/10 * * * *', () => {
  findNewItems()
}, {
  scheduled: true,
});
