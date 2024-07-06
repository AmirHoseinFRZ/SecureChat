module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('userGroups', {
          userId: {
              type: Sequelize.DataTypes.INTEGER,
              references: {
                  model: 'users',
                  key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
          },
          groupId: {
              type: Sequelize.DataTypes.INTEGER,
              references: {
                  model: 'groups',
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
      await queryInterface.dropTable('userGroups');
  }
}
