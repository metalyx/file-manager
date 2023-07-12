import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import { downloadFiles } from '../helpers/downloadFile';
import React from 'react';
import { iFile } from '../models/File';

const DirectFileCard: React.FC<{ file: iFile }> = ({ file }) => {
    return (
        <ListItem key={file._id}>
            <ListItemIcon>
                <InsertDriveFileIcon />
            </ListItemIcon>
            <ListItemText
                primary={file.originalname}
                secondary={`${file.size} bytes`}
            />
            <ListItemIcon>
                <button
                    onClick={() => {
                        if (downloadFiles) downloadFiles(file);
                    }}
                >
                    <DownloadIcon />
                </button>
            </ListItemIcon>
        </ListItem>
    );
};

export default DirectFileCard;
