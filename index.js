const dotenv=require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const user=require('./routes/user.js')
const product=require('./routes/product')
const cart=require('./routes/cart')
const order=require('./routes/order')


app.use(express.json());
app.use('/api/user',user)
app.use('/api/product',product)
app.use('/api/cart',cart)
app.use('/api/order',order)



mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));


  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Listening on port ${port}...`));  
  

