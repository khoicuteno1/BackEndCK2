'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Enrollment extends Model {
    static associate(models) {
      // Mối quan hệ với bảng Student
      Enrollment.belongsTo(models.Student, { foreignKey: 'studentId' });

      // Mối quan hệ với bảng Course
      Enrollment.belongsTo(models.Course, { foreignKey: 'courseId' });
    }
  }

  Enrollment.init(
    {
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Students',
          key: 'id'
        }
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Courses',
          key: 'id'
        }
      },
      enrollDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      grade: {
        type: DataTypes.STRING,  // Điểm học viên
        allowNull: true,         // Điểm có thể null nếu chưa có điểm
      },
      semester: {
        type: DataTypes.STRING,  // Học kỳ sẽ lấy từ Course
        allowNull: true  // Có thể null khi chưa có
      }
    },
    {
      sequelize,
      modelName: 'Enrollment'
    }
  );

  // Hook để tự động set giá trị semester từ Course khi tạo Enrollment mới
  Enrollment.beforeCreate(async (enrollment, options) => {
    try {
      const course = await sequelize.models.Course.findByPk(enrollment.courseId);
      if (course) {
        enrollment.semester = course.semester;  // Set semester từ Course
      }
    } catch (error) {
      console.error('Error setting semester in beforeCreate hook:', error);
    }
  });

  // Hook để tự động cập nhật semester nếu courseId thay đổi khi cập nhật Enrollment
  Enrollment.beforeUpdate(async (enrollment, options) => {
    try {
      const course = await sequelize.models.Course.findByPk(enrollment.courseId);
      if (course) {
        enrollment.semester = course.semester;  // Cập nhật semester từ Course khi cập nhật
      }
    } catch (error) {
      console.error('Error setting semester in beforeUpdate hook:', error);
    }
  });

  return Enrollment;
};
