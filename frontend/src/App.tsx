import { useEffect, useState } from 'react';
import CreateAccount from './components/CreateAccount';
import Navbar from './components/Navbar';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import Layout from './components/Layout';
import { checkAuth } from './helpers/checkAuth';
import { CircularProgress } from '@mui/material';
import { userSlice } from './store/reducers/UserSlice';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { setToken } from './helpers/setToken';
import { unsetToken } from './helpers/unsetToken';
import Main from './components/Main';
import DirectFile from './components/DirectFile';
import NotFound from './components/NotFound';
import Logout from './components/Logout';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();
    const userIsLoggedIn = useAppSelector(
        (state) => state.userReducer.isLoggedIn
    );
    const { setUser, unsetUser } = userSlice.actions;

    useEffect(() => {
        setIsLoading(true);

        const checkToken = async () => {
            const result = await checkAuth();

            if (!result) {
                setIsLoading(false);
                dispatch(unsetUser());
                unsetToken();
                // return navigate('/signIn');
                return;
            }

            dispatch(
                setUser({
                    ...result.user,
                    isLoggedIn: true,
                })
            );

            setToken(result.token);
            setIsLoading(false);
        };

        checkToken();
    }, []);

    return (
        <>
            {isLoading && <CircularProgress />}
            {!isLoading && userIsLoggedIn && (
                <>
                    <Navbar />
                    <Layout>
                        <Routes>
                            <Route path='/' element={<Main />} />
                            <Route path='/signIn' element={<SignIn />} />
                            <Route
                                path='/createAccount'
                                element={<CreateAccount />}
                            />
                            <Route
                                path='/files/:fileId'
                                element={<DirectFile />}
                            />
                            <Route path='/logout' element={<Logout />} />
                            <Route
                                path='*'
                                element={<Navigate to='/' replace />}
                            />
                        </Routes>
                    </Layout>
                </>
            )}
            {!isLoading && !userIsLoggedIn && (
                <>
                    <Navbar />
                    <Layout>
                        <Routes>
                            <Route index path='/signIn' element={<SignIn />} />
                            <Route
                                path='/createAccount'
                                element={<CreateAccount />}
                            />

                            <Route
                                path='/files/:fileId'
                                element={<DirectFile />}
                            />
                            <Route
                                path='*'
                                element={<Navigate to='/signIn' replace />}
                            />
                        </Routes>
                    </Layout>
                </>
            )}
        </>
    );
}

export default App;
