import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface UserState {
    email: string;
    diskSpace: number;
    id: string;
    usedSpace: number;
    isLoggedIn: boolean;
}

const initialState: UserState = {
    email: '',
    id: '',
    diskSpace: 0,
    usedSpace: 0,
    isLoggedIn: false,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            state.diskSpace = action.payload.diskSpace;
            state.id = action.payload.id;
            state.usedSpace = action.payload.usedSpace;
            state.email = action.payload.email;
            state.isLoggedIn = action.payload.isLoggedIn;
        },
        unsetUser: (state) => {
            state.diskSpace = 0;
            state.email = '';
            (state.id = ''), (state.usedSpace = 0);
            state.isLoggedIn = false;
        },
    },
});

export default userSlice.reducer;
