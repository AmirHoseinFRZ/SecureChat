
const crypto = require('crypto');
const bcrypt = require("bcrypt");

module.exports = {
    up: async (queryInterface, Sequelize) => {
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
        console.log(privateKey)
        const password = await bcrypt.hash("P@ssw0rd$123!", await bcrypt.genSalt(10))
        console.log(password)
        const userId = await queryInterface.bulkInsert('users', [
            {
              firstName: 'amir',
              lastName: 'firoozi',
              phoneNumber: '09398615101',
              email: 'amiiirfrz@gmail.com',
              password: password,
              publicKey: publicKey,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          ], { returning: true });
        const roleId = await queryInterface.bulkInsert('roles', [
            {
                name: 'super admin',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
          ], { returning: true });
        const permissionId = await queryInterface.bulkInsert('permissions', [
          {
              name: 'ایجاد همه',
              code: 'ALL_CREATE',
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              name: 'مشاهده همه',
              code: 'ALL_READ',
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              name: 'ویرایش همه',
              code: 'ALL_UPDATE',
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              name: 'حذف همه',
              code: 'ALL_DELETE',
              createdAt: new Date(),
              updatedAt: new Date(),
          }
        ]);

        await queryInterface.bulkInsert('rolePermissions', [
            {
                roleId: roleId,
                permissionId: permissionId,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                roleId: roleId,
                permissionId: permissionId + 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                roleId: roleId,
                permissionId: permissionId + 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                roleId: roleId,
                permissionId: permissionId + 3,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);

        await queryInterface.bulkInsert('userRoles', [
            {
                roleId: roleId,
                userId: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {},
};