const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model('User', userSchema);

// 회원가입 라우트
app.post('/api/signup', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).send({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).send({ message: 'Error creating user', error: error.message });
    }
});

// 로그인 라우트
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        if (user.password !== password) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }
        res.send({ message: 'Login successful', user: user });
    } catch (error) {
        res.status(500).send({ message: 'Server error', error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
