const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { Group, GroupCreateValidate, GroupUpdateValidate } = require('../models/group');
const {User, userSignUpValidate, userSignInValidate} = require("../models/user");
const auth = require('../middleware/auth');

router.get('/', auth(), async (req, res) => {
    const sender = await User.findByPk(req.body.senderId);

    const isVerified = crypto.verify(
        "sha256",
        Buffer.from(req.body.encryptedMessage, 'base64'),
        sender.publicKey,
        Buffer.from(req.body.signature, 'base64')
    );
    
    if(isVerified) {
        const decryptedMessage = crypto.privateDecrypt(
            {
                key: req.body.privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            },
            Buffer.from(req.body.encryptedMessage, 'base64')
        ).toString();
    
        res.send(decryptedMessage);
    } else 
        res.send('signature verification failed!');
});

module.exports = router;