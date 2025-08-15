const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET
//hash a password using bcrypt
async function hashPassword(password){
    return bcrypt.hash(password, SALT_ROUNDS);
}
async  function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}
function createToken(user) {
    return jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
}
module.exports = {
    hashPassword,
    verifyPassword,
    createToken
}