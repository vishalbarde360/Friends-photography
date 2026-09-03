// validators.js
// Centralized, "extreme hard" input validation for auth routes.
// Every function returns { valid: boolean, message?: string }

const EMAIL_REGEX =
    /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/

const NAME_REGEX = /^[a-zA-Z\u0900-\u097F][a-zA-Z\u0900-\u097F .'-]{1,49}$/
// allows English + Devanagari letters, spaces, dot, apostrophe, hyphen (2-50 chars)

const PASSWORD_MIN = 8
const PASSWORD_MAX = 128
const NAME_MAX = 50
const EMAIL_MAX = 254

// Reject anything that isn't a plain string — blocks NoSQL-injection style
// payloads like { "$gt": "" } or arrays being passed as email/password.
const isPlainString = (val) => typeof val === "string"

const validateEmail = (email) => {
    if (!isPlainString(email)) {
        return { valid: false, message: "Email must be a string" }
    }
    const trimmed = email.trim()
    if (trimmed.length === 0) {
        return { valid: false, message: "Email is required" }
    }
    if (trimmed.length > EMAIL_MAX) {
        return { valid: false, message: `Email must be under ${EMAIL_MAX} characters` }
    }
    if (!EMAIL_REGEX.test(trimmed)) {
        return { valid: false, message: "Invalid email format" }
    }
    return { valid: true, value: trimmed.toLowerCase() }
}

const validateName = (name) => {
    if (!isPlainString(name)) {
        return { valid: false, message: "Name must be a string" }
    }
    const trimmed = name.trim()
    if (trimmed.length === 0) {
        return { valid: false, message: "Name is required" }
    }
    if (trimmed.length > NAME_MAX) {
        return { valid: false, message: `Name must be under ${NAME_MAX} characters` }
    }
    if (!NAME_REGEX.test(trimmed)) {
        return {
            valid: false,
            message: "Name may only contain letters, spaces, apostrophes, hyphens or dots",
        }
    }
    return { valid: true, value: trimmed }
}

// Extreme / strict password policy:
// - 8 to 128 chars
// - at least 1 uppercase, 1 lowercase, 1 digit, 1 special char
// - no whitespace allowed
// - blocks a small common-password blocklist
const COMMON_PASSWORDS = new Set([
    "password", "password1", "12345678", "qwerty123", "letmein123",
    "admin1234", "iloveyou1", "welcome123", "changeme1", "123456789",
])

const validatePassword = (password) => {
    if (!isPlainString(password)) {
        return { valid: false, message: "Password must be a string" }
    }
    if (password.length < PASSWORD_MIN) {
        return { valid: false, message: `Password must be at least ${PASSWORD_MIN} characters` }
    }
    if (password.length > PASSWORD_MAX) {
        return { valid: false, message: `Password must be under ${PASSWORD_MAX} characters` }
    }
    if (/\s/.test(password)) {
        return { valid: false, message: "Password must not contain whitespace" }
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: "Password must contain at least one uppercase letter" }
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: "Password must contain at least one lowercase letter" }
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: "Password must contain at least one digit" }
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        return { valid: false, message: "Password must contain at least one special character" }
    }
    if (COMMON_PASSWORDS.has(password.toLowerCase())) {
        return { valid: false, message: "Password is too common, choose a stronger one" }
    }
    return { valid: true, value: password }
}

const validateSetupKey = (setupKey) => {
    if (!isPlainString(setupKey) || setupKey.trim().length === 0) {
        return { valid: false, message: "Setup key is required" }
    }
    return { valid: true, value: setupKey }
}

const validateMongoId = (id) => {
    if (!isPlainString(id) || !/^[a-fA-F0-9]{24}$/.test(id)) {
        return { valid: false, message: "Invalid id format" }
    }
    return { valid: true, value: id }
}

module.exports = {
    validateEmail,
    validateName,
    validatePassword,
    validateSetupKey,
    validateMongoId,
}