const router = require('express').Router();

router.use('/api', require('./api'));
router.use('/config', require('./config'));
router.use('/', require('./status'));
router.use('/', require('./frontend'));
router.use('/', require('./webhook'));

module.exports = router;