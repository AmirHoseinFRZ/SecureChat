module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('permissions', {
          id: {
              type: Sequelize.DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
          },
          name: {
              type: Sequelize.DataTypes.STRING,
              allowNull: false,
          },
          code: {
              type: Sequelize.DataTypes.STRING,
              allowNull: false,
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
      await queryInterface.dropTable('permissions');
  }
}
