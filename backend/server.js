const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan')
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

dotenv.config({path: './config/config.env'});
connectDB();

//Import route files
const authentication = require('./routes/authentication');
const users = require('./routes/users');
const items = require('./routes/items');
const carts = require('./routes/carts');

const app = express();

app.use(express.json());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
//Sanitize Data
app.use(mongoSanitize());

//Security headers 
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Rate limit
const limiter =  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
});

app.use(limiter);

//Prevent HTTP param pollution
app.use(hpp());

//Enable CORS
app.use(cors());

app.use(fileupload({
    debug: true
}));
app.use(cookieParser({
    debug: true
}));

app.use(express.static(path.join(__dirname, 'public')));

//routes goes here
app.use('/elduCrochet/users', users);
app.use('/elduCrochet/authentication', authentication);
app.use('/elduCrochet/items', items);
app.use('/elduCrochet/carts', carts);

app.use(errorHandler);

const PORT= process.env.PORT || 5000;

const server = app.listen(
    PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on ${PORT}`)
);

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)

    server.close(() => process.exit(1))
});
