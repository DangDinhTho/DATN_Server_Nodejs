const express = require('express')
const connectDB = require('./config/db')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const router = require('./routers/index')

const app = express();
connectDB();
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(router);



// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'))
// }

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server is running on port ${PORT}`))