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
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FileCard from './FileCard';
import FileSettingsCard from './FileSettingsCard';
import { userSlice } from '../store/reducers/UserSlice';
import { LoadingButton } from '@mui/lab';
import { formatBytes } from '../helpers/formatBytes';

const Main = () => {
    const dispatch = useAppDispatch();
    const userFiles = useAppSelector((state) => state.fileReducer.userFiles);
    const isUserLoggedIn = useAppSelector(
        (state) => state.userReducer.isLoggedIn
    );
    const availableSpace = useAppSelector(
        (state) => state.userReducer.diskSpace - state.userReducer.usedSpace
    );
    const { addFile, setFiles, deleteFile } = fileSlice.actions;
    const setUser = userSlice.actions.setUser;

    const inputRef = useRef(null);
    const navigate = useNavigate();

    const [fileUploadingState, setFileUploadingState] = useState({
        isLoading: false,
        isSizeLimitReached: false,
        error: '',
        isSuccess: false,
    });

    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isOpenedSharingModal, setIsOpenedSharingModal] = useState(false);
    const [modalFile, setFileModal] = useState<iFile['_id']>();

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
                error: '',
                isSizeLimitReached: false,
                isSuccess: false,
            });

            const files = Array.from(e.target.files);
            const file = files[0];

            if (file.size > 1024 * 1024 * 15) {
                setFileUploadingState({
                    isLoading: false,
                    error: '',
                    isSizeLimitReached: true,
                    isSuccess: false,
                });
                clearInput();
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            try {
                const { data } = await Axios.post<iFile>(
                    '/files/upload',
                    formData,
                    {
                        headers: {
                            'content-type': 'multipart/form-data',
                        },
                    }
                );

                const response = await Axios.get('/auth/auth');

                dispatch(addFile(data));
                dispatch(
                    setUser({
                        ...response.data.user,
                        isLoggedIn: true,
                    })
                );

                setFileUploadingState({
                    isLoading: false,
                    error: '',
                    isSizeLimitReached: false,
                    isSuccess: true,
                });
            } catch (e: any) {
                let error = 'Server error, try again later...';

                if (typeof e?.response?.data?.message === 'string') {
                    error = e.response.data.message;
                }

                setFileUploadingState({
                    isLoading: false,
                    error,
                    isSizeLimitReached: false,
                    isSuccess: true,
                });
            }
            clearInput();
        }
    };

    const deleteFileHandler = async (fileId: string) => {
        try {
            await Axios.delete(`/files/${fileId}`);
            const response = await Axios.get('/auth/auth');

            dispatch(
                setUser({
                    ...response.data.user,
                    isLoggedIn: true,
                })
            );
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
        setFileModal(fileId);
        setIsOpenedSharingModal(true);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', my: 2 }}>
                <Typography variant='subtitle1'>
                    Available space: {formatBytes(availableSpace)}
                </Typography>
            </Box>
            {fileUploadingState.isSizeLimitReached && (
                <Alert severity='error' sx={{ mb: 2 }}>
                    File size cannot be more than 15.72 MB
                </Alert>
            )}
            {fileUploadingState.error.length > 0 && (
                <Alert severity='error' sx={{ mb: 2 }}>
                    {fileUploadingState.error}
                </Alert>
            )}
            <LoadingButton
                variant='contained'
                component='label'
                loading={fileUploadingState.isLoading}
            >
                Upload File
                <input
                    type='file'
                    ref={inputRef}
                    onChange={handleFileSelected}
                    hidden
                />
            </LoadingButton>
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
                {modalFile && <FileSettingsCard fileId={modalFile} />}
            </Dialog>
        </Box>
    );
};

export default Main;
