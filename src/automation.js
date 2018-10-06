const moment = require('moment');
const SunCalc = require('suncalc');
const db = require('./db');
const hambisync = require('./hambisync');
const hue = require('./hue');
const logger = require('./logger');
const status = require('./status');

function processWebhook(payload) {
    logger.info('Webhook notification received');
    if (!isHelloHueActive()) {
        return false;
    }

    db.get('rooms').value().forEach(room => {
        if(!isRoomActive(room)) {
            return false;
        }

        if (!isInRoom(payload, room)) {
            return false;
        }

        if (!isUserAuthorized(payload, room)) {
            return false;
        }

        if (!isItDark(room)) {
            return false
        }

        let event = getEvent(payload.event);

        if (!event) {
            logger.info('%s in not a supported event, aborting webhook processing', payload.event);
            return false;
        } 

        let action = room[event];

        return triggerActions(event, action, room);
    });
}

function triggerActions(event, action, room) {
    logger.info('Triggering %s actions in room %s for %s event', action, room['name'], event);
    triggerLights(action, room);
    triggerHambisync(event, room);
}

async function triggerLights(action, room) {
    try {
        let roomLights = room['lights'];
        let roomGroups = room['groups'];
        let lightAttribute = {};

        switch (action) {
            case "turn_on":
                lightAttribute = {
                    on: true,
                    brightness: 254
                }
                break;
            case "turn_off":
                lightAttribute = {
                    on: false
                }
                break;
            case "dim":
                lightAttribute = {
                    on: true,
                    brightness: room['dim_brightness']
                }
                break;
            default:
                return false;
        }

        roomLights.forEach(lightId => {
            hue.client.lights.getById(lightId)
                .then(light => {

                    light.on = lightAttribute.on;

                    if (lightAttribute.brightness) {
                        light.brightness = lightAttribute.brightness;
                    }

                    return hue.client.lights.save(light);
                })
                .catch(error => {
                    logger.error('Something went wrong updating lights: %j', error.stack);
                });
        });

        roomGroups.forEach(groupId => {
            hue.client.groups.getById(groupId)
                .then(group => {

                    group.on = lightAttribute.on;

                    if (lightAttribute.brightness) {
                        group.brightness = lightAttribute.brightness;
                    }

                    return hue.client.groups.save(group);
                })
                .catch(error => {
                    logger.error('Something went wrong updating groups: %j', error.stack);
                });
        });

    } catch (error) {
        logger.error(error);
        return false;
    }
};

function triggerHambisync(event, room) {

    if (!room['hambisync']) {
        logger.info('Ambisync in disabled in room %s', room['name']);
        return false;
    }

    logger.info('Ambisync in enabled in room %s', room['name']);

    switch (event) {
        case 'play':
            hambisync.start();
            break;
        case 'stop':
            hambisync.stop();
            break;
    
        default:
            return false;
    }
    
    return true;
}

function isHelloHueActive() {

    let active = status.getStatus();

    if (!active) {
        logger.info('HelloHue is inactive, abording webhook processing');
        return false;
    }

    logger.info('HelloHue is active, continuing webhook processing');
    return true;
};

function isRoomActive(room) {
    if (room['active']) {
        logger.info('Room %s is active, continuing webhook processing', room['name']);
        return true;
    }

    logger.info('Room %s is inactive, aborting webhook processing', room['name']);
    return false;
}

function isInRoom(payload, room) {
    if (room.player === payload.Player.title) {
        logger.info('Player %s is in room %s, continuing webhook processing', room.player, room.name);
        return true;
    }

    logger.info('Player %s is not in room %s, aborting webhook processing', room.player, room.name);
    return false;
};

function isUserAuthorized(payload, room) {
    if (room.users.length === 0) {
        logger.info('Room %s is authorizing any user, continuing webhook processing', room['name']);
        return true;
    }
    
    if (!room.users.includes(payload.Account.title)) {
        logger.info('User %s is not in room %s, aborting webhook processing', payload.Account.title, room['name'])
        return false;
    }

    logger.info('User %s is in room %s, continuing webhook processing', payload.Account.title, room['name']);
    return true;
}

function isItDark(room) {
    if (!room["night_mode"]) {
        logger.info('Night mode is disabled in room %s, continuing webhook processing', room['name']);
        return true;
    }

    const location = db.get('location').value();

    if (!location.latitude || !location.longitude) {
        logger.info('Night mode is not configured in room %s, continuing webhook processing', room['name']);
        return true;
    }

    const now = moment();
    const times = SunCalc.getTimes(now,  location.latitude,  location.longitude);
    if (now > times.sunrise && now < times.sunset) {
        logger.info('Sun is shining in room %s (now: %s, sunrise: %s, sunset: %s), aborting webhook processing', room['name'], now, times.sunrise, times.sunset);
        return false;
    }

    logger.info('Night is dark and full of terror in room %s (now: %s, sunrise: %s, sunset: %s), continuing webhook processing', room['name'], now, times.sunrise, times.sunset);
    return true;
};

function getEvent(plexEvent) {

    let event = null;

    switch (plexEvent) {
        case 'media.play':
            event = 'play';
            break;
        case 'media.pause':
            event = 'pause';
            break;
        case 'media.resume':
            event = 'resume';
            break;
        case 'media.stop':
            event = 'stop';
            break;
        default:
            event = null;
            break;
    }
    return event;
}

module.exports = processWebhook;