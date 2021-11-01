import { query } from '@/databases/db_connection'

export class AuthModel {
  async signup(payload) {
    const result = await query(`INSERT INTO users SET ?`, [payload])
    return result
  }
  async findUserByEmail({ email, status }) {
    const result = await query(
      `SELECT userId, userCode, email, userName, password, salt, lastToken, userRole FROM users WHERE email = ? AND status = ?`,
      [email, status]
    )
    return result
  }
  async updateToken({ userId, token }) {
    const result = await query(`UPDATE users SET lastToken = ? WHERE userId = ?`, [token, userId])
    return result
  }
  async findJWTToken({ userCode, token }) {
    const result = await query(`SELECT lastToken FROM users WHERE userCode = ? AND lastToken = ?`, [userCode, token])
    return result
  }
}
