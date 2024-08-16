const coursesServices = require("../services/courses");
const validator = require('../services/validator')
const Yup = require('yup')

const coursesControllers = {
    create: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                name: validator.text({ required: { value: true } }),
                accessPin: validator.text({ required: { value: false } }),
                students: validator.array().of(validator.object({ required: { value: false } }, {
                    isNew: validator.boolean({ required: { value: true } }),
                    id: validator.number().when('isNew', {
                        is: false,
                        then: () => validator.id({ required: { value: true } }),
                        otherwise: () => validator.id({ required: { value: false } })
                    }),
                    studentData: Yup.object().when('isNew', {
                        is: true,
                        then: () => validator.object({ required: { value: true } },
                            {
                                firstName: validator.text({ required: { value: true } }),
                                lastName: validator.text({ required: { value: true } }),
                                avatarFileId: validator.id({ required: { value: false } })
                            }),
                        otherwise: () => validator.object({ required: { value: false } })
                    })
                })),
                studentAttendanceFormData: validator.formFieldsDataList(),
                studentAdditionalInfoFormData: validator.formFieldsDataList(),
                metadata: validator.anyObject()
            })
            const { name, accessPin, students, studentAttendanceFormData, studentAdditionalInfoFormData, metadata } = await validator.validate(schema, req.body)
            await coursesServices.create({ name, accessPin, user: req.user, students, studentAttendanceFormData, studentAdditionalInfoFormData, metadata })
            res.send('Created')
        } catch (error) {
            next(error)
        }
    },
    edit: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                id: validator.id(),
                name: validator.text({ required: { value: true } }),
                accessPin: validator.text({ required: { value: false } }),
                students: validator.array().of(validator.object({ required: { value: false } }, {
                    isNew: validator.boolean({ required: { value: true } }),
                    id: validator.number().when('isNew', {
                        is: false,
                        then: () => validator.id({ required: { value: true } }),
                        otherwise: () => validator.id({ required: { value: false } })
                    }),
                    studentData: Yup.object().when('isNew', {
                        is: true,
                        then: () => validator.object({ required: { value: true } },
                            {
                                firstName: validator.text({ required: { value: true } }),
                                lastName: validator.text({ required: { value: true } }),
                                avatarFileId: validator.id({ required: { value: false } })
                            }),
                        otherwise: () => validator.object({ required: { value: false } })
                    })
                })),
                studentAttendanceFormData: validator.formFieldsDataList(),
                studentAdditionalInfoFormData: validator.formFieldsDataList(),
                metadata: validator.anyObject()
            })
            const { id, name, accessPin, students, studentAttendanceFormData, studentAdditionalInfoFormData, metadata } = await validator.validate(schema, { name: req.body.name, accessPin: req.body.accessPin, id: req.params.id, students: req.body.students, studentAttendanceFormData: req.body.studentAttendanceFormData, studentAdditionalInfoFormData: req.body.studentAdditionalInfoFormData, metadata: req.body.metadata })
            await coursesServices.editOne({ id, name, accessPin, user: req.user, students, studentAttendanceFormData, studentAdditionalInfoFormData, metadata })
            res.send('Edited')
        } catch (error) {
            next(error)
        }
    },
    getAll: async (req, res, next) => {
        try {
            const courses = await coursesServices.getAll({ user: req.user })
            res.json(courses)
        } catch (error) {
            next(error)
        }
    },
    getOne: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                id: validator.id(),
            })
            const { id } = await validator.validate(schema, { id: req.params.id })
            const course = await coursesServices.getOne({ id, organizationId: req.user.organizationId, variant: req.query.variant })
            res.json(course)
        } catch (error) {
            next(error)
        }
    },
    deleteOne: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                id: validator.id(),
            })
            const { id } = await validator.validate(schema, { id: req.params.id })
            await coursesServices.deleteOne({ id, user: req.user })
            res.send('Deleted')
        } catch (error) {
            next(error)
        }
    },
    deleteMultiple: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                ids: validator.ids().min(1),
            })
            const { ids } = await validator.validate(schema, req.body)
            await coursesServices.deleteMultiple({ ids, user: req.user })
            res.send('Deleted')
        } catch (error) {
            next(error)
        }
    },
    editMultiple: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                ids: validator.ids().min(1),
                studentAttendanceFormData: validator.formFieldsDataList()
            })
            const { ids, studentAttendanceFormData } = await validator.validate(schema, req.body)
            await coursesServices.editMultiple({ ids, studentAttendanceFormData, user: req.user })
            res.send('Edited')
        } catch (error) {
            next(error)
        }

    },
    getXlsxCourse: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                id: validator.id(),
            })
            const { id } = await validator.validate(schema, { id: req.params.id })
            const { buffer, fileName } = await coursesServices.getXlsxCourse({ id, organizationId: req.user.organizationId })

            res.setHeader('Content-Disposition', `attachment; filename=${fileName}.xlsx`);
            res.status(200)
            res.end(buffer);
        } catch (error) {
            next(error)
        }
    },
}

module.exports = coursesControllers;
