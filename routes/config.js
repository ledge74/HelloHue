const router = require('express').Router();
const huejay = require('huejay');
const hue = require('../src/hue');
const plex = require('../src/plex');
const db = require('../src/db');
const logger = require('../src/logger');


router.post('/room/:id', function (req, res) {
    const id = parseInt(req.params.id);

    let hambisync = false;
    let night_mode = false;
    let active = false;
    let dim_brightness = 0;
    let users = [];
    let lights = [];
    let groups = [];
    let min_duration = 0;

    if (req.body.hambisync) {
        hambisync = true;
    }

    if (req.body.night_mode) {
        night_mode = true;
    }

    if (req.body.active) {
        active = true;
    }

    if (req.body.users) {
        users = req.body.users.split(",").map(function(user) {
            return user.trim();
        });
    }

    if (req.body.lights) {
        typeof req.body.lights === "string" ? req.body.lights = [req.body.lights] : req.body.lights = req.body.lights;
        lights = req.body.lights.map(function(light) {
            return parseInt(light);
        });
    }
    
    if (req.body.groups) {
        typeof req.body.groups === "string" ? req.body.groups = [req.body.groups] : req.body.groups = req.body.groups;
        groups = req.body.groups.map(function(group) {
            return parseInt(group);
        });
    }

    if (req.body.dim_brightness) {
        dim_brightness = parseInt(req.body.dim_brightness);
    }

    if (req.body.min_duration) {
        min_duration = parseInt(req.body.min_duration);
    }

    const room = {
        name: req.body.name.trim(),
        player: req.body.player.trim(),
        play: req.body.play,
        pause: req.body.pause,
        resume: req.body.resume,
        stop: req.body.stop,
        hambisync,
        night_mode,
        active,
        groups,
        lights,
        users,
        dim_brightness,
        min_duration
    };

    db.get('rooms')
        .find({ id: id })
        .assign(room)
        .write()

    req.flash('success', 'Room saved !');
    res.redirect(`/#form-room${id}`);
});

router.post('/location', function (req, res) {
    let coordinates = {
        latitude: "",
        longitude: ""
    }
    if (req.body.latitude && req.body.longitude) {
        coordinates = {
            latitude: parseFloat(req.body.latitude),
            longitude: parseFloat(req.body.longitude)
        }
    }
    db.set('location', coordinates).write();
    req.flash('success', 'Location saved !');
    res.redirect('/#form-location');
});

router.post('/plex', function (req, res) {
    let plexConfig = {
        host: "",
        token: ""
    }

    if (req.body.host && req.body.token) {
        plexConfig.host = req.body.host;
        plexConfig.token = req.body.token;
    }
    db.set('plex', plexConfig).write();
    plex.authenticate();
    plex.isAuthenticated();
    req.flash('success', 'Plex saved !');
    res.redirect('/#form-plex');
});

router.post('/hambisync', function (req, res) {
    let hambisync = {
        host: "",
        port: ""
    }
    if (req.body.host && req.body.port) {
        hambisync = {
            host: req.body.host,
            port: req.body.port
        }
    }
    db.set('hambisync', hambisync).write();
    req.flash('success', 'HAmbiSync saved !');
    res.redirect('/#form-hambisync');
});

router.post('/connect', function (req, res) {
    hue.createUser(req.body.host)
        .then(user => {
            db.set('hue', {
                username: user.username,
                host: req.body.host
            }).write();
            hue.authenticate();
            return hue.isAuthenticated();
        })
        .then(() => {
            hue.authentication.status = 'success';
            hue.authentication.isAuthenticated = true;
            req.flash('success', 'Hue bridge connected !');
        })
        .catch(error => {
            if (error instanceof huejay.Error && error.type === 101) {
                logger.error(`Link button not pressed. Try again...`);
                req.flash('error', 'Link button not pressed. Try again...');
            } else {
                logger.error(error.stack);
                req.flash('error', 'There was an error connecting to Hue bridge (wrong or unreachable host?)');
            }
            db.set('hue', {
                username: "",
                host: ""
            }).write();
            hue.authentication.status = 'error';
            hue.authentication.isAuthenticated = false;
        })
        .then(() => {
            res.redirect('/#form-hue');
        })
});

module.exports = router;