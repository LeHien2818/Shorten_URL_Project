import express from 'express'
import bodyParser from 'body-parser'
import shortenerRoutes from './routes/url-shortener-route.js'
import cors from 'cors'
import { sequelize } from './models/index.js';


const app = express();
const PORT = 3001;
app.use(cors({ origin: 'http://localhost:3000' }))
//config bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect DB
sequelize.sync({ force: false, alter: true }).then(() => {
    console.log("Database synchronized");
}).catch(err => {
    console.error("Error syncing database:", err);
});


app.use('/shorten', shortenerRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

});