const request = require('request');
const db = require('./db');
const logger = require('./logger');

function start() {
    let url = getBaseUrl() + '/start';
    request(url, function (error, response, body) {
        if (error) {
            logger.warn('hambisync error: %j', error);
            return false;
        }
        return true;
    });
}

function stop() {
    let url = getBaseUrl() + '/stop';
    request(url, function (error, response, body) {
        if (error) {
            logger.warn('hambisync error: %j', error);
            return false;
        }
        return true;
    });
}

function getBaseUrl() {
    let host = db.get('hambisync').value().host;
    let port = db.get('hambisync').value().port;

    let url = `http://${host}:${port}`;
    return url;
}

module.exports = {
    start,
    stop
}