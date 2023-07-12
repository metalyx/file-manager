import saveAs from 'file-saver';
import { iFile } from '../models/File';
import { Axios } from './Axios';

export const downloadFiles = async (file: iFile) => {
    let { originalname, buffer, mimetype } = file;

    if (!buffer) {
        try {
            const { data } = await Axios.get(`/files/buffer/${file._id}`);

            if (!data) {
                throw new Error('Failed server request');
            }

            buffer = data.buffer;
        } catch (e) {
            console.error(e);
            return;
        }
    }

    const byteArray = new Uint8Array(buffer.data);

    const fileData = new Blob([byteArray], { type: mimetype });

    saveAs(fileData, originalname);
};
