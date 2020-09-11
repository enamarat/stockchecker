/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
         chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'f'})
        .end(function(err, res){
          
          //complete this one too
           assert.equal(res.body.stockData.stock, 'F');
           assert.equal(res.body.stockData.likes, 0);
           const regex = /[0-9]+\.?[0-9]+?/;
           assert.equal(regex.test(res.body.stockData.price), true);
           done();
        });
      });
      
      test('1 stock with like', function(done) {
         chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'm', like: true})
        .end(function(err, res){
           assert.equal(res.body.stockData.stock, 'M');
           assert.equal(res.body.stockData.likes, 1);
           const regex = /[0-9]+\.?[0-9]+?/;
           assert.equal(regex.test(res.body.stockData.price), true);
           done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
         chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'm', like: true})
        .end(function(err, res){
           assert.equal(res.body.stockData.stock, 'M');
           assert.equal(res.body.stockData.likes, 1);
           const regex = /[0-9]+\.?[0-9]+?/;
           assert.equal(regex.test(res.body.stockData.price), true);
           done();
        });
      });
      
      test('2 stocks', function(done) {
         chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['amd', 'intc']})
        .end(function(err, res){
          assert.equal(res.body.stockData[0].stock, 'AMD');
          assert.equal(res.body.stockData[1].stock, 'INTC');
          assert.equal(res.body.stockData[0].rel_likes, 0);
          assert.equal(res.body.stockData[1].rel_likes, 0);
          const regex = /[0-9]+\.?[0-9]+?/;
          assert.equal(regex.test(res.body.stockData[0].price), true);
          assert.equal(regex.test(res.body.stockData[1].price), true);
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
         chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['amd', 'intc'], like: true})
        .end(function(err, res){
          //console.log(res.body);
          assert.equal(res.body.stockData[0].stock, 'AMD');
          assert.equal(res.body.stockData[1].stock, 'INTC');
          assert.equal(res.body.stockData[0].rel_likes, 0);
          assert.equal(res.body.stockData[1].rel_likes, 0);
          const regex = /[0-9]+\.?[0-9]+?/;
          assert.equal(regex.test(res.body.stockData[0].price), true);
          assert.equal(regex.test(res.body.stockData[1].price), true);
          done();
        });
      });
      
    });

});
