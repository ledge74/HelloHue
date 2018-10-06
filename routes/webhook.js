const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: '/tmp/' });
const processWebhook = require('../src/automation');


router.post('/', upload.single('thumb'), function (req, res) {
    res.sendStatus(200);
    const payload = JSON.parse(req.body.payload);
    processWebhook(payload);
});

module.exports = router;