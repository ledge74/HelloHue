const router = require('express').Router();
const status = require('../src/status');

router.get('/start', function(req, res) {
    status.start();

    return res.redirect('/');
});

router.get('/stop', function(req, res) {
    status.stop();

    return res.redirect('/');
});

module.exports = router;