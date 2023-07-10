import { useEffect, useState } from 'react';
import CreateAccount from './components/CreateAccount';
import Navbar from './components/Navbar';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import Layout from './components/Layout';
import { checkAuth } from './helpers/checkAuth';
import { CircularProgress } from '@mui/material';
import { userSlice } from './store/reducers/UserSlice';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { setToken } from './helpers/setToken';
import { unsetToken } from './helpers/unsetToken';
import Main from './components/Main';

function App() {
    const [isLoading, setIsLoading] = useState(false);
    const isUserLoggedIn = useAppSelector(
        (state) => state.userReducer.isLoggedIn
    );
    const dispatch = useAppDispatch();
    const { setUser, unsetUser } = userSlice.actions;
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);

        const checkToken = async () => {
            const result = await checkAuth();

            if (!result) {
                setIsLoading(false);
                dispatch(unsetUser());
                unsetToken();
                return navigate('/signIn');
            }

            dispatch(
                setUser({
                    ...result.user,
                    isLoggedIn: true,
                })
            );

            setToken(result.token);
            setIsLoading(false);
            return navigate('/');
        };

        checkToken();
    }, []);

    return (
        <>
            {isLoading && <CircularProgress />}
            {!isLoading && (
                <>
                    <Navbar />
                    <Layout>
                        <Routes>
                            <Route path='/' element={<Main />} />
                            {!isUserLoggedIn && (
                                <>
                                    <Route
                                        path='/createAccount'
                                        element={<CreateAccount />}
                                    />
                                    <Route
                                        path='/signIn'
                                        element={<SignIn />}
                                    />
                                </>
                            )}

                            <Route path='/*' />
                        </Routes>
                    </Layout>
                </>
            )}
        </>
    );
}

export default App;
