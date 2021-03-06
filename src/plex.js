const db = require('./db');
const PlexAPI = require("plex-api");

let client;
const authentication = {
    status: 'pending',
    isAuthenticated: false
}

function authenticate() {
    client = new PlexAPI({
        hostname: db.get('plex').value().host,
        token: db.get('plex').value().token,
    });
    isAuthenticated();
};

authenticate();

function isAuthenticated() {
    client.query("/").then(function (result) {
        authentication.status = 'success';
        authentication.isAuthenticated = true;
    }, function (err) {
        authentication.status = 'error';
        authentication.isAuthenticated = false;
    });
}

module.exports = {
    client,
    authentication,
    authenticate,
    isAuthenticated
}