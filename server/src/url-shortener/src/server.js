import express from 'express'
import bodyParser from 'body-parser'
import connectDB from './config/database.js'
import shortenerRoutes from './routes/url-shortener-route.js'


const app = express();
const PORT = 3000;

//config bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect DB
connectDB();


app.use('/shorten', shortenerRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});