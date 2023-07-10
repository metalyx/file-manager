const Router = require('express');
const multer = require('multer');

const router = new Router();
const upload = multer();

const authMiddleware = require('../middlewares/auth.middleware.cjs');

router.post('/upload', authMiddleware, upload.any(), async (req, res) => {
    try {
        const file = req.files;
        console.log(file);
        res.status(200).json(file);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'error' });
    }
});

module.exports = router;
