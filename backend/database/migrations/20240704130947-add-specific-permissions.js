module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('permissions', [
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
  }
}
