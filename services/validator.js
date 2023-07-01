'use strict';

const _ = require('lodash');
const Yup = require('yup');
const YupPassword = require('yup-password');
const ERRORS = require('../constants/errors');
const DEFAULT_VALIDATIONS = require('../constants/defaultValidations');
const { FORM_FIELDS_TYPES } = require('../constants/formFields');

YupPassword(Yup);

const string = (config = {}) => {
  let yupString = Yup.string();
  if (config.required && config.required?.value) {
    yupString = yupString.required();
  } else {
    yupString = yupString.nullable();
  }
  if (config.min && config.min?.value) {
    yupString = yupString.min(config.min.value);
  }
  if (config.max && config.max?.value) {
    yupString = yupString.max(config.max.value);
  }
  return yupString;
};

const date = (config = {}) => {
  let yupDate = Yup.date();
  if (config.required && config.required?.value) {
    yupDate = yupDate.required();
  } else {
    yupDate = yupDate.nullable();
  }
  if (config.min && config.min?.value) {
    yupDate = yupDate.min(config.min.value);
  }
  if (config.max && config.max?.value) {
    yupDate = yupDate.max(config.max.value);
  }
  return yupDate;
};

const number = (config = {}) => {
  let yupNumber = Yup.number();
  if (config.required && config.required?.value) {
    yupNumber = yupNumber.required();
  } else {
    yupNumber = yupNumber.nullable();
  }
  if (config.integer && config.integer?.value) {
    yupNumber = yupNumber.integer();
  }
  if (config.min && config.min?.value) {
    yupNumber = yupNumber.min(config.min.value);
  }
  if (config.max && config.max?.value) {
    yupNumber = yupNumber.max(config.max.value);
  }
  if (config.moreThan && config.moreThan?.value) {
    yupNumber = yupNumber.moreThan(config.moreThan.value);
  }
  if (config.lessThan && config.lessThan?.value) {
    yupNumber = yupNumber.lessThan(config.lessThan.value);
  }
  return yupNumber;
};

const password = (_config = {}) => {
  const config = _.merge(_.cloneDeep(DEFAULT_VALIDATIONS.PASSWORD), _config);

  let yupPassword = string(config).password();

  if (config.min && _.isNumber(config.min?.value)) {
    yupPassword = yupPassword.min(config.min.value);
  }
  if (config.max && _.isNumber(config.max?.value)) {
    yupPassword = yupPassword.max(config.max.value);
  }
  if (config.minUppercase && _.isNumber(config.minUppercase?.value)) {
    yupPassword = yupPassword.minUppercase(config.minUppercase.value);
  }
  if (config.minLowercase && _.isNumber(config.minLowercase?.value)) {
    yupPassword = yupPassword.minLowercase(config.minLowercase.value);
  }
  if (config.minNumbers && _.isNumber(config.minNumbers?.value)) {
    yupPassword = yupPassword.minNumbers(config.minNumbers.value);
  }
  if (config.minSymbols && _.isNumber(config.minSymbols?.value)) {
    yupPassword = yupPassword.minSymbols(config.minSymbols.value);
  }
  if (config.minRepeating && config.minRepeating?.value) {
    yupPassword = yupPassword.minRepeating(config.minRepeating.value);
  }
  if (config.minWords && _.isNumber(config.minWords?.value)) {
    yupPassword = yupPassword.minWords(config.minWords.value);
  }

  return yupPassword;
};

const email = (_config = {}) => {
  const config = _.merge(_.cloneDeep(DEFAULT_VALIDATIONS.EMAIL), _config);
  const yupEmail = string(config).email();
  return yupEmail;
};

const text = (_config = {}) => {
  const config = _.merge(_.cloneDeep(DEFAULT_VALIDATIONS.TEXT), _config);
  const yupText = string(config);
  return yupText;
};

const oneOf = (values, config = {}) => {
  const yupOneOf = string(config).oneOf(values);
  return yupOneOf;
};

const id = (_config = {}) => {
  const config = _.merge(_.cloneDeep(DEFAULT_VALIDATIONS.ID), _config);
  const yupId = number(config).integer();
  return yupId;
};

const url = (_config = {}) => {
  const config = _.merge(_.cloneDeep(DEFAULT_VALIDATIONS.URL, _config));
  const yupUrl = string(config).url();
  return yupUrl;
};

const array = (config = {}) => {
  let yupArray = Yup.array();
  if (config.required && config.required?.value) {
    yupArray = yupArray.required();
  } else {
    yupArray = yupArray.nullable();
  }
  return yupArray;
};

const ids = (_config = {}) => {
  const config = _.merge(_.cloneDeep(DEFAULT_VALIDATIONS.IDS), _config);
  const yupIds = array(config).of(id());
  return yupIds;
};

const object = (config = {}, obj) => {
  let yupObject = Yup.object(obj);
  if (config.required && config.required?.value) {
    yupObject = yupObject.required();
  } else {
    yupObject = yupObject.default(null).nullable();
  }
  return yupObject;
};

const boolean = (config = {}) => {
  let yupBoolean = Yup.boolean();
  if (config.required && config.required?.value) {
    yupBoolean = yupBoolean.required();
  } else {
    yupBoolean = yupBoolean.nullable();
  }
  return yupBoolean;
};

//TODO cambiar esto para que la config sea dinamica segun el tipo de input
const formFieldData = (config = {}) => {
  const yupFormFieldData = object(config).shape(
    {
      name: string({ required: { value: true } }),
      // placeholder: string({ required: { value: false } }),
      type: oneOf(_.values(FORM_FIELDS_TYPES), { required: { value: true } }),
      /*  config: object({ required: { value: false } }).shape({
         required: object({ required: { value: false } }).shape({
           value: boolean({ required: { value: true } }),
         }),
         min: object({ required: { value: false } }).shape({
           value: number({ required: { value: true } }),
         }),
         max: object({ required: { value: false } }).shape({
           value: number({ required: { value: true } }),
         }),
         minUppercase: object({ required: { value: false } }).shape({
           value: number({ required: { value: true } }),
         }),
         minLowercase: object({ required: { value: false } }).shape({
           value: number({ required: { value: true } }),
         }),
         minNumbers: object({ required: { value: false } }).shape({
           value: number({ required: { value: true } }),
         }),
         minSymbols: object({ required: { value: false } }).shape({
           value: number({ required: { value: true } }),
         }),
         minRepeating: object({ required: { value: false } }).shape({
           value: number({ required: { value: true } }),
         }),
         minWords: object({ required: { value: false } }).shape({
           value: number({ required: { value: true } }),
         }),
         integer: object({ required: { value: false } }).shape({
           value: boolean({ required: { value: true } }),
         }),
         moreThan: object({ required: { value: false } }).shape({
           value: number({ required: { value: true } }),
         }),
         lessThan: object({ required: { value: false } }).shape({
           value: number({ required: { value: true } }),
         }),
         oneOf: object({ required: { value: false } }).shape({
           value: array({ required: { value: true } }),
         }),
         email: object({ required: { value: false } }).shape({
           value: boolean({ required: { value: true } }),
         }),
         url: object({ required: { value: false } }).shape({
           value: boolean({ required: { value: true } }),
         }),
       }) */
    })
  return yupFormFieldData;
};

const formFieldsDataList = (config = {}) => {
  const yupFormFieldsDataList = array(config).of(formFieldData());
  return yupFormFieldsDataList;
};

const createSchema = (schema) => {
  return Yup.object().shape(schema);
};

const validate = async (schema, obj) => {
  const result = await schema.validate(obj, { stripUnknown: true }).catch((err) => {
    throw { ...ERRORS.E422, data: { field: err.path, reason: err.errors[0] } };
  });
  return result;
};

const getStudentAttendanceSchema = (studentAttendanceFormData = []) => {
  if (_.isEmpty(studentAttendanceFormData)) {
    return {};
  } else {
    const schema = {};
    _.forEach(studentAttendanceFormData, (formField) => {
      if (formField.type === FORM_FIELDS_TYPES.CHECKBOX) {
        schema[formField.name] = boolean({ required: { value: true } });
      }
    });
    return { metadata: object({ required: { value: true } }, schema) };
  }


}

module.exports = {
  email,
  password,
  string,
  validate,
  createSchema,
  text,
  oneOf,
  date,
  number,
  id,
  url,
  ids,
  array,
  object,
  boolean,
  formFieldData,
  formFieldsDataList,
  getStudentAttendanceSchema
};
