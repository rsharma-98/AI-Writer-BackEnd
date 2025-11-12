const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// Use a secure environment variable for the secret. Default should ideally be empty.
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_fallback_do_not_use_in_prod'; 

/**
 * Validates the request body for missing required fields.
 * Returns true if all fields are present, otherwise sends a 400 response and returns false.
 */
const validateFields = (body, requiredFields, res) => {
  const missingFields = requiredFields.filter(field => !body[field]);
  if (missingFields.length > 0) {
    res.status(400).json({ 
        success: false, 
        error: 'Missing required fields', 
        missing: missingFields 
    });
    return false;
  }
  return true;
};

const signup = async (req, res) => {
  try {
    // 1. Validation
    if (!validateFields(req.body, ['email', 'password'], res)) return;
    const { name, email, password } = req.body;
    
    // 2. Check for existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Email already in use' }); // Use 409 Conflict
    }

    // 3. Create user
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    
    // 4. Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    // 5. Respond
    res.status(201).json({ // Use 201 Created
        success: true,
        token, 
        user: { 
            id: user._id, 
            name: user.name, 
            email: user.email 
        } 
    });

  } catch (error) {
    console.error('Signup Error:', error);
    // Handle database or unexpected errors
    res.status(500).json({ success: false, error: 'Internal Server Error during signup' });
  }
}

const login = async (req, res) => {
  try {
    // 1. Validation
    if (!validateFields(req.body, ['email', 'password'], res)) return;
    const { email, password } = req.body;
    
    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Respond with generic 'Invalid credentials' to prevent email enumeration attacks
      return res.status(401).json({ success: false, error: 'Invalid credentials' }); 
    }
    
    // 3. Compare password
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' }); // Use 401 Unauthorized
    }
    
    // 4. Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    // 5. Respond
    res.json({ 
        success: true,
        token, 
        user: { 
            id: user._id, 
            name: user.name, 
            email: user.email 
        } 
    });

  } catch (error) {
    console.error('Login Error:', error);
    // Handle database or unexpected errors
    res.status(500).json({ success: false, error: 'Internal Server Error during login' });
  }
}


module.exports = {
  signup,
  login
}