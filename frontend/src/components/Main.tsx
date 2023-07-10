import React, { useState, useEffect } from 'react';
import { Axios } from '../helpers/Axios';
import { saveAs } from 'file-saver';

const Main = () => {
    const [file, setFile] = useState<File>();

    const handleFileSelected = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files !== null) {
            const files = Array.from(e.target.files);

            // console.log('files:', files[0]);
            setFile(files[0]);

            const file = files[0];

            const formData = new FormData();
            formData.append('file', file);

            const response = await Axios.post('/files/upload', formData, {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            });

            const { originalname, buffer, mimetype } = response.data[0];

            const byteArray = new Uint8Array(buffer.data);
            const fileData = new Blob([byteArray], { type: mimetype });

            saveAs(fileData, originalname);
        }
    };

    // useEffect(() => {}, [file]);

    return <input type='file' onChange={handleFileSelected} />;
};

export default Main;
