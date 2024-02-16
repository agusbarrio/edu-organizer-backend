'use strict';
const db = require('../models');
const ABMRepository = require('./ABMRepository');
class FilesRepository extends ABMRepository {
    constructor() {
        super(db.File);
    }
}

const filesRepositories = new FilesRepository();
module.exports = filesRepositories;