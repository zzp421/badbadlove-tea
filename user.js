const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const database = require('./database');

const router = express.Router();

// 用户注册
router.post('/register', (req, res) => {
    const { username, nickname, password, age } = req.body;

    // 检查是否已存在相同用户名的用户
    const existingUser = database.findUserByUsername(username);
    if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    // 使用 bcrypt 进行密码加密
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // 创建用户对象并保存到数据库
    const user = {
        id: uuidv4(),
        username,
        nickname,
        password: hashedPassword,
        age
    };
    database.saveUser(user);

    res.json({ message: 'Registration successful' });
});

// 用户登录
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 查找用户
    const user = database.findUserByUsername(username);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // 验证密码
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    res.json({ message: 'Login successful' });
});

// 查询用户信息并按年龄排序
router.get('/', (req, res) => {
    const users = database.getUsers();

    // 按年龄排序
    const sortedUsers = users.sort((a, b) => a.age - b.age);

    // 只返回昵称和年龄
    const userInfos = sortedUsers.map(user => ({
        nickname: user.nickname,
        age: user.age
    }));

    res.json(userInfos);
});

module.exports = router;