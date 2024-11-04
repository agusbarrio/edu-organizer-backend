const authServices = require("../services/auth")

const authMiddlewares = {
    userAccess: (permissions) => {
        return async (req, res, next) => {
            try {
                const token = req.headers['user-authorization']
                // sacar bearer
                const tokenWithoutBearer = token ? token.split(' ')[1] : null
                const userContext = await authServices.validUserAccess({ token: tokenWithoutBearer, permissions })
                req.user = userContext.user
                req.userToken = tokenWithoutBearer
                next()
            } catch (error) {
                next(error)
            }
        }
    },
    courseAccess: async (req, res, next) => {
        try {
            const token = req.headers['course-authorization']
            const tokenWithoutBearer = token ? token.split(' ')[1] : null
            const courseContext = await authServices.validCourseAccess({ token: tokenWithoutBearer })
            req.course = courseContext.course
            req.courseToken = tokenWithoutBearer
            next()
        } catch (error) {
            next(error)
        }
    },
    //Se necesita solo uno de ambos accesos
    courseOrUserAccess: (userPermissions) => {
        return async (req, res, next) => {
            try {
                const token = req.headers['user-authorization']
                const tokenWithoutBearer = token ? token.split(' ')[1] : null
                const userContext = await authServices.validUserAccess({ token: tokenWithoutBearer, permissions: userPermissions })
                req.user = userContext.user
                req.userToken = tokenWithoutBearer
                next()
            } catch (error) {
                try {
                    const token = req.headers['course-authorization']
                    const tokenWithoutBearer = token ? token.split(' ')[1] : null
                    const courseContext = await authServices.validCourseAccess({ token: tokenWithoutBearer })
                    req.course = courseContext.course
                    req.courseToken = tokenWithoutBearer
                    next()
                } catch (error2) {
                    next(error2)
                }
            }
        }
    }
}

module.exports = authMiddlewares