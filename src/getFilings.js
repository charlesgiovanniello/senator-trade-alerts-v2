const axios = require('axios');


const getFilings = () => {
    return new Promise((resolve,reject)=>{
        const url="https://disclosures-clerk.house.gov/PublicDisclosure/FinancialDisclosure/ViewMemberSearchResult"
        let year = (new Date()).getFullYear().toString()

        let regexString = `(\\/public_disc\\/ptr-pdfs\\/${year}\\/)(\\w.*)pdf`
        let regex = new RegExp(regexString,'gm')

        axios
        .post(url)
        .then(res => {
            console.log(`statusCode: ${res.status}`);
            const resArr = (res.data).match(regex)
            resolve(resArr);
        })
        .catch(error => {
            console.error(error);
            reject()
        });
        
    })
}

module.exports = {getFilings}
