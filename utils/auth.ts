import * as cryptoJS from "crypto-js"
import * as fs from "fs"
import * as jwt from "jsonwebtoken"

const PRIVATE_KEY = fs.readFileSync('./constants/private.key')

const passwordHash = async (password) => {
    const salt = Math.random().toString(36).substring(2)
    const pw = password + salt
    const encrypted = await cryptoJS.SHA256(pw)
    return { salt, encrypted: encrypted.toString() }
}

const verifyPassword = async (password, hashed) => {
    const encrypted = await cryptoJS.SHA256(password)
    if (encrypted.toString() === hashed) return true
    return false
}

const generateJWT = async (payload) => {
    const expiresIn = 60 * 60 * 24
    const token = await jwt.sign(payload, PRIVATE_KEY, { expiresIn })
    return { token, expiresIn }
}

export {
    passwordHash,
    verifyPassword,
    generateJWT
}