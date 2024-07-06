module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('rolePermissions', {
          roleId: {
              type: Sequelize.DataTypes.INTEGER,
              references: {
                  model: 'roles',
                  key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
          },
          permissionId: {
              type: Sequelize.DataTypes.INTEGER,
              references: {
                  model: 'permissions',
                  key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
          },
          createdAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: false,
              defaultValue: Sequelize.DataTypes.NOW,
          },
          updatedAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: false,
              defaultValue: Sequelize.DataTypes.NOW,
          }
      });
  },
  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('rolePermissions');
  }
}
