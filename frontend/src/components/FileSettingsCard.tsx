import React from 'react';
import { iFile } from '../models/File';
import {
    Box,
    Container,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import AbcIcon from '@mui/icons-material/Abc';
import StraightenIcon from '@mui/icons-material/Straighten';
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';

interface iFileSettingsCard {
    file?: iFile;
}

const FileSettingsCard: React.FC<iFileSettingsCard> = ({ file }) => {
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
                            primary='Only you'
                            secondary='Who can access this file'
                        />
                    </ListItem>
                </List>
            </Box>
        </Container>
    );
};

export default FileSettingsCard;
