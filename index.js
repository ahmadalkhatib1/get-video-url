const express = require('express')
const app = express()
const path = require("path");
const request = require('request');
const cheerio = require('cheerio');
const checkif = require('./modules/checkif');

app.use(express.static(path.join(__dirname, "public")));


function MyCima(link, res) {
  request(link, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      const serverUrl = $('.MyCimaServer btn').attr('data-url');

      request(serverUrl, (error, response, html) => {
        if (!error && response.statusCode == 200) {
          const $ = cheerio.load(html);
          const videoUrl = $('video > source').attr('src');


          res.redirect(videoUrl);
          console.log(videoUrl);
        }
      });
    }
  });
}


app.get('/', (req, res) => {
  var link = req.query.url;
  if(!link) return res.send(`Error`);
  if(checkif.isURL(link) == false) return res.send(`Please enter a valid URL`);
  if(!link.includes('http://'||'https://')) link = 'https://'+link;
  
  MyCima(link, res)
  
})



app.listen(8081)