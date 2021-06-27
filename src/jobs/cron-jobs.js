'use strict'

const cron = require('cron');
const walmartService = require('../service/walmartService');

let walmartTaskRunning = false;

const configureWalmartJob = function () {

    const walmartJob = cron.job('*/10 * * * *', async function () {
        console.info('Walmart cron job started');

        if (walmartTaskRunning) {
            console.log('Walmart job will not run as it is still running');
            return;
        }

        walmartTaskRunning = true;

        await walmartService.tryCoupons()
            .then(response => {
                console.info('Walmart cron job completed')
                walmartTaskRunning = false;
            })
            .catch(error => {
                console.error(error)
                walmartTaskRunning = false;
            });
    });

    walmartJob.start();
}

const init = function () {
    configureWalmartJob();
}

exports.init = init