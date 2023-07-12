import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    TextField,
    Typography,
} from '@mui/material';
import { BASE_URL } from '../constants';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { setToken } from '../helpers/setToken';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { userSlice } from '../store/reducers/UserSlice';
import { setTokenAxios } from '../helpers/Axios';

const SignIn = () => {
    const navigate = useNavigate();

    const isUserLoggedIn = useAppSelector(
        (state) => state.userReducer.isLoggedIn
    );
    const dispatch = useAppDispatch();
    const setUser = userSlice.actions.setUser;

    useEffect(() => {
        if (isUserLoggedIn) {
            return navigate('/');
        }
    }, [isUserLoggedIn]);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [validationErrors, setValidationErrors] = useState({
        email: '',
        password: '',
        network: '',
    });

    const [networkState, setNetworkState] = useState({
        success: false,
        loading: false,
    });

    const checkEmail = (value: string) => {
        let counterErrors = 0;

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ||
            value.trim() === ''
        ) {
            setValidationErrors({
                ...validationErrors,
                email: 'Invalid email',
            });
            counterErrors += 1;
        } else {
            setValidationErrors({
                ...validationErrors,
                email: '',
            });
        }
        return counterErrors;
    };

    const checkPassword = (value: string) => {
        let counterErrors = 0;
        if (value.trim().length < 4 || value.trim().length > 11) {
            setValidationErrors({
                ...validationErrors,
                password:
                    'Password must be more than 3 and shorter than 12 characters',
            });
            counterErrors += 1;
        } else {
            setValidationErrors({
                ...validationErrors,
                password: '',
            });
        }
        return counterErrors;
    };

    const submitHandle = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (
            checkEmail(formData.email) === 0 &&
            checkPassword(formData.password) === 0
        ) {
            try {
                setNetworkState({
                    loading: true,
                    success: false,
                });
                const { data } = await axios.post(`${BASE_URL}/auth/login`, {
                    email: formData.email,
                    password: formData.password,
                });

                setNetworkState({
                    loading: false,
                    success: true,
                });

                const { user, token } = data;

                setToken(token);
                setTokenAxios(token);

                dispatch(
                    setUser({
                        ...user,
                        isLoggedIn: true,
                    })
                );
                console.log('here');

                return navigate('/');
            } catch (e: any) {
                setNetworkState({
                    loading: false,
                    success: false,
                });

                setValidationErrors({
                    ...validationErrors,
                    network: e.response.data.message,
                });
            }
        }
    };

    const handleChangeFormData = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    return (
        <>
            <Typography variant='h4' component='h2' sx={{ my: 2 }}>
                Login
            </Typography>
            <Box
                component='form'
                autoComplete='off'
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
                onSubmit={submitHandle}
            >
                <FormControl
                    error={validationErrors.email.length > 0}
                    variant='standard'
                    sx={{ mb: 2 }}
                >
                    <TextField
                        id='email'
                        label='Email'
                        variant='outlined'
                        onBlur={(e) => checkEmail(e.target.value)}
                        onChange={handleChangeFormData}
                        required
                    />
                    <FormHelperText sx={{ mt: 1 }}>
                        {validationErrors.email}
                    </FormHelperText>
                </FormControl>
                <FormControl
                    error={validationErrors.password.length > 0}
                    variant='standard'
                    sx={{ mb: 2 }}
                >
                    <TextField
                        id='password'
                        label='Password'
                        variant='outlined'
                        type='password'
                        onBlur={(e) => checkPassword(e.target.value)}
                        onChange={handleChangeFormData}
                        required
                    />
                    <FormHelperText sx={{ mt: 1 }}>
                        {validationErrors.password}
                    </FormHelperText>
                </FormControl>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl
                        variant='standard'
                        error={validationErrors.network.length > 0}
                    >
                        <FormHelperText sx={{ m: 0 }}>
                            {validationErrors.network}
                        </FormHelperText>
                        <LoadingButton
                            variant='contained'
                            type='submit'
                            loading={networkState.loading}
                            disabled={networkState.success}
                        >
                            Sign In
                        </LoadingButton>
                    </FormControl>

                    <Button
                        variant='outlined'
                        type='button'
                        onClick={() => navigate('/createAccount')}
                    >
                        Don't have an account?
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default SignIn;
