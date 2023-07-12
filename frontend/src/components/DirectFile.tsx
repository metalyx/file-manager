import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { iFile } from '../models/File';
import axios from 'axios';
import { Box, CircularProgress, Alert } from '@mui/material';
import DirectFileCard from './DirectFileCard';
import { BASE_URL } from '../constants';
import { Axios } from '../helpers/Axios';

interface DirectFileComponentState {
    isLoading: boolean;
    error: string;
    currentFile?: iFile;
}

const DirectFile = () => {
    const { fileId } = useParams();

    if (!fileId) {
        return <></>;
    }

    const [networkState, setNetworkState] = useState<DirectFileComponentState>({
        isLoading: true,
        error: '',
        currentFile: undefined,
    });

    const fetchFile = async () => {
        try {
            const token = window.localStorage.getItem('token');

            let data;

            if (!token) {
                const response = await axios.get<iFile>(
                    `${BASE_URL}/files/public/${fileId}`
                );

                data = response.data;
            } else {
                const response = await Axios.get<iFile>(
                    `/files/public/${fileId}`
                );
                data = response.data;
            }

            setNetworkState({
                isLoading: false,
                error: '',
                currentFile: data,
            });
        } catch (e: any) {
            console.error(e);

            let error = 'Server Error';

            if (typeof e?.response?.data?.message === 'string') {
                error = e.response.data.message;
            }

            setNetworkState({
                isLoading: false,
                error,
                currentFile: undefined,
            });
        }
    };

    useEffect(() => {
        fetchFile();
    }, []);

    return (
        <Box sx={{ mt: 2 }}>
            {networkState.isLoading && <CircularProgress />}
            {networkState.error.length > 0 && (
                <Alert severity='error'>{networkState.error}</Alert>
            )}
            {networkState.currentFile && (
                <DirectFileCard file={networkState.currentFile} />
            )}
        </Box>
    );
};

export default DirectFile;
