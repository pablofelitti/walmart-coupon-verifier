'use strict'

const https = require('https');
const notifier = require('../notifications/notifier');

const findInvalid = function(messageObj) {
    if (messageObj.code === 'couponExpired' || messageObj.code === 'couponNotFound') return messageObj;
}

const tryCoupons = async function() {

    const cartId = process.env.WALMART_CART_ID;
    await tryCoupon('0OFF', 0, cartId);

    for (let i = 100; i <= 5000; i = i + 100) {
        let coupon = i + 'OFF';
        await clearCoupon(cartId);
        await sleep(3000);
        await tryCoupon(coupon, i, cartId);
        await sleep(3000);
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const tryCoupon = function(coupon, couponValue, cartId) {

    console.log('Checking coupon: ' + coupon);

    return new Promise(function(resolve, reject) {
        let couponBodyData = {
            "text": coupon,
            "expectedOrderFormSections": ["items", "totalizers", "clientProfileData", "shippingData", "paymentData", "sellers", "messages", "marketingData", "clientPreferencesData", "storePreferencesData", "giftRegistryData", "ratesAndBenefitsData", "openTextField", "commercialConditionData", "customData"]
        };

        const doOnResponse = function(rawData) {

            try {
                const data = JSON.parse(Buffer.concat(rawData).toString());

                const couponInvalidResult = data.messages.find(findInvalid);

                if (couponInvalidResult != null) {
                    console.log(couponInvalidResult.text);
                } else {

                    const itemWithDiscount = function (messageObj) {

                        return messageObj.priceTags.find(function (messageObj2) {
                            if (Math.abs(messageObj2.rawValue) === couponValue) return messageObj2;
                        });
                    }

                    if (data.items.find(itemWithDiscount)) {
                        let text = 'WALMART: El cupon ' + coupon + ' aplico OK!';
                        notifier.notify(text);
                    } else {
                        console.log('WALMART: El cupon ' + coupon + ' no es valido');
                    }
                }
                resolve();
            } catch (e) {
                reject(e)
            }
        }

        httpPostCall('www.walmart.com.ar', '/api/checkout/pub/orderForm/' + cartId + '/coupons', couponBodyData, doOnResponse);
    });
};

const clearCoupon = function(cartId) {
    return new Promise(function(resolve, reject) {

        let couponBodyData = {
            "expectedOrderFormSections": [
                "items",
                "totalizers",
                "clientProfileData",
                "shippingData",
                "paymentData",
                "sellers",
                "messages",
                "marketingData",
                "clientPreferencesData",
                "storePreferencesData",
                "giftRegistryData",
                "ratesAndBenefitsData",
                "openTextField",
                "commercialConditionData",
                "customData"
            ],
            "noSplitItem": true
        };

        const doOnResponse = function() {
            console.log('cleared cart messages');
            resolve();
        }

        httpPostCall('www.walmart.com.ar', '/api/checkout/pub/orderForm/' + cartId + '/messages/clear', couponBodyData, doOnResponse);
    });
};

const httpCall = function(options, bodyData, callback) {

    let req = https.request(options, function (res) {
        let chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            callback(chunks);
        });

        res.on("error", function (error) {
            console.error(error);
        });
    });

    req.write(JSON.stringify(bodyData));

    req.end();
}

const httpPostCall = function(host, path, bodyData, callback) {

    let options = {
        'method': 'POST',
        'hostname': host,
        'path': path,
        'headers': {
            'Content-Type': 'application/json'
        }
    };

    httpCall(options, bodyData, callback);
}

exports.tryCoupons = tryCoupons