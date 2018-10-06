const router = require('express').Router();
const status = require('../src/status');

function isActive(status) {
    return status ? '1' : '0';
}

router.get('/status', function(req, res) {
    return res.type('text/plain').send(isActive(status.getStatus()));
});

router.get('/start', function(req, res) {
    return res.type('text/plain').send(isActive(status.start()));
});

router.get('/stop', function(req, res) {
    return res.type('text/plain').send(isActive(status.stop()));
});

module.exports = router;