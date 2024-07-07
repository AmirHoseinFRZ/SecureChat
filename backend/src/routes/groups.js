const express = require('express');
const router = express.Router();
const { Group, GroupCreateValidate, GroupUpdateValidate } = require('../models/group');
const {User, userSignUpValidate, userSignInValidate} = require("../models/user");
const auth = require('../middleware/auth');

router.get('/', auth("GROUP_READ"), async (req, res) => {
    res.send(await Group.findAll());
});

router.post('/create', auth("GROUP_CREATE"), async (req, res) => { // needs middleware to do this
    const {error} = GroupCreateValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let group = await Group.findOne({
        where: { name: req.body.name}
    });
    if (group) return res.status(400).send("Group already exists.");

    group = await Group.create({name: req.body.name});
    user = await User.findByPk(req.user.id)
    await group.addUser(user);
    res.send(group);
});

router.put('/:id', auth("GROUP_UPDATE"), async (req, res) => {
    const {error} = GroupUpdateValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let group = await Group.findByPk(req.params.id)
    if (!group) return res.status(400).send("Group doesn't exist.");

    if(req.body.name) group.name = req.body.name;

    if(req.body.addUserIds)
        for(const id of req.body.addUserIds) {
            const user = await User.findByPk(id);
            await group.addUser(user);
        }

    if(req.body.removeUserIds)
        for(const id of req.body.removeUserIds) {
            const user = await User.findByPk(id);
            await group.removeUser(user);
        }

    await group.save();
    res.send(group);
});

router.delete('/:id', auth("GROUP_DELETE"), async (req, res) => {
    const group = await Group.findByPk(req.params.id);
    if (!group) return res.status(400).send("Group doesn't exist.");

    await group.destroy();

    res.send('deleted successfully.')
});

module.exports = router;