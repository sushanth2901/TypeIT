"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: "String",
        required: true,
    },
    email: {
        type: "String",
        required: true,
        unique: true,
    },
    password: {
        type: "String",
        required: true,
        minLength: 10,
    },
});
exports.default = (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=User.js.map