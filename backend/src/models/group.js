const {sequelize} = require("../../config/db");
const {DataTypes} = require("sequelize");
const {User} = require('./user');
const Joi = require("joi");

const Group = sequelize.define('Group', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {tableName: 'groups'});

User.belongsToMany(Group, { through: 'userGroups', foreignKey: 'userId' });
Group.belongsToMany(User, { through: 'userGroups', foreignKey: 'groupId' });

function GroupCreateValidate(group) {
    const schema = Joi.object({
        name: Joi.string().required()
    });
    return schema.validate(group);
}

function GroupUpdateValidate(group) {
    const schema = Joi.object({
        name: Joi.string(),
        addUserIds: Joi.array().items(Joi.number().integer()),
        removeUserIds: Joi.array().items(Joi.number().integer())
    });
    return schema.validate(group);
}

module.exports = {Group, GroupCreateValidate, GroupUpdateValidate};
