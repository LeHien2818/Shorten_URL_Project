import express from 'express'
import connectDB from './config/database.js'
import bodyParser from 'body-parser'
import urlExpanderRoute from './routes/url-expander-route.js'


const app = express()
const PORT = 3002

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB()

app.use('/', urlExpanderRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});