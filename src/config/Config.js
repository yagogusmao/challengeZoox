const mongoose = require('mongoose');
require('dotenv').config();

process.env.DATABASE ?
    mongoose.connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    :
    console.log("Não foi possível se conectar ao banco.")

mongoose.set('useCreateIndex', true);