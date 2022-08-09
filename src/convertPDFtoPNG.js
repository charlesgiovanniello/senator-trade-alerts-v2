const { fromPath } = require("pdf2pic")
const convertPDFtoPNG = () =>{
    return new Promise((resolve)=>{
        const options = {
            saveFilename: "pngtemp",
            savePath: "./download/images",
            width: 2550,
            height: 3300,
            density: 330,
        };
        const storeAsImage = fromPath("./download/disclosures/disclosure.pdf", options);
        const pageToConvertAsImage = 1;
        
        storeAsImage(pageToConvertAsImage).then((resolve) => {
          console.log("Page 1 is now converted as image");
          return resolve;
        }).then(()=>{resolve()});
    })
}

module.exports={
    convertPDFtoPNG
}