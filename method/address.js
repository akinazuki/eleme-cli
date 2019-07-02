const axios = require('axios');
const table = require('table');

module.exports = {
    list: function () {
        return new Promise((resolve, reject) => {
            axios.get(`https://www.ele.me/restapi/member/v1/users/${this.USERID}/addresses`, {
                headers: {
                    'Cookie': `SID=${this.SID}`
                }
            }).then(res => res.data).then(res => {
                const map = res.map(addr => {
                    return [
                        addr.id,
                        (addr.tag === null ? '未知' : addr.tag),
                        addr.address,
                        addr.address_detail,
                        `${addr.name}`,
                        addr.phone
                    ]
                })
                map.unshift([
                    'ID', 'Tag', 'Address', 'Detail', 'Name', 'Phone'
                ])
                const result = table.table(map, {
                    border: table.getBorderCharacters('norc')
                })
                console.log(result)
            })
        })
    },
    delete: function () {
        return new Promise((resolve, reject) => {
            axios.delete(`https://www.ele.me/restapi/member/v1/users/${this.USERID}/addresses/${this.address_id}`, {
                headers: {
                    'Cookie': `SID=${this.SID}`
                }
            }).then(res => res.data).then(res => {
                if (res == null) {
                    console.log(`Address ID [${this.address_id}] Delete Success`)
                }
            })
        })
    }
}