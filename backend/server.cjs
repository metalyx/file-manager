const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/auth.routes.cjs');
const fileRouter = require('./routes/file.routes.cjs');

dotenv.config({ path: __dirname + '/.env' });

const PORT = 5000;
const app = express();

// const __fname = fileURLToPath(import.meta.url);
// const dir = dirname(__fname);

app.use(cors());
app.use(express.json());

app.use(express.static('build_frontend'));

app.use('/api/auth', authRouter);
app.use('/api/files', fileRouter);

app.get('/*', function (req, res) {
    res.sendFile('index.html', {
        root: path.join(__dirname, './build_frontend'),
    });
});

const start = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.MONGO_LOGIN}:${process.env.MONGO_PASSWORD}@cluster0.jifgugk.mongodb.net/`
        );

        app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });
    } catch (e) {
        console.error(e);
        console.error('Server crashed');
    }
};

start();
