'use strict';
const db = require('../models');
const ABMRepository = require('./ABMRepository');
class FilesRepository extends ABMRepository {
    constructor() {
        super(db.File);
    }
    getByIdAndOrganizationId({ id, organizationId }, transaction) {
        return this.model.findOne({
            where: {
                id,
                organizationId
            },
            transaction
        })
    }
    getAllByIds(ids, transaction) {
        return this.model.findAll({
            where: {
                id: ids
            },
            transaction
        })
    }
    getUnusedFiles(transaction) {
        return this.model.findAll({
            where: {
                inUse: false
            },
            transaction
        })
    }
}

const filesRepositories = new FilesRepository();
module.exports = filesRepositories;