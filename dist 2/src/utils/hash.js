"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePasswordHash = generatePasswordHash;
exports.comparePasswordHash = comparePasswordHash;
exports.generateOTP = generateOTP;
const bcrypt = require("bcrypt");
async function generatePasswordHash(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}
async function comparePasswordHash(password, hash) {
    return await bcrypt.compare(password, hash);
}
function generateOTP() {
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
}
//# sourceMappingURL=hash.js.map