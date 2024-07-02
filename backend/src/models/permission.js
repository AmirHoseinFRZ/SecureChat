const {sequelize} = require("../../config/db");
const {DataTypes} = require("sequelize");
const {Role} = require('./role');
const Joi = require("joi");

const Permission = sequelize.define('Permission', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {tableName: 'permissions'});

Role.belongsToMany(Permission, { through: 'rolePermissions', foreignKey: 'roleId' });
Permission.belongsToMany(Role, { through: 'rolePermissions', foreignKey: 'permissionId' });

function permissionCreateValidate(permission) {
    const schema = Joi.object({
        name: Joi.string().required(),
        code: Joi.string().required()
    });
    return schema.validate(permission);
}

module.exports = {Permission, permissionCreateValidate};
