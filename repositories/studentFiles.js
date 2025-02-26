'use strict';
const db = require('../models');
const ABMRepository = require('./ABMRepository');
class StudentFilesRepository extends ABMRepository {
    constructor() {
        super(db.StudentFile);
    }
    getAllByStudentId(studentId, transaction) {
        return this.model.findAll({
            where: {
                studentId
            },
            include: [{
                model: db.File,
                as: 'file',
            }],
            transaction
        })
    }

    deleteByStudentId(studentId, transaction) {
        return this.model.destroy({
            where: {
                studentId
            },
            transaction
        })
    }

    getByStudentId(studentId, transaction) {
        return this.model.findAll({
            where: {
                studentId
            },
            transaction
        })
    }
    deleteByStudentIdAndFileId(studentId, fileId, transaction) {
        return this.model.destroy({
            where: {
                studentId,
                fileId
            },
            transaction
        })
    }
}

const studentFilesRepositories = new StudentFilesRepository();
module.exports = studentFilesRepositories;
