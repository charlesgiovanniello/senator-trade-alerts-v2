const fs = require('fs');
const pdf = require('pdf-parse');
 
//Checks if PDF includes the stock identifier ([ST])
const hasStockReport = () =>{
    return new Promise((resolve,reject)=>{
        let dataBuffer = fs.readFileSync('./download/disclosures/disclosure.pdf');
        pdf(dataBuffer).then(function(data) {
            //console.log(data.text)
            if(data.text.includes('[ST]')){
                resolve(true)
            }
            resolve(false)
        });
    })
}
const getFilerName = () =>{
    return new Promise((resolve)=>{
        let dataBuffer = fs.readFileSync('./download/disclosures/disclosure.pdf');
        pdf(dataBuffer).then(function(data) {
            //console.log(data.text)
            try{
                const filerName = (data.text.match(/(?<=name:|Name:).*(?=\n)/gm)[0]).replace("Hon","").replace(".","").replace(" ","")
                resolve(filerName)
            }catch(e){
                console.log(data.text)
                resolve('Senator')
            }
        });
    })
}

module.exports={
    hasStockReport,
    getFilerName
}