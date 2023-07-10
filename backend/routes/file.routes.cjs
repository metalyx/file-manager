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

router.post('/upload', authMiddleware, upload.any(), async (req, res) => {
    try {
        const file = req.files[0];
        const userId = req.user.id;
        console.log(file);

        const user = await User.findById(userId);

        if (!user) {
            return clientError(`User with id ${userId} was not found.`);
        }

        const userFiles = await File.find({ userId });

        const matching = userFiles.find(
            (_file) => _file.originalname === file.originalname
        );

        if (matching) {
            return clientError(
                `Couldn't create file with filename ${file.originalname}`
            );
        }

        // const createdFile = await File.create(file);

        const createdFile = new File({
            ...file,
            userId,
        });

        await createdFile.save();

        res.status(200).json(createdFile);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'error' });
    }
});

router.delete('/deleteAll', authMiddleware, async (req, res) => {
    try {
        const deletedItems = await File.deleteMany();
        res.status(200).json(deletedItems);
    } catch (e) {
        serverError(res, e);
    }
});

router.delete('/:fileId', authMiddleware, async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const userId = req.user.id;

        const file = await File.findById(fileId);

        if (!file) {
            return clientError(res, `File with id ${fileId} was not found`);
        }

        if (file.userId.toString() !== userId) {
            return clientError(
                res,
                `You don't have permission to delete this file.`
            );
        }

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
        });

        return res.status(200).json(userFiles);
    } catch (e) {
        return serverError(res, e);
    }
});

module.exports = router;
