export const validationRules = {
  numeric: {
    pattern: /^[0-9. ]*$/, // Allows numbers, +, and spaces
    regex: /[^0-9. ]/g,
  },
  numericPlus: {
    pattern: /^[0-9+ ]*$/, // Allows numbers, +, and spaces
    regex: /[^0-9+ ]/g,
  },
  alphabets: {
    pattern: /^[a-zA-Z ]*$/, // Allows letters, numbers, and spaces
    regex: /[^a-zA-Z ]/g,
  },
  alphaNumeric: {
    pattern: /^[a-zA-Z0-9 ]*$/, // Allows letters, numbers, and spaces
    regex: /[^a-zA-Z0-9 ]/g,
  },
  alphaNumericDescription: {
    pattern: /^[a-zA-Z0-9.,-/: ]*$/, // Allows letters, numbers, spaces, commas, and full stops
    regex: /[^a-zA-Z0-9.,-/: ]/g,
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
  alphaNumericDashSlashColun: {
    pattern: /^[a-zA-Z0-9-/: ]*$/, // Allows letters, numbers, -, /, and spaces
    regex: /[^a-zA-Z0-9-/: ]/g,
  },
  alphaNumericLogin: {
    pattern: /^[a-zA-Z0-9-,. ]*$/, // Allows letters, numbers, -, /, and spaces
    regex: /[^a-zA-Z0-9-,. ]/g,
  },
  alphaNumericDashDot: {
    pattern: /^[a-zA-Z0-9-. ]*$/, // Allows letters, numbers, -, and spaces
    regex: /[^a-zA-Z0-9-. ]/g,
  },
};
