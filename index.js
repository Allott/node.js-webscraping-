const parser = require("know-parser");
const cheer = require("cheerio");
const request = require("request");
const fs = require("file-system");

var enquiries = [];
var results = [];

// args
var myArgs = process.argv;
for (i=2; i < myArgs.length -1; i++)
{
    switch(myArgs[i].toLowerCase()) {
        case 'all':
        case 'a':
            enquiries.push("emails");
            enquiries.push("phones");
            enquiries.push("links")
            enquiries.push("domains")
            break;
        
        default:
            enquiries.push(myArgs[i])
            break;
    }
}

// final arg is the web address
var webAddress = myArgs[i];

console.log(`Connecting to ${webAddress} `);

// connect to the webpage
request("http://www." + webAddress, (error, response, html) => {
    if(error) {
        console.log(`Connection failed ${error}`)
    }
    else{
        console.log(`Connected finding:${enquiries}`)
        var $ = cheer.load(html); //load HTML into cheer
        let text = $('body').text();//get all the text in body
        //console.log(text);//remove this
        //here


        const knowParser = new parser(text);
        //get each enquirie and put into results
        enquiries.forEach(enq => {
            results.push(knowParser.get(enq));
        });

        //create output string

        var outputString = "";
        for (i=0; i < enquiries.length; i++)
        {
            outputString += enquiries[i] + "\n";
            outputString += results[i] + "\n";
        }
        
        //console.log(results);
        var fileName = webAddress.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        fs.writeFile(`./results/${fileName}.txt`,outputString, function(err) {
           if (err) {console.log(err)}});
    }
})