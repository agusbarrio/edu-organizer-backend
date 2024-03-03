const { TOKENS } = require("../constants/auth")
const authServices = require("../services/auth")

const authMiddlewares = {
    userAccess: (permissions) => {
        return async (req, res, next) => {
            try {
                const token = req.cookies[TOKENS.SESSION]
                const userContext = await authServices.validUserAccess({ token, permissions })
                req.user = userContext.user
                next()
            } catch (error) {
                res.clearCookie(TOKENS.SESSION)
                next(error)
            }
        }
    },
    courseAccess: async (req, res, next) => {
        try {
            const token = req.cookies[TOKENS.COURSE]
            const courseContext = await authServices.validCourseAccess({ token })
            req.course = courseContext.course
            next()
        } catch (error) {
            res.clearCookie(TOKENS.COURSE)
            next(error)
        }
    },
    //Se necesita solo uno de ambos accesos
    courseOrUserAccess: (userPermissions) => {
        return async (req, res, next) => {
            try {
                const token = req.cookies[TOKENS.SESSION]
                const userContext = await authServices.validUserAccess({ token, permissions: userPermissions })
                req.user = userContext.user
                next()
            } catch (error) {
                try {
                    const token = req.cookies[TOKENS.COURSE]
                    const courseContext = await authServices.validCourseAccess({ token })
                    req.course = courseContext.course
                    next()
                } catch (error2) {
                    res.clearCookie(TOKENS.SESSION)
                    res.clearCookie(TOKENS.COURSE)
                    next(error2)
                }
            }
        }
    }
}

module.exports = authMiddlewares