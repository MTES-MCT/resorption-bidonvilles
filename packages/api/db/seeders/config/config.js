const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    backUrl: process.env.RB_API_BACK_URL,
};
