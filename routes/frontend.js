const router = require('express').Router();
const hue = require('../src/hue');
const plex = require('../src/plex');
const db = require('../src/db');
const logger = require('../src/logger');
const status = require('../src/status');

router.get('/', function (req, res) {
    let lights = [];
    let groups = [];
    hue.client.lights.getAll()
        .then(bridgeLights => {
            lights = bridgeLights.map(light => {
                return {
                    id: light.id,
                    name: light.name
                }
            });
            return hue.client.groups.getAll();
        })
        .then(bridgeGroups => {
            groups = bridgeGroups.map(group => {
                return {
                    id: group.id,
                    name: group.name
                }
            });
        })
        .catch(error => {
            logger.error(error);
        })
        .then(() => {
            res.render('index', {
                config: {
                    rooms: db.get('rooms').value(),
                    hue: db.get('hue').value(),
                    location: db.get('location').value(),
                    plex: db.get('plex').value(),
                    hambisync: db.get('hambisync').value()
                },
                auth: {
                    hue: hue.authentication,
                    plex: plex.authentication
                },
                hellohue: {
                    status: status.getStatus()
                },
                lights,
                groups
            });
        })
});

module.exports = router;