import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { iFile } from '../../models/File';

interface FileState {
    userFiles: iFile[];
}

const initialState: FileState = {
    userFiles: [],
};

export const fileSlice = createSlice({
    name: 'file',
    initialState,
    reducers: {
        addFile: (state, action: PayloadAction<iFile>) => {
            state.userFiles.push(action.payload);
        },
        setFiles: (state, action: PayloadAction<iFile[]>) => {
            state.userFiles = action.payload;
        },
        deleteFile: (state, action: PayloadAction<iFile['_id']>) => {
            state.userFiles = state.userFiles.filter(
                (file) => file._id !== action.payload
            );
        },
        changeFile: (state, action: PayloadAction<iFile>) => {
            state.userFiles = state.userFiles.map((file) => {
                if (file._id === action.payload._id) {
                    return action.payload;
                }
                return file;
            });
        },
    },
});

export default fileSlice.reducer;
