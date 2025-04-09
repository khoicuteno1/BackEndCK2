'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      // Liên kết với Department
      Course.belongsTo(models.Department, { 
        foreignKey: 'departmentId',
        onDelete: 'CASCADE', // Xóa khoa sẽ xóa hết khóa học liên quan
      });

      // Liên kết với Enrollment (nếu có)
      Course.hasMany(models.Enrollment, { 
        foreignKey: 'courseId',
      });
    }
  }

  Course.init({
    courseName: DataTypes.STRING,
    credits: DataTypes.INTEGER,
    semester: DataTypes.STRING,
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Departments',
        key: 'id',
      },
    }
  }, {
    sequelize,
    modelName: 'Course',
  });

  return Course;
};
