import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    error:  false,
    errorMessage: "",
    students: [],
    student: {},
    update: false,
}

const slice = createSlice({
    name: 'students',
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
        fetchAllStudentsSuccess(state, action) {
            state.isLoading = false;
            state.students = action.payload;
        },
        fetchStudentSuccess(state, action) {
            state.isLoading = false;
            state.student = action.payload;
        },
        fetchUpdateSuccess(state, action) {
            state.isLoading = false;
            state.update = action.payload;
        },
        resetUpdate(state, action) {
            state.update = false;
        },

        resetStudents(state, action) {
            state.students = [];
        },
        resetStudentsState(state, action) {
            state.isLoading = false;
            state.error = false;
            state.errorMessage = "";
            state.students = [];
            state.student = {};
            state.update = false;
        },
    },
});

export const {
    startLoading,
    hasError,
    fetchAllStudentsSuccess,
    fetchStudentSuccess,
    fetchUpdateSuccess,
    resetUpdate,
    resetStudentsState,
    resetStudents,
} = slice.actions;

export default slice.reducer;