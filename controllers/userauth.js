const UserSchema = require("../models/Usermodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");

// Function to create a JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await UserSchema.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User doesn't exist" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Create JWT token
        const token = createToken(user._id);
        return res.status(200).json({ success: true, token });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Register User
exports.registerUser = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Check if user already exists
        const exists = await UserSchema.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        // Validate email and password
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Please enter a strong password (min 6 characters)" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new UserSchema({
            username: username,
            email: email,
            password: hashedPassword
        });

        // Save user to the database
        const user = await newUser.save();

        // Create JWT token
        const token = createToken(user._id);
        return res.status(201).json({ success: true, token });

    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
