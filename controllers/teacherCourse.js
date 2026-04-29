'use strict';

const coursesRepositories = require('../repositories/courses');
const studentsServices = require('../services/students');
const classSessionsServices = require('../services/classSessions');
const validator = require('../services/validator');
const moment = require('moment');

const teacherCourseControllers = {
  listCourses: async (req, res, next) => {
    try {
      const courses = await coursesRepositories.getAllByTeacherId(
        req.user.id,
        req.user.organizationId
      );
      res.json(courses.map((c) => c.toJSON()));
    } catch (error) {
      next(error);
    }
  },
  getCourse: async (req, res, next) => {
    try {
      res.json(req.teacherCourse);
    } catch (error) {
      next(error);
    }
  },
  getStudents: async (req, res, next) => {
    try {
      const { id } = req.teacherCourse;
      const students = await studentsServices.getByCourse({ courseId: id });
      res.json(students);
    } catch (error) {
      next(error);
    }
  },
  getStudent: async (req, res, next) => {
    try {
      const schema = validator.createSchema({
        id: validator.id(),
      });
      const { id } = await validator.validate(schema, { id: req.params.id });
      const student = await studentsServices.getOneByCourse({
        id,
        course: req.teacherCourse,
      });
      res.json(student);
    } catch (error) {
      next(error);
    }
  },
  newClass: async (req, res, next) => {
    try {
      const schema = validator.createSchema({
        date: validator.date({ required: { value: true }, max: { value: moment() } }),
        presentStudentsData: validator
          .array({ required: { value: true } })
          .of(
            validator.object(
              { required: { value: true } },
              {
                id: validator.id(),
                ...validator.getStudentAttendanceSchema(
                  req.teacherCourse.studentAttendanceFormData
                ),
              }
            )
          ),
      });
      const { presentStudentsData, date } = await validator.validate(schema, req.body);
      await classSessionsServices.newCourseClass({
        course: req.teacherCourse,
        presentStudentsData,
        date,
      });
      res.send('Class session saved');
    } catch (error) {
      next(error);
    }
  },
  createStudent: async (req, res, next) => {
    try {
      const schema = validator.createSchema({
        firstName: validator.text({ required: { value: true } }),
        lastName: validator.text({ required: { value: true } }),
        avatarFileId: validator.id({ required: { value: false } }),
        birthDate: validator.date({ required: { value: false } }),
        additionalInfo: validator.anyObject(),
      });
      const { firstName, lastName, avatarFileId, birthDate, additionalInfo } = await validator.validate(
        schema,
        req.body
      );
      const { id: courseId, organizationId } = req.teacherCourse;
      await studentsServices.create({
        organizationId,
        courseId,
        firstName,
        lastName,
        avatarFileId,
        birthDate,
        additionalInfo,
      });
      res.send('Student created into current course');
    } catch (error) {
      next(error);
    }
  },
  editStudent: async (req, res, next) => {
    try {
      const schema = validator.createSchema({
        id: validator.id(),
        firstName: validator.text({ required: { value: true } }),
        lastName: validator.text({ required: { value: true } }),
        avatarFileId: validator.id({ required: { value: false } }),
        birthDate: validator.date({ required: { value: false } }),
        additionalInfo: validator.anyObject(),
      });
      const { id, firstName, lastName, avatarFileId, birthDate, additionalInfo } =
        await validator.validate(schema, { ...req.body, id: req.params.id });
      await studentsServices.editOneByCourse({
        id,
        course: req.teacherCourse,
        firstName,
        lastName,
        avatarFileId,
        birthDate,
        additionalInfo,
      });
      res.send('Student edited into current course');
    } catch (error) {
      next(error);
    }
  },
  getClassSessions: async (req, res, next) => {
    try {
      const { id } = req.teacherCourse;
      const classSessions = await classSessionsServices.getByCourse({ courseId: id });
      res.json(classSessions);
    } catch (error) {
      next(error);
    }
  },
  deleteClassSession: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id: courseId } = req.teacherCourse;
      await classSessionsServices.deleteByIdAndCourse({ id, courseId });
      res.send('Class session deleted');
    } catch (error) {
      next(error);
    }
  },
  getClassSession: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id: courseId } = req.teacherCourse;
      const classSession = await classSessionsServices.getByIdAndCourse({ id, courseId });
      res.json(classSession);
    } catch (error) {
      next(error);
    }
  },
  editClassSession: async (req, res, next) => {
    try {
      const schema = validator.createSchema({
        id: validator.id(),
        date: validator.date({ required: { value: true }, max: { value: moment() } }),
      });
      const { date, id } = await validator.validate(schema, {
        ...req.body,
        id: req.params.id,
      });
      const { id: courseId } = req.teacherCourse;
      await classSessionsServices.editOne({
        id,
        courseId,
        presentStudentsData: req.body.presentStudentsData,
        date,
      });
      res.send('Class session saved');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = teacherCourseControllers;
