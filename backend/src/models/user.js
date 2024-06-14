const {sequelize} = require("../../config/db.js");

const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
const crypto = require('crypto');

const User = sequelize.define('User', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                min: 2,
                max: 50,
            },
        },
        lastName: {
            type: DataTypes.STRING,
            validate: {
                min: 2,
                max: 50,
            },
        },
        phoneNumber: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        publicKey: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        tableName: "users",
    }
);

User.prototype.generateAuthToken = function (req, res) {
    const token =  jwt.sign(
        {
            id: this.id,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName
        },
        config.get("jwtPrivateKey")
    );

    let maxAge = 24 * 60 * 60 * 1000;
    if(req.body.remember) maxAge = 7 * maxAge;
    res.cookie("x-auth-token", token, {
        maxAge: maxAge,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
    });
};

function userSignUpValidate(user) {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50),
        phoneNumber: Joi.string().pattern(/^\d{11}$/),
        email: Joi.string().email().required(),
        password: Joi.string()
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%^*?&])[A-Za-z\d@$!%^*?&]{8,}$/).required(),
    });
    return schema.validate(user);
}

function userSignInValidate(user) {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        remember: Joi.boolean(),
    });
    return schema.validate(user);
}

User.beforeCreate(async (user) => {
    try {
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
    } catch (error) {
        throw new Error("Error creating public and private key for user!");
    }
});
module.exports = {User, userSignUpValidate, userSignInValidate};