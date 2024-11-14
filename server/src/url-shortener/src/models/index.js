import { Sequelize, DataTypes } from 'sequelize';
import config from '../config/config.json' assert { type: 'json' };
import urlModel from './url.js';

const sequelize = new Sequelize(config.development);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Url = urlModel(sequelize, DataTypes);

// sequelize.sync({ force: false, alter: true }).then(() => {
//     console.log('Database synchronized');
// }).catch((error) => {
//     console.error('Error syncing database:', error);
// });

export default db;


export { sequelize };
