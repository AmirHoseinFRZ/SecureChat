const express = require('express');
const router = express.Router();
const { Role, roleCreateValidate, roleUpdateValidate } = require('../../models/role');
const {Permission} = require("../../models/permission");

router.get('/', async (req, res) => {
    res.send(await Role.findAll());
});

router.post('/create', async (req, res) => { // needs middleware to do this
    const {error} = roleCreateValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let role = await Role.findOne({
        where: { name: req.body.name}
    });
    if (role) return res.status(400).send("Role already exists.");

    role = await Role.create({name: req.body.name});

    for(const id of req.body.addPermissionIds) {
        const permission = await Permission.findByPk(id);
        await role.addPermission(permission);
    }

    res.send(role);
});

router.put('/:id', async (req, res) => {
    const {error} = roleUpdateValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let role = await Role.findByPk(req.params.id)
    if (!role) return res.status(400).send("Role doesn't exist.");

    if(req.body.name) role.name = req.body.name;

    if(req.body.addPermissionIds)
        for(const id of req.body.addPermissionIds) {
            const permission = await Permission.findByPk(id);
            await role.addPermission(permission);
        }

    if(req.body.removePermissionIds)
        for(const id of req.body.removePermissionIds) {
            const permission = await Permission.findByPk(id);
            await role.removePermission(permission);
        }

    await role.save();
    res.send(role);
});

router.delete('/:id', async (req, res) => {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(400).send("Role doesn't exist.");

    await role.destroy();

    res.send('deleted successfully.')
});

module.exports = router;