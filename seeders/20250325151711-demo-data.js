'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm trường semester vào bảng Enrollments nếu chưa có
    await queryInterface.addColumn('Enrollments', 'semester', {
      type: Sequelize.STRING,
      allowNull: true  // Có thể null khi chưa có
    });

    // Thêm dữ liệu vào bảng Departments trước tiên
    await queryInterface.bulkInsert('Departments', [
      { 
        id: 1, 
        departmentName: 'Khoa Toán', 
        description: 'Chuyên ngành Toán học', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        id: 2, 
        departmentName: 'Khoa CNTT', 
        description: 'Công nghệ Thông tin', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      }
    ], {});

    // Thêm dữ liệu vào bảng Courses (sau khi Departments đã tồn tại)
    await queryInterface.bulkInsert('Courses', [
      { 
        id: 101, 
        courseName: 'Toán Cao Cấp', 
        departmentId: 1, 
        semester: '1', 
        credits: 4, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        id: 102, 
        courseName: 'Lập Trình C', 
        departmentId: 2, 
        semester: '2', 
        credits: 3, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      }
    ], {});

    // Thêm dữ liệu vào bảng Students
    await queryInterface.bulkInsert('Students', [
      {
        id: 1,
        firstName: 'Nguyễn',
        lastName: 'Văn An',
        dateOfBirth: '2002-04-15',
        gender: 'Nam',
        address: '123 Đường ABC, TP.HCM',
        phoneNumber: '0123456789',
        email: 'an.nguyen@example.com',
        enrollmentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        firstName: 'Trần',
        lastName: 'Thị Bình',
        dateOfBirth: '2001-07-20',
        gender: 'Nữ',
        address: '456 Đường XYZ, Hà Nội',
        phoneNumber: '0987654321',
        email: 'binh.tran@example.com',
        enrollmentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Thêm dữ liệu vào bảng Enrollments (sau khi Courses & Students đã tồn tại)
    await queryInterface.bulkInsert('Enrollments', [
      { 
        id: 1, 
        studentId: 1, 
        courseId: 101, 
        enrollDate: '2024-01-10', 
        semester: '1',  // Thêm semester
        grade: 9,  // Thêm điểm
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        id: 2, 
        studentId: 2, 
        courseId: 102, 
        enrollDate: '2024-02-15', 
        semester: '2',  // Thêm semester
        grade: 7,  // Thêm điểm
        createdAt: new Date(), 
        updatedAt: new Date() 
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Xóa trường semester nếu cần
    await queryInterface.removeColumn('Enrollments', 'semester');
    
    // Xóa dữ liệu theo thứ tự ngược lại (để tránh lỗi ràng buộc khóa ngoại)
    await queryInterface.bulkDelete('Enrollments', null, {});
    await queryInterface.bulkDelete('Students', null, {});
    await queryInterface.bulkDelete('Courses', null, {});
    await queryInterface.bulkDelete('Departments', null, {});
  }
};
