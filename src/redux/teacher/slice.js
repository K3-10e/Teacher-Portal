import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    error:  false,
    errorMessage: "",
    teacherUserInfo: {},
}

const slice = createSlice({
    name: 'teacher',
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },

        hasError(state, action) {
            state.isLoading = false;
            state.error = true;
            state.errorMessage = action.payload;
        },

        fetchUserSuccess(state, action) {
            state.isLoading = false;
            state.teacherUserInfo = action.payload;
        },

        fetchTeacherSuccess(state, action) {
            state.isLoading = false;
            state.teacherUserInfo = {...state.teacherUserInfo, ...action.payload};
        },
        
    },
});

export const {
    startLoading,
    hasError,
    fetchUserSuccess,
    fetchTeacherSuccess,
} = slice.actions;

export default slice.reducer;