import { Sequelize, DataTypes } from 'sequelize';
import config from '../config/config.json' assert { type: 'json' };
import urlModel from './url.js';

const sequelize = new Sequelize(config.development);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Url = urlModel(sequelize, DataTypes);

export default db;

export { sequelize };
