import React from 'react';
import { unsetToken } from '../helpers/unsetToken';
import { useAppDispatch } from '../hooks/redux';
import { userSlice } from '../store/reducers/UserSlice';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const dispatch = useAppDispatch();
    const { unsetUser } = userSlice.actions;
    const navigate = useNavigate();

    const logoutHandle = () => {
        dispatch(unsetUser());
        unsetToken();

        return navigate('/signIn');
    };

    logoutHandle();

    return <></>;
};

export default Logout;
