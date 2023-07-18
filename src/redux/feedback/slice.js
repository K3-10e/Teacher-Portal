import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    error:  false,
    errorMessage: "",
    submitted: false,
}

const slice = createSlice({
    name: 'feedback',
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
        sendFeedbackSuccess(state, action) {
            state.isLoading = false;
            state.submitted = true;
        }
    },
});

export const {
    startLoading,
    hasError,
    sendFeedbackSuccess,
} = slice.actions;

export default slice.reducer;