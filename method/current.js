const axios = require('axios');
module.exports = (args) => {
    return new Promise(async (resolve, reject) => {
        if (!args.SID) {
            return reject({
                message: `Missing SID`
            })
        }
        const result = await axios.get(`https://www.ele.me/restapi/eus/v1/current_user`, {
            headers: {
                'Cookie': `SID=${args.SID}`
            }
        }).catch(err => {
            reject({
                message: err.response.data
            })
        })
        if (result.data === 0) {
            return reject({
                message: `Unauthorized SID`
            })
        }
        resolve(result.data)
    })
}