const DEFAULT_VALIDATIONS = {
  PASSWORD: {
    required: { value: true },
    min: { value: 4 },
    max: { value: 16 },
    minUppercase: { value: 0 },
    minLowercase: { value: 0 },
    minNumbers: { value: 0 },
    minSymbols: { value: 0 },
    minRepeating: { value: 0 },
    minWords: { value: 1 },
  },
  EMAIL: {
    required: { value: true },
  },
  TEXT: {
    required: { value: false },
    max: { value: 255 },
  },
  ID: {
    required: { value: true },
    moreThan: { value: 0 },
    integer: { value: true },
  },
  IDS: {
    required: { value: true },
  },
  URL: {
    required: { value: false },
    max: { value: 2083 },
  },
  NAME: {
    required: { value: false },
    max: { value: 255 },
    matches: {
      value: /^[a-zA-Z\s]*$/,
    },
  }
};

module.exports = DEFAULT_VALIDATIONS;
