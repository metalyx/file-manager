const Router = require('express');
const multer = require('multer');
const File = require('../models/File.cjs');

const router = new Router();
const upload = multer();

const authMiddleware = require('../middlewares/auth.middleware.cjs');
const serverError = require('../helpers/serverError.cjs');
const success = require('../helpers/success.cjs');
const User = require('../models/User.cjs');
const clientError = require('../helpers/clientError.cjs');

const jwt = require('jsonwebtoken');

router.post('/upload', authMiddleware, upload.any(), async (req, res) => {
    try {
        const file = req.files[0];
        const userId = req.user.id;
        console.log(file);

        const user = await User.findById(userId);

        if (!user) {
            return clientError(res, `User with id ${userId} was not found.`);
        }

        const userFiles = await File.find({ userId }).select('-buffer');

        const matching = userFiles.find(
            (_file) => _file.originalname === file.originalname
        );

        if (matching) {
            return clientError(
                res,
                `Couldn't create file with filename ${file.originalname}. Filename must be unique for each user.`
            );
        }

        const sizeDelta = user.diskSpace - user.usedSpace - file.size;

        if (sizeDelta <= 0) {
            return clientError(
                res,
                `You cannot be over the available disk space limit.`
            );
        }

        user.usedSpace += file.size;

        const createdFile = new File({
            ...file,
            userId,
        });

        await createdFile.save();
        await user.save();

        res.status(200).json(createdFile);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'error' });
    }
});

router.delete('/deleteAll', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const deletedItems = await File.deleteMany({ userId });
        const user = await User.findById(userId);

        user.usedSpace = 0;

        await user.save();
        res.status(200).json(deletedItems);
    } catch (e) {
        serverError(res, e);
    }
});

router.delete('/:fileId', authMiddleware, async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const userId = req.user.id;

        const file = await File.findById(fileId).select('-buffer');

        if (!file) {
            return clientError(res, `File with id ${fileId} was not found`);
        }

        if (file.userId.toString() !== userId) {
            return clientError(
                res,
                `You don't have permission to delete this file.`
            );
        }

        const user = await User.findById(userId);
        user.usedSpace -= file.size;
        await user.save();

        const deletedFile = await File.findByIdAndDelete(fileId);

        return res.status(200).json(deletedFile);
    } catch (e) {
        return serverError(res, e);
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const userFiles = await File.find({
            userId: req.user.id,
        }).select('-buffer');

        return res.status(200).json(userFiles);
    } catch (e) {
        return serverError(res, e);
    }
});

router.put('/:fileId', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const fileId = req.params.fileId;
        const body = req.body;

        const fileToBeChanged = await File.findById(fileId).select('-buffer');

        if (!fileToBeChanged) {
            return clientError(res, `File with id ${fileId} was not found.`);
        }

        if (fileToBeChanged.userId.toString() !== userId) {
            return clientError(
                res,
                `You don't have a permission to edit this file settings.`
            );
        }

        fileToBeChanged._doc = {
            ...fileToBeChanged._doc,
            ...body,
        };

        fileToBeChanged.markModified(Object.keys(body));
        const savedFile = await fileToBeChanged.save();

        res.status(200).json(savedFile);
    } catch (e) {
        return serverError(res, e);
    }
});

router.get('/public/:fileId', async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const file = await File.findById(fileId).select('-buffer');

        if (!file) {
            return clientError(res, 'Incorrect fileId provided.');
        }

        if (file.public !== true) {
            return clientError(res, 'This file is private.');
        }

        res.status(200).json(file);
    } catch (e) {
        return serverError(res, e);
    }
});

router.get('/buffer/:fileId', async (req, res) => {
    try {
        const fileId = req.params.fileId;

        if (!fileId) {
            return clientError(res, 'FileId was not provided.');
        }

        const file = await File.findById(fileId);

        if (!file) {
            return clientError(res, `File with id ${fileId} was not found.`);
        }

        if (!file.public) {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Auth error' });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            const userId = req.user.id;

            if (!userId) {
                return res
                    .status(401)
                    .json({ message: `This file is private.` });
            }

            if (file.userId.toString() !== userId) {
                return res
                    .status(401)
                    .json({ message: `This file is private.` });
            }
        }

        res.status(200).json({ buffer: file.buffer });
    } catch (e) {
        return serverError(res, e);
    }
});

module.exports = router;
