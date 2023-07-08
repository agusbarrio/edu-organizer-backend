const usersServices = require("../services/users");

const usersControllers = {
    getAll: async (req, res, next) => {
        try {
            const users = await usersServices.getAll()
            res.json(users)
        } catch (error) {
            next(error)
        }
    },
}

module.exports = usersControllers;
