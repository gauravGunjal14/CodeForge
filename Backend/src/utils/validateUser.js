const validator = require("validator");

const validateUser = (userData) => {

    const mandatoryFields = ['firstName', 'email', 'password'];

    const isAllowed = mandatoryFields.every((field)=> Object.keys(userData).includes(field));

    if (!isAllowed) {
        throw new Error(`Missing mandatory fields: ${mandatoryFields.join(', ')}`);
    }

    if (!validator.isEmail(userData.email)) {
        throw new Error("Invalid email format");
    }

    if (!validator.isStrongPassword(userData.password)) {
        throw new Error("Weak password.");
    }
    
    if (!validator.isLength(userData.firstName, {min: 3, max: 20})) {
        throw new Error("First name must be between 3 and 20 characters.");
    }
};
module.exports = validateUser;