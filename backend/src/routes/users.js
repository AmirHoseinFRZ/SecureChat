const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const router = express.Router();
const {User, userSignUpValidate, userSignInValidate} = require("../models/user");
const {Op} = require("sequelize");
const auth = require("../middleware/auth");

router.post("/sign-up", async (req, res) => {
    const {error} = userSignUpValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({
        where: {
            [Op.or]: [
                {email: req.body.email},
                {phoneNumber: req.body.phoneNumber},
            ],
        },
    });

    if (user) return res.status(400).send("User already registered.");

    user = await User.build(
        _.pick(req.body, [
            "firstName",
            "lastName",
            "email",
            "phoneNumber",
            "password",
        ])
    );

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });
    user.publicKey = publicKey;
    user.privateKey = privateKey;
    console.log(privateKey);
    console.log(publicKey);


    await user.save();

    res.send(_.pick(user, ["id", "firstName", "lastName", "email", "phoneNumber", "publicKey", "privateKey"]));
});

router.post("/sign-in", async (req, res) => {
    const {error} = userSignInValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({
        where: {
            [Op.or]: [
                {email: req.body.username},
                {phoneNumber: req.body.username},
            ],
        },
    });

    if (!user) return res.status(400).send("Invalid email or password.");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid email or password.");

    user.generateAuthToken(req, res);

    res.send(_.pick(user, ["id", "firstName", "lastName", "email", "phoneNumber"]));
});

router.get('/sign-out', auth, (req, res) => {
    res.cookie(
        'x-auth-token',
        {},
        { maxAge: -1 }
    );
    res.sendStatus(200);
});

router.get('/current-user', auth, (req, res) => {
    res.send(req.user);
});

module.exports = router;
