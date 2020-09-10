const mongoose = require('mongoose');
//Database name : curd_Application
mongoose.connect('mongodb://localhost:27017/curd_Application')
    .then( ()=> {
        console.log('Database Connected')
    })
    .catch( err => {
        console.log(err)
    })

require('./model');