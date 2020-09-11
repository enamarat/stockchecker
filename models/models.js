const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const stockSchema = new Schema({
  stock: {type: String},
  likes: {type: Number},
  visitors: []
});

const Stock = mongoose.model('Stock', stockSchema);
  
module.exports = {
 Stock
}