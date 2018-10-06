const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
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
            "night_mode": false
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
            "night_mode": false
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
            "night_mode": false
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
            "night_mode": false
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
            "night_mode": false
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
    "hambisync": {
        "host": "",
        "port": ""
    }
}).write()

module.exports = db;