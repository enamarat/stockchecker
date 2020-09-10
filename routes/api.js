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
  /*async function makeAnAPIRequest(ticker, res, likes) {
     const response = await fetch(`https://stock-price-checker-proxy--freecodecamp.repl.co/v1/stock/${ticker}/quote`);
     const jsonResponse = await response.json();
  }*/
  
 function findStockInTheDatabase() {
   
 }
  
  // routes
  app.route('/api/stock-prices')
    .get(async function (req, res){
    const symbol = req.query.stock;
    const like = req.query.like;
    
   
    // if a string is returned than one stock ticker was requested
    if (typeof symbol === "string") {
      let likes = null;
      // search for the symbol in the database
     await Stock.find({symbol: symbol}).then(async function(data) { 
       if (data.length > 0) {
         likes = data[0].likes;
         if (like) {
           // update likes only if like is sent from a different ip than previous likes
           if (data[0].visitors.indexOf(req.ip) === -1) {
              Stock.findOneAndUpdate({symbol: symbol}, 
              {$inc : {'likes' : 1},  $push: { visitors: req.ip } }, {new: true}, 
              function(err, response) {
              if (err) {
                console.log(err);
              } else {
                likes += 1;
                console.log(response);
              }
             });
           }
         }
        } else if (data.length === 0) {
        // if nothing is found create a document for the symbol
          if (like) {
            const newStock = new Stock({
              symbol: symbol,
              likes: 1
            });
            likes = 1;
            newStock.visitors.push(req.ip);
            await newStock.save();
          } else if (!like) {
            const newStock = new Stock({
              symbol: symbol,
              likes: 0
            });
            likes = 0;
            await newStock.save();
          }
        }
       
      ///
      });
    
       // make an API call
      ///makeAnAPIRequest(symbol, res, likes);
       
      const response = await fetch(`https://stock-price-checker-proxy--freecodecamp.repl.co/v1/stock/${symbol}/quote`);
       const jsonResponse = await response.json();
       //console.log(jsonResponse); 
       // show data
       res.json({
           stockData: {
             stock: jsonResponse.symbol,
             price: jsonResponse.latestPrice.toString(),
             likes: likes
           } 
       });
      
    // if an object is returned than two stock tickers were requested
    } else if (typeof symbol === "object") {
      let likes = null;
      // first stock
       await Stock.find({symbol: symbol[0]}).then(async function(data) { 
       if (data.length > 0) {
         likes = data[0].likes;
         if (like) {
           // update likes only if like is sent from a different ip than previous likes
           if (data[0].visitors.indexOf(req.ip) === -1) {
              Stock.findOneAndUpdate({symbol: symbol[0]}, 
              {$inc : {'likes' : 1},  $push: { visitors: req.ip } }, {new: true}, 
              function(err, response) {
              if (err) {
                console.log(err);
              } else {
                likes += 1;
                console.log(response);
              }
             });
           }
         }
        } else if (data.length === 0) {
        // if nothing is found create a document for the symbol
          if (like) {
            const newStock = new Stock({
              symbol: symbol[0],
              likes: 1
            });
            likes = 1;
            newStock.visitors.push(req.ip);
            await newStock.save();
          } else if (!like) {
            const newStock = new Stock({
              symbol: symbol[0],
              likes: 0
            });
            likes = 0;
            await newStock.save();
          }
        }
      });
      
      // second stock
       await Stock.find({symbol: symbol[1]}).then(async function(data) { 
       if (data.length > 0) {
         likes = data[0].likes;
         if (like) {
           // update likes only if like is sent from a different ip than previous likes
           if (data[0].visitors.indexOf(req.ip) === -1) {
              Stock.findOneAndUpdate({symbol: symbol[1]}, 
              {$inc : {'likes' : 1},  $push: { visitors: req.ip } }, {new: true}, 
              function(err, response) {
              if (err) {
                console.log(err);
              } else {
                likes += 1;
                console.log(response);
              }
             });
           }
         }
        } else if (data.length === 0) {
        // if nothing is found create a document for the symbol
          if (like) {
            const newStock = new Stock({
              symbol: symbol[1],
              likes: 1
            });
            likes = 1;
            newStock.visitors.push(req.ip);
            await newStock.save();
          } else if (!like) {
            const newStock = new Stock({
              symbol: symbol[1],
              likes: 0
            });
            likes = 0;
            await newStock.save();
          }
        }
      });
      
      
       const responseFirstStock = await fetch(`https://stock-price-checker-proxy--freecodecamp.repl.co/v1/stock/${symbol[0]}/quote`);
       const jsonResponseFirstStock = await responseFirstStock.json();
       const responseSecondStock = await fetch(`https://stock-price-checker-proxy--freecodecamp.repl.co/v1/stock/${symbol[1]}/quote`);
       const jsonResponseSecondStock = await responseSecondStock.json();
     // console.log(jsonResponseFirstStock);
    //  console.log(jsonResponseSecondStock);
       
       // show data
       res.json({
         stockData: [
           {
             stock: jsonResponseFirstStock.symbol,
             price: jsonResponseFirstStock.latestPrice.toString(),
             rel_likes: likes
           }, 
           {
             stock: jsonResponseSecondStock.symbol,
             price: jsonResponseSecondStock.latestPrice.toString(),
             rel_likes: likes
           }
         ]
       });
      
      
    }
  
  });
};
