const http = require('https');
const fs = require('fs');

const downloadDisclosures = (url) =>{
    return new Promise((resolve)=>{
        const filePath = './download/disclosures/disclosure.pdf'
        const file = fs.createWriteStream(filePath);
        http.get(url, function(response) {
            response.pipe(file);
        })
        file.on("finish", ()=>{
            resolve()
        })
    })
}

module.exports={
    downloadDisclosures
}