import {
    Alert,
    Box,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import { downloadFiles } from '../helpers/downloadFile';
import React, { useState } from 'react';
import { iFile } from '../models/File';

const DirectFileCard: React.FC<{ file: iFile }> = ({ file }) => {
    const [networkState, setNetworkState] = useState({
        isLoading: false,
        error: '',
    });

    const downloadHandle = async () => {
        setNetworkState({
            isLoading: true,
            error: '',
        });
        const errorString = await downloadFiles(file);
        setNetworkState({
            isLoading: false,
            error: errorString,
        });
    };

    return (
        <Box>
            {networkState.error.length > 0 && (
                <Alert severity='error'>{networkState.error}</Alert>
            )}
            <ListItem key={file._id}>
                <ListItemIcon>
                    <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText
                    primary={file.originalname}
                    secondary={`${file.size} bytes`}
                />
                <ListItemIcon>
                    <button onClick={downloadHandle}>
                        <DownloadIcon />
                    </button>
                </ListItemIcon>
            </ListItem>
        </Box>
    );
};

export default DirectFileCard;
