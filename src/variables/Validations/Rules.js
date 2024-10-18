export const validationRules = {
  numericPlus: {
    pattern: /^[0-9+]*$/,
    regex: /[^0-9+]/g,
  },
  alphaNumeric: {
    pattern: /^[a-zA-Z0-9]*$/,
    regex: /[^a-zA-Z0-9]/g,
  },
  alphaNumericDash: {
    pattern: /^[a-zA-Z0-9-]*$/,
    regex: /[^a-zA-Z0-9-]/g,
  },
  alphaNumericSlash: {
    pattern: /^[a-zA-Z0-9/-]*$/,
    regex: /[^a-zA-Z0-9/-]/g,
  },
  alphaNumericDashSlash: {
    pattern: /^[a-zA-Z0-9-/]*$/,
    regex: /[^a-zA-Z0-9-/]/g,
  },
};
