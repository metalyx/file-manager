import React, { useEffect, useState } from 'react';
import { iFile } from '../models/File';
import {
    Box,
    Container,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Switch,
} from '@mui/material';
import AbcIcon from '@mui/icons-material/Abc';
import StraightenIcon from '@mui/icons-material/Straighten';
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';
import { Axios } from '../helpers/Axios';
import { fileSlice } from '../store/reducers/FileSlice';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { Link } from 'react-router-dom';
import { BASE_FRONTEND_URL } from '../constants';

interface iFileSettingsCard {
    fileId: iFile['_id'];
}

const FileSettingsCard: React.FC<iFileSettingsCard> = ({ fileId }) => {
    const file = useAppSelector((state) =>
        state.fileReducer.userFiles.find((_file) => _file._id === fileId)
    ) as iFile;

    const [isLoading, setIsLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(file.public);

    const dispatch = useAppDispatch();
    const changeFile = fileSlice.actions.changeFile;

    useEffect(() => {}, []);

    const handleCheck = () => {
        const tmp = isChecked;

        setIsChecked(!tmp);
        changeFileAccess(!tmp);
    };

    const changeFileAccess = async (isPublic: boolean) => {
        if (!file) {
            return;
        }

        try {
            setIsLoading(true);

            const { data } = await Axios.put<iFile>(`/files/${file._id}`, {
                public: isPublic,
            });

            dispatch(changeFile(data));
            setIsLoading(false);
        } catch (e) {
            console.error(e);
            setIsLoading(false);
        }
    };

    if (!file) {
        return <></>;
    }

    return (
        <Container maxWidth={'sm'}>
            <Box sx={{ padding: '15px' }}>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <AbcIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={file.originalname}
                            secondary='File Name'
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <StraightenIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={`${file.size} bytes`}
                            secondary='File Size'
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary='You'
                            secondary='Creator of the file'
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <PublicIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                file.public ? (
                                    <span style={{ color: 'red' }}>Public</span>
                                ) : (
                                    <span style={{ color: 'green' }}>
                                        Private
                                    </span>
                                )
                            }
                            secondary='File Access'
                        />
                        <Switch
                            checked={isChecked}
                            onChange={handleCheck}
                            disabled={isLoading}
                        />
                    </ListItem>
                    {file.public === true && (
                        <ListItem>
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Link
                                        to={`/files/${fileId}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        style={{
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        {`${window.location.hostname}/files/${fileId}`}
                                    </Link>
                                }
                                secondary='Direct link to this file'
                            />
                        </ListItem>
                    )}
                </List>
            </Box>
        </Container>
    );
};

export default FileSettingsCard;
