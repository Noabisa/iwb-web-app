// ------------------- SIGNUP -------------------
const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    // Check if role limit is reached
    if (['sales', 'finance', 'developer'].includes(role)) {
      const [rows] = await db.execute('SELECT COUNT(*) AS count FROM users WHERE role = ?', [role]);
      if (rows[0].count >= 3) {
        return res.status(403).json({ error: `Only 3 ${role} personnel allowed.` });
      }
    }

    const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.execute(
      'INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashed, role, 0]
    );

    // Signup successful, return message
    return res.status(201).json({
      message: 'Signup successful. Please log in to continue.',
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// ------------------- LOGIN -------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Clean up previous OTPs
    await db.execute('DELETE FROM otp_verifications WHERE email = ?', [email]);

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    await db.execute(
      'INSERT INTO otp_verifications (email, otp, expires_at) VALUES (?, ?, ?)',
      [email, otp, expiresAt]
    );

    return res.status(200).json({
      message: 'OTP generated successfully.',
      otp, // Return OTP only in dev/test
      email,
      role: user.role,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// ------------------- VERIFY OTP -------------------
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM otp_verifications WHERE email = ? ORDER BY created_at DESC LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'No OTP found. Please log in again.' });
    }

    const record = rows[0];

    if (parseInt(record.expires_at) < Date.now()) {
      await db.execute('DELETE FROM otp_verifications WHERE email = ?', [email]);
      return res.status(400).json({ message: 'OTP has expired. Please log in again.' });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    const [userRows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userRows[0];

    await db.execute('UPDATE users SET is_verified = 1 WHERE email = ?', [email]);
    await db.execute('DELETE FROM otp_verifications WHERE email = ?', [email]);

    const token = generateToken(user);

    return res.status(200).json({
      message: 'OTP verified successfully.',
      token,
      role: user.role,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
