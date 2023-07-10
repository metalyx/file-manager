import { Container } from '@mui/material';
import React from 'react';

interface iLayout {
    children?: React.ReactNode;
}

const Layout: React.FC<iLayout> = ({ children }) => {
    return <Container maxWidth='sm'>{children}</Container>;
};

export default Layout;
