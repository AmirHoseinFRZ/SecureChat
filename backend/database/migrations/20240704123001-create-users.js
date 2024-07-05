module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('users', {
        id: {
          type: Sequelize.DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        firstName: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            validate: {
                min: 2,
                max: 50
            }
        },
        lastName:{
            type: Sequelize.DataTypes.STRING,
            validate: {
                min: 2,
                max: 50
            }
        },
        phoneNumber: {
            type: Sequelize.DataTypes.STRING
        },
        email: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
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
              name: 'ایجاد کاربران',
              code: 'USER_CREATE',
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              name: 'مشاهده کاربران',
              code: 'USER_READ',
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              name: 'ویرایش کاربران',
              code: 'USER_UPDATE',
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              name: 'حذف کاربران',
              code: 'USER_DELETE',
              createdAt: new Date(),
              updatedAt: new Date(),
          }
      ]);
  },
  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('users');
  }
}