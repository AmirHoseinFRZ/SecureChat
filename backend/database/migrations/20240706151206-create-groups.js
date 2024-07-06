module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('groups', {
          id: {
              type: Sequelize.DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
          },
          name: {
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

      await queryInterface.bulkInsert('permissions', [
          {
              name: 'ایجاد گروه ها',
              code: 'GROUP_CREATE',
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              name: 'مشاهده گروه ها',
              code: 'GROUP_READ',
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              name: 'ویرایش گروه ها',
              code: 'GROUP_UPDATE',
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              name: 'حذف گروه ها',
              code: 'GROUP_DELETE',
              createdAt: new Date(),
              updatedAt: new Date(),
          }
      ]);
  },
  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('groups');
  }
}
