const express = require('express');
const router = express.Router();
const { Permission, permissionCreateValidate } = require('../models/permission');
const auth = require('../middleware/auth');


router.get('/', auth("PERMISSION_READ"), async (req, res) => {
    res.send(await Permission.findAll());
});

router.post('/create', auth("PERMISSION_CREATE"), async (req, res) => { // needs middleware to do this
    const {error} = permissionCreateValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let permission = await Permission.findOne({
        where: { name: req.body.name}
    });
    if (permission) return res.status(400).send("Permission already exists.");

    permission = await Permission.create({name: req.body.name});
    res.send(permission);
});

module.exports = router;