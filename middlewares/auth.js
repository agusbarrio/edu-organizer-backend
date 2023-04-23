const { TOKENS } = require("../constants/auth")
const authServices = require("../services/auth")

const authMiddlewares = {
    userAccess: (permissions) => {
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
    },
    courseAccess: async (req, res, next) => {
        try {
            const token = req.cookies[TOKENS.COURSE_SESSION.name]
            const courseContext = await authServices.validCourseAccess({ token })
            req.course = courseContext
            next()
        } catch (error) {
            next(error)
        }
    }

}

module.exports = authMiddlewares