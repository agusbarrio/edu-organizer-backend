'use strict';
const { Model } = require('sequelize');
const { TABLE_NAME, MODEL_NAME } = require('../constants/studentFiles');
module.exports = (sequelize, DataTypes) => {
    class StudentFile extends Model {
        static associate(models) {
            StudentFile.belongsTo(models.Student, {
                foreignKey: {
                    name: 'studentId',
                    allowNull: false,
                },
                as: 'student',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
            StudentFile.belongsTo(models.File, {
                foreignKey: {
                    name: 'fileId',
                    allowNull: false,
                },
                as: 'file',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
        }
    }
    StudentFile.init(
        {},
        {
            sequelize,
            modelName: MODEL_NAME,
            tableName: TABLE_NAME,
            timestamps: false,
            paranoid: false,
        }
    );
    return StudentFile;
};
