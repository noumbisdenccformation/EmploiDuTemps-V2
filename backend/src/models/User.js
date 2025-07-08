const crypto = require('crypto');

class User {
  constructor(email, phone, password, firstName = '', lastName = '') {
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.createdAt = new Date();
  }

  async hashPassword() {
    this.password = crypto.createHash('sha256').update(this.password).digest('hex');
  }

  async verifyPassword(password) {
    const hashedInput = crypto.createHash('sha256').update(password).digest('hex');
    return this.password === hashedInput;
  }

  static isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  static isValidPhone(phone) {
    // Validation très souple pour zone CFA
    const cleaned = phone.replace(/[\s\-()]/g, '');
    return cleaned.length >= 10 && /^\+\d+$/.test(cleaned);
  }
}

module.exports = User;