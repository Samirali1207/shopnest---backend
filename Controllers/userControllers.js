const User = require("../Models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail");

// token generation :
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" })
}

// regiter user 
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // HERE WE HAVE TO HASH THE PASSWORD SEND THE OTP FOR REGISTRATION AND EMAIL VERIFICATION

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User exists already" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({ name, email, password: hashedPassword })

        if (user) {

            const verificationToken = await crypto.randomBytes(10).toString("hex")

            const message = `Welcome to Shopnest , ${name} ! Thank you for registering with us  we are 
            excited , your verification Link  for Shopnest registration is ${process.env.FRONTEND_URL}/verify/${verificationToken}`

            console.log(process.env.FRONTEND_URL)

            await sendEmail(email, 'Welcome to shopnest - Your otp for registration', message)

            user.verificationToken = verificationToken
            user.save()

            res.status(201).json({
                message: "user registered successfully ",
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                verificationToken: verificationToken
            })
        }

    } catch (error) {
        res.status(400).json({ message: "internal server error " })
    }
}

//verify user
const verifyUser = async (req, res) => {
    try {

        const { token } = req.params;

        const user = await User.findOne({
            verificationToken: token
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired verification link."
            });
        }

        user.isVerified = true;
        user.verificationToken = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully."
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

//  login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        if (!user.isVerified) {
            return res.status(401).json({
                message: "not verified first verify the email"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
            message: "user logged in successfully "
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};


const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password')
        // {} means search every document and select -password means remove this field 
        res.json(users)
    } catch (error) {
        res.status(500).json("internal server error ")
    }
}

module.exports = { registerUser, verifyUser, loginUser, getUsers }