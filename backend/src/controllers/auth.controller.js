import bcrypt from 'bcryptjs'

import { getDb } from '../db.js'

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function signup(req, res, next) {
  try {
    const {
      fullName = '',
      email = '',
      password = '',
      confirmPassword = '',
      institution = '',
    } = req.body

    const trimmedName = fullName.trim()
    const trimmedInstitution = institution.trim()
    const normalizedEmail = normalizeEmail(email)

    if (!trimmedName) {
      return res.status(400).json({ message: 'Full name is required.' })
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Valid email is required.' })
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters long.' })
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' })
    }

    const db = getDb()

    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [normalizedEmail],
    )

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Email already exists.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const [result] = await db.query(
      'INSERT INTO users (full_name, email, password_hash, institution) VALUES (?, ?, ?, ?)',
      [trimmedName, normalizedEmail, passwordHash, trimmedInstitution || null],
    )

    const [rows] = await db.query(
      'SELECT id, full_name AS fullName, email, institution, created_at AS createdAt FROM users WHERE id = ? LIMIT 1',
      [result.insertId],
    )

    return res.status(201).json({
      message: 'Signup successful.',
      user: rows[0],
    })
  } catch (error) {
    return next(error)
  }
}

export async function login(req, res, next) {
  try {
    const { email = '', password = '' } = req.body
    const normalizedEmail = normalizeEmail(email)

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Valid email is required.' })
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required.' })
    }

    const db = getDb()
    const [rows] = await db.query(
      'SELECT id, full_name AS fullName, email, institution, password_hash AS passwordHash FROM users WHERE email = ? LIMIT 1',
      [normalizedEmail],
    )

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const user = rows[0]
    const passwordMatched = await bcrypt.compare(password, user.passwordHash)

    if (!passwordMatched) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    return res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        institution: user.institution,
      },
    })
  } catch (error) {
    return next(error)
  }
}
