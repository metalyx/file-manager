import React, { useState, useEffect, useRef } from 'react';
import { Axios } from '../helpers/Axios';
import { saveAs } from 'file-saver';
import { iFile } from '../models/File';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fileSlice } from '../store/reducers/FileSlice';
import {
    Alert,
    Box,
    CircularProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Dialog,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FileCard from './FileCard';
import FileSettingsCard from './FileSettingsCard';

const Main = () => {
    const dispatch = useAppDispatch();
    const userFiles = useAppSelector((state) => state.fileReducer.userFiles);
    const isUserLoggedIn = useAppSelector(
        (state) => state.userReducer.isLoggedIn
    );
    const { addFile, setFiles, deleteFile } = fileSlice.actions;

    const inputRef = useRef(null);

    const navigate = useNavigate();

    const [fileUploadingState, setFileUploadingState] = useState({
        isLoading: false,
        isSizeLimitReached: false,
        isFailed: false,
        isSuccess: false,
    });

    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const [isOpenedSharingModal, setIsOpenedSharingModal] = useState(false);

    const [modalFile, setFileModal] = useState<iFile>();

    useEffect(() => {
        const fetchAllUserFiles = async () => {
            try {
                setIsInitialLoading(true);
                const response = await Axios.get<iFile[]>('/files');

                dispatch(setFiles(response.data));
                setIsInitialLoading(false);
            } catch (e) {
                setIsInitialLoading(false);
            }
        };

        fetchAllUserFiles();
    }, []);

    useEffect(() => {
        if (!isUserLoggedIn) {
            return navigate('/signIn');
        }
    }, [isUserLoggedIn]);

    const handleFileSelected = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files !== null) {
            setFileUploadingState({
                isLoading: true,
                isFailed: false,
                isSizeLimitReached: false,
                isSuccess: false,
            });

            const files = Array.from(e.target.files);
            const file = files[0];

            if (file.size > 1024 * 1024 * 15) {
                setFileUploadingState({
                    isLoading: false,
                    isFailed: false,
                    isSizeLimitReached: true,
                    isSuccess: false,
                });
                clearInput();
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await Axios.post<iFile>(
                    '/files/upload',
                    formData,
                    {
                        headers: {
                            'content-type': 'multipart/form-data',
                        },
                    }
                );

                setFileUploadingState({
                    isLoading: false,
                    isFailed: false,
                    isSizeLimitReached: false,
                    isSuccess: true,
                });
                dispatch(addFile(response.data));
            } catch (e) {
                console.log(e);
                setFileUploadingState({
                    isLoading: false,
                    isFailed: true,
                    isSizeLimitReached: false,
                    isSuccess: true,
                });
            }
        }
    };

    const deleteFileHandler = async (fileId: string) => {
        try {
            await Axios.delete(`/files/${fileId}`);
            dispatch(deleteFile(fileId));
        } catch (e) {
            console.error(e);
        }
    };

    const clearInput = () => {
        if (inputRef.current) {
            // @ts-ignore
            inputRef.current.value = '';
        }
    };

    const openPermissionsPopup = (fileId: iFile['_id']) => {
        setFileModal(userFiles.find((file) => file._id === fileId));
        setIsOpenedSharingModal(true);
    };

    return (
        <Box>
            {fileUploadingState.isSizeLimitReached && (
                <Alert severity='error' sx={{ mb: 2 }}>
                    File size cannot me more than 15.72 MB
                </Alert>
            )}
            {fileUploadingState.isFailed && (
                <Alert severity='error' sx={{ mb: 2 }}>
                    File uploading failed, try again later.
                </Alert>
            )}
            <input type='file' ref={inputRef} onChange={handleFileSelected} />
            {userFiles.length === 0 && !isInitialLoading && (
                <Typography variant='h5' component='div' sx={{ mt: 2 }}>
                    No files here, yet!
                </Typography>
            )}
            {isInitialLoading && <CircularProgress />}
            {userFiles.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography
                        sx={{ mt: 4, mb: 2 }}
                        variant='h5'
                        component='div'
                    >
                        Your files:
                    </Typography>
                    <List dense={true}>
                        {userFiles.map((file) => (
                            <FileCard
                                key={file._id}
                                file={file}
                                deleteFile={deleteFileHandler}
                                openPermissionsPopup={openPermissionsPopup}
                            />
                        ))}
                    </List>
                </Box>
            )}
            <Dialog
                open={isOpenedSharingModal}
                onClose={() => setIsOpenedSharingModal(false)}
            >
                <FileSettingsCard file={modalFile} />
            </Dialog>
        </Box>
    );
};

export default Main;
