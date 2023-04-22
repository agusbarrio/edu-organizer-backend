const { TOKENS } = require("../constants/auth")
const authServices = require("../services/auth")

const authMiddlewares = {
    canAccess: (permissions) => {
        return async (req, res, next) => {
            try {
                const token = req.cookies[TOKENS.SESSION.name]
                const userContext = await authServices.validUserAccess({ token, permissions })
                req.user = userContext
                next()
            } catch (error) {
                next(error)
            }

        }
    }
}

module.exports = authMiddlewares