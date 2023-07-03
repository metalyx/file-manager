import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config({
    path: '../.env',
});

const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static('build_frontend'));

const start = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.MONGO_LOGIN}:${process.env.MONGO_PASSWORD}@cluster0.jifgugk.mongodb.net/`
        );

        app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });
    } catch (e) {
        console.error('Server crashed');
    }
};

start();
