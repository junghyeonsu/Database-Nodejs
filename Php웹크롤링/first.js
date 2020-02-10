// var express = require('express');
// var app = express();
// var bodyParser = require("body-parser");

// app.use(bodyParser.urlencoded({extended : false}));
// app.use(bodyParser.json());

// app.get('/',(req,res) => {
//     res.send("Hello World");
// })

// app.listen(4000,function(){
//     console.log("Hello");
// })

const axios = require("axios");
const cheerio = require("cheerio");
const express = require('express');
const app = express();

const getHtml = async () => {
  try {
    return await axios.get("https://sports.news.naver.com/esports/index.nhn");
  } catch (error) {
    console.error(error);
  }
};

getHtml()
  .then(html => {
    let ulList = [];
    const $ = cheerio.load(html.data);
    const $bodyList = $("div.good_news ol.news_list").children("li");

    $bodyList.each(function(i, elem) {
      ulList[i] = {
          number: $(this).find('span.number').text(),
          title: $(this).find('a.link_news_end').text(),
          url: $(this).find('a.link_news_end').attr('href'),
        //   image_alt: $(this).find('p.poto a img').attr('alt'),
        //   summary: $(this).find('p.lead').text().slice(0, -11),
        //   date: $(this).find('span.p-time').text()
      };
    });

    const data = ulList.filter(n => n.number);
    app.get('/',function(req,res){
        res.send(`
        https://sports.news.naver.com/${data[0].url}
        `);
    })
    app.listen(5300,function(){
        console.log("크라울링 완룔~");
    })
    return data;
  })
  .then(res => console.log(res));