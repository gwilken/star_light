const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = {

  createPassword: async (password) => {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  },

  validatePassword: async (password, userPassword) => {
    const compare = await bcrypt.compare(password, userPassword);
    return compare;
  },

  generateJWT: () => {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
      email: this.email,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
  },

  toAuthJSON: () => {
    return {
      _id: this._id,
      email: this.email,
      token: this.generateJWT(),
    };
  }

}
module.exports = userSchema;