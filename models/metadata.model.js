const sequelize = require('sequelize');
const db = require('../database/database');

const metaData = db.define('metadata', /*Schema*/{
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    filename: {
        type: sequelize.STRING
    },
    title: {
        type: sequelize.STRING
    },
    artist: {
        type: sequelize.STRING
    },
    album: {
        type: sequelize.STRING
    },
    year: {
        type: sequelize.STRING
    },
    genre: {
        type: sequelize.STRING
    },
    pictureformat: {
        type: sequelize.STRING
    },
    picturedata: {
        type: sequelize.STRING
    }
});

db.sync();


// metaData.destroy({
//     where: {},
//     truncate: true,
//     cascade: false,
//     restartIdentity: true
// })

module.exports = metaData;