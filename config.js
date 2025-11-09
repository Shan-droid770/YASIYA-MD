const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({
    path: './config.env'
});

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    SESSION_ID: process.env.SESSION_ID || 'YASIYA-MD~NdYTVaSS#B-Q_05RMKXL9WJk1zD7mu9mof5cvAo1Nj3uT31282Kk'
};
