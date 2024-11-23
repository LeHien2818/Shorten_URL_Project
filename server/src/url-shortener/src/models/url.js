
// models/url.js
export default (sequelize, DataTypes) => {
    const Url = sequelize.define('Url', {

        urlCode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        longUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        shortUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        clicks: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });


    return Url;
};
