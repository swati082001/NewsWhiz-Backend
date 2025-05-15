const { v4: uuidv4 } = require("uuid");

function createSessionId() {
    return uuidv4();
}

module.exports = { createSessionId };
