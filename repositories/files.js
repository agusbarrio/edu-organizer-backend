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
}

const filesRepositories = new FilesRepository();
module.exports = filesRepositories;