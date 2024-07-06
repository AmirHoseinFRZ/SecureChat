module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('userRoles', {
          userId: {
              type: Sequelize.DataTypes.INTEGER,
              references: {
                  model: 'users',
                  key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
          },
          roleId: {
              type: Sequelize.DataTypes.INTEGER,
              references: {
                  model: 'roles',
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
      await queryInterface.dropTable('userRoles');
  }
}
