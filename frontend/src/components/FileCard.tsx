import { ListItem, ListItemIcon, ListItemText } from '@mui/material';

import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import React from 'react';
import { iFile } from '../models/File';
import { downloadFiles } from '../helpers/downloadFile';

const FileCard: React.FC<{
    file: iFile;
    deleteFile: (fileId: iFile['_id']) => void;
}> = ({ file, deleteFile }) => {
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
                <button onClick={() => downloadFiles(file)}>
                    <DownloadIcon />
                </button>
            </ListItemIcon>

            <ListItemIcon>
                <button onClick={() => deleteFile(file._id)}>
                    <DeleteForeverIcon />
                </button>
            </ListItemIcon>
        </ListItem>
    );
};

export default FileCard;
