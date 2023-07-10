import saveAs from 'file-saver';
import { iFile } from '../models/File';

export const downloadFiles = (file: iFile) => {
    const { originalname, buffer, mimetype } = file;

    const byteArray = new Uint8Array(buffer.data);

    const fileData = new Blob([byteArray], { type: mimetype });

    saveAs(fileData, originalname);
};
