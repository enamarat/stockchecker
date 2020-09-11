/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
const fetch = require('node-fetch');

const {Stock} = require('../models/models.js');

module.exports = function (app) {
  // functions
 async function findStockInTheDatabase(ticker, like, ip) {
    await Stock.find({stock: ticker}).then(async function(data) { 
       if (data.length > 0) {
         if (like) {
           // update likes only if like is sent from a different ip than previous likes
           if (data[0].visitors.indexOf(ip) === -1) {
              Stock.findOneAndUpdate({stock: ticker}, 
              {$inc : {'likes' : 1},  $push: { visitors: ip } }, {new: true}, 
              function(err, response) {
              if (err) {
                console.log(err);
              } else {
                console.log(response);
              }
             });
           }
         }
        } else if (data.length === 0) {
        // if nothing is found create a document for the symbol
          if (like) {
            const newStock = new Stock({
              stock: ticker,
              likes: 1
            });
            newStock.visitors.push(ip);
            await newStock.save();
          } else if (!like) {
            const newStock = new Stock({
              stock: ticker,
              likes: 0
            });
            await newStock.save();
          }
        }
      });
 }
  
  function showLikes(ticker) {
    return Stock.find({stock: ticker}).then(function(data) {
      return data[0].likes;
    });
  }
  
  // routes
  app.route('/api/stock-prices')
    .get(async function (req, res){
    const symbol = req.query.stock;
    const like = req.query.like;
   
    // if a string is returned than one stock ticker was requested
    if (typeof symbol === "string") {
      findStockInTheDatabase(symbol, like, req.ip);
      const response = await fetch(`https://stock-price-checker-proxy--freecodecamp.repl.co/v1/stock/${symbol}/quote`);
      const jsonResponse = await response.json();
   
      let likes = null;
      await showLikes(symbol).then(function(result) {
         likes = result;
       });
      
       res.json({
           stockData: {
             stock: jsonResponse.symbol,
             price: jsonResponse.latestPrice.toString(),
             likes: likes
           } 
       });
      
    // if an object is returned than two stock tickers were requested
    } else if (typeof symbol === "object") {
       findStockInTheDatabase(symbol[0], like, req.ip);
       findStockInTheDatabase(symbol[1], like, req.ip);
       const responseFirstStock = await fetch(`https://stock-price-checker-proxy--freecodecamp.repl.co/v1/stock/${symbol[0]}/quote`);
       const jsonResponseFirstStock = await responseFirstStock.json();
       const responseSecondStock = await fetch(`https://stock-price-checker-proxy--freecodecamp.repl.co/v1/stock/${symbol[1]}/quote`);
       const jsonResponseSecondStock = await responseSecondStock.json();
     
        let likes1 = null;
      await showLikes(symbol[0]).then(function(result) {
         likes1 = result;
       });
      
        let likes2 = null;
      await showLikes(symbol[1]).then(function(result) {
         likes2 = result;
       });
       
       // show data
       res.json({
         stockData: [
           {
             stock: jsonResponseFirstStock.symbol,
             price: jsonResponseFirstStock.latestPrice.toString(),
             rel_likes: likes1-likes2
           }, 
           {
             stock: jsonResponseSecondStock.symbol,
             price: jsonResponseSecondStock.latestPrice.toString(),
             rel_likes: likes2-likes1
           }
         ]
       });
    }
  });
};
