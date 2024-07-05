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

User.belongsToMany(Permission, { through: 'UserGroups', foreignKey: 'userId' });
Group.belongsToMany(Role, { through: 'UserGroups', foreignKey: 'groupId' });

function GroupCreateValidate(group) {
    const schema = Joi.object({
        name: Joi.string().required()
    });
    return schema.validate(group);
}

function GroupUpdateValidate(group) {
    const schema = Joi.object({
        name: Joi.string(),
        addGroupIds: Joi.array().items(Joi.number().integer()),
        removeGroupIds: Joi.array().items(Joi.number().integer())
    });
    return schema.validate(group);
}

module.exports = {Group, GroupCreateValidate, GroupUpdateValidate};
