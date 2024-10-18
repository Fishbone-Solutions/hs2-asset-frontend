export const validationRules = {
  numericPlus: {
    pattern: /^[0-9+ ]*$/, // Allows numbers, +, and spaces
    regex: /[^0-9+ ]/g,
  },
  alphaNumeric: {
    pattern: /^[a-zA-Z0-9 ]*$/, // Allows letters, numbers, and spaces
    regex: /[^a-zA-Z0-9 ]/g,
  },
  alphaNumericDash: {
    pattern: /^[a-zA-Z0-9- ]*$/, // Allows letters, numbers, -, and spaces
    regex: /[^a-zA-Z0-9- ]/g,
  },
  alphaNumericSlash: {
    pattern: /^[a-zA-Z0-9/ ]*$/, // Allows letters, numbers, /, and spaces
    regex: /[^a-zA-Z0-9/ ]/g,
  },
  alphaNumericDashSlash: {
    pattern: /^[a-zA-Z0-9-/ ]*$/, // Allows letters, numbers, -, /, and spaces
    regex: /[^a-zA-Z0-9-/ ]/g,
  },
};
