import { ListItem, ListItemIcon, ListItemText } from '@mui/material';

import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ShareIcon from '@mui/icons-material/Share';
import React from 'react';
import { iFile } from '../models/File';
import { downloadFiles } from '../helpers/downloadFile';

interface iFileCard {
    file: iFile;
    deleteFile?: (fileId: iFile['_id']) => void;
    openPermissionsPopup?: (fileId: iFile['_id']) => void;
}

const FileCard: React.FC<iFileCard> = ({
    file,
    deleteFile,
    openPermissionsPopup,
}) => {
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
                        if (openPermissionsPopup)
                            openPermissionsPopup(file._id);
                    }}
                >
                    <ShareIcon />
                </button>
            </ListItemIcon>

            <ListItemIcon>
                <button
                    onClick={() => {
                        if (downloadFiles) downloadFiles(file);
                    }}
                >
                    <DownloadIcon />
                </button>
            </ListItemIcon>

            <ListItemIcon>
                <button
                    onClick={() => {
                        if (deleteFile) deleteFile(file._id);
                    }}
                >
                    <DeleteForeverIcon />
                </button>
            </ListItemIcon>
        </ListItem>
    );
};

export default FileCard;
