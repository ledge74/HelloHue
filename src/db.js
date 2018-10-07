const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const fs = require('fs');
const dir = './db';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const adapter = new FileSync('./db/db.json')
const db = low(adapter)

db.defaults({
    "rooms": [
        {
            "id": 1,
            "active": false,
            "name": "Room 1",
            "player": "",
            "users": [],
            "play": "nothing",
            "pause": "nothing",
            "resume": "nothing",
            "stop": "nothing",
            "lights": [],
            "groups": [],
            "dim_brightness": 127,
            "hambisync": false,
            "night_mode": false,
            "min_duration": 0
        },
        {
            "id": 2,
            "active": false,
            "name": "Room 2",
            "player": "",
            "users": [],
            "play": "nothing",
            "pause": "nothing",
            "resume": "nothing",
            "stop": "nothing",
            "lights": [],
            "groups": [],
            "dim_brightness": 127,
            "hambisync": false,
            "night_mode": false,
            "min_duration": 0
        },
        {
            "id": 3,
            "active": false,
            "name": "Room 3",
            "player": "",
            "users": [],
            "play": "nothing",
            "pause": "nothing",
            "resume": "nothing",
            "stop": "nothing",
            "lights": [],
            "groups": [],
            "dim_brightness": 127,
            "hambisync": false,
            "night_mode": false,
            "min_duration": 0
        },
        {
            "id": 4,
            "active": false,
            "name": "Room 4",
            "player": "",
            "users": [],
            "play": "nothing",
            "pause": "nothing",
            "resume": "nothing",
            "stop": "nothing",
            "lights": [],
            "groups": [],
            "dim_brightness": 127,
            "hambisync": false,
            "night_mode": false,
            "min_duration": 0
        },
        {
            "id": 5,
            "active": false,
            "name": "Room 5",
            "player": "",
            "users": [],
            "play": "nothing",
            "pause": "nothing",
            "resume": "nothing",
            "stop": "nothing",
            "lights": [],
            "groups": [],
            "dim_brightness": 127,
            "hambisync": false,
            "night_mode": false,
            "min_duration": 0
        }
    ],
    "hue": {
        "username": "",
        "host": ""
    },
    "location": {
        "latitude": "",
        "longitude": ""
    },
    "plex": {
        "host": "",
        "token": ""
    },
    "hambisync": {
        "host": "",
        "port": ""
    }
}).write()

module.exports = db;