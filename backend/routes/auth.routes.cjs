const Router = require('express');
const User = require('../models/User.cjs');
const serverError = require('../helpers/serverError.cjs');
const clientError = require('../helpers/clientError.cjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const success = require('../helpers/success.cjs');
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware.cjs');

const router = new Router();

router.post(
    '/registration',
    [
        check('email', 'Incorrect email').isEmail(),
        check(
            'password',
            'Password must be more than 3 and shorter than 12 characters'
        ).isLength({ min: 3, max: 12 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json(errors);
            }

            const { email, password } = req.body;

            if (!email || !password) {
                return clientError(res, 'Email and password required');
            }

            const candidate = await User.findOne({ email });

            if (candidate) {
                return clientError(res, 'User with this email already exists.');
            }

            const hashedPassword = bcrypt.hashSync(password, 7);
            const user = new User({ email, password: hashedPassword });

            await user.save();

            return success(res, 'User successfully created!');
        } catch (e) {
            serverError(res);
        }
    }
);

router.post(
    '/login',
    [
        check('email', 'Incorrect email').isEmail(),
        check(
            'password',
            'Password must be more than 3 and shorter than 12 characters'
        ).isLength({ min: 3, max: 12 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return clientError(res, errors);
            }

            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isPassValid = bcrypt.compareSync(password, user.password);

            if (!isPassValid) {
                return res.status(400).json({ message: 'Invalid password' });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });

            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar,
                },
            });
        } catch (e) {
            return serverError(res, e);
        }
    }
);

router.get('/auth', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace: user.usedSpace,
                avatar: user.avatar,
            },
        });
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' });
    }
});

module.exports = router;
