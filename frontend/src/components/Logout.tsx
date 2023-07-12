import { useEffect } from 'react';
import { unsetToken } from '../helpers/unsetToken';
import { unsetTokenAxios } from '../helpers/Axios';
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
        unsetTokenAxios();

        return navigate('/signIn', { replace: true });
    };

    useEffect(() => {
        logoutHandle();
    }, []);

    return <></>;
};

export default Logout;
