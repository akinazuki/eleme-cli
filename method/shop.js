const axios = require('axios');
const table = require('table');

module.exports = {
    menu: function () {
        return new Promise((resolve, reject) => {
            axios.get(`https://www.ele.me/restapi/shopping/v2/menu?restaurant_id=${this.shop_id}&terminal=web`, {
                params: {
                    user_id: this.USERID
                },
                headers: {
                    'Cookie': `SID=${this.SID}`
                }
            }).then(res => res.data).then(res => {
                var menus;
                if (!this.menu) {
                    menus = res.map(menu => {
                        return [
                            menu.name,
                            menu.foods.length
                        ]
                    })
                    menus.unshift([
                        'Name', 'This Menu Count'
                    ])
                } else {
                    menus = res.map(menu => {
                        return menu.foods.map(food => {
                            return [
                                food.specfoods.map(spec => {
                                    return [spec.food_id]
                                }).join(" / "),
                                menu.name,
                                food.name,
                                food.description,
                                food.rating,
                                food.specfoods.map(spec => {
                                    return [spec.price]
                                }).join(" / ")
                            ]
                        })
                    }).flat().filter(item => {
                        return item[1] === this.menu
                    })
                    menus.unshift([
                        'ID', 'Menu', 'Name', 'Description', 'Rating', 'Price'
                    ])
                }
                var result = table.table(menus, {
                    border: table.getBorderCharacters('norc')
                })
                console.log(result)
            })
        })
    },
    search: function () {
        return new Promise((resolve, reject) => {
            const params = {
                keyword: this.keyword,
                latitude: this.latitude,
                longitude: this.longitude,
                offset: (this.page == 1) ? 0 : ((this.page - 1) * this.limit),
                limit: this.limit,
            }
            axios.get(`https://h5.ele.me/restapi/shopping/v2/restaurants/search`, {
                params,
                headers: {
                    'Cookie': `SID=${this.SID}`
                }
            }).then(res => res.data).then(res => {
                const restaurants = res.inside[0].restaurant_with_foods;
                const map = restaurants.map(shop => {
                    var shop = shop.restaurant;
                    let flavors = shop.flavors.map(flavor => {
                        return flavor.name
                    }).join(",");
                    return [
                        shop.id,
                        shop.name,
                        flavors,
                        (shop.delivery_mode == undefined) ? '商家配送' : shop.delivery_mode.text,
                        shop.float_minimum_order_amount,
                        shop.float_delivery_fee
                    ]
                })
                map.unshift([
                    'ID', 'Name', 'Flavors', 'Delivery Mode', 'Minium Order Amount', 'Delivery Fee'
                ])
                const result = table.table(map, {
                    border: table.getBorderCharacters('norc')
                })
                console.log(result)
            })
        })
    },
    list: function () {
        return new Promise(async (resolve, reject) => {
            const params = {
                latitude: this.latitude,
                longitude: this.longitude,
                offset: (this.page == 1) ? 0 : ((this.page - 1) * this.limit),
                limit: this.limit,
            };
            axios.get(`https://h5.ele.me/restapi/shopping/v3/restaurants`, {
                params,
                headers: {
                    'Cookie': `SID=${this.SID}`
                }
            }).then(res => res.data).then(res => {
                const map = res.items.map(shop => {
                    var shop = shop.restaurant;
                    let flavors = shop.flavors.map(flavor => {
                        return flavor.name
                    }).join(",");
                    return [
                        shop.id,
                        shop.name,
                        flavors,
                        (shop.delivery_mode === undefined) ? '商家配送' : shop.delivery_mode.text,
                        shop.float_minimum_order_amount,
                        shop.float_delivery_fee
                    ]
                })
                map.unshift([
                    'ID', 'Name', 'Flavors', 'Delivery Mode', 'Minium Order Amount', 'Delivery Fee'
                ])
                const result = table.table(map, {
                    border: table.getBorderCharacters('norc')
                })
                console.log(result)
            })

        })
    }
}