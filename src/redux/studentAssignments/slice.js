import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    error:  false,
    errorMessage: "",
    studentAssignments: [],
    studentAssignment: {},
    detailsPageAssignments: [],
    detailsEarnedPoints: null,
    earnedPoints: null,
    update: false,
}

const slice = createSlice({
    name: 'studentAssignments',
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
        fetchAllAssignmentsSuccess(state, action) {
            state.isLoading = false;
            state.studentAssignments = action.payload.assignments;
            state.earnedPoints = action.payload.earnedPoints;
        },
        fetchDetailsPageAssignmentsSuccess(state, action) {
            state.isLoading = false;
            state.detailsPageAssignments = action.payload.assignments;
            state.detailsEarnedPoints = action.payload.detailsEarnedPoints;
        },

        fetchUpdateSuccess(state, action) {
            state.isLoading = false;
            state.update = action.payload;
        },

        resetUpdate(state, action) {
            state.update = false;
        },
        resetStudentAssignments(state, action) {
            state.studentAssignments = [];
        },
        resetDetailsStudentAssignments(state, action) {
            state.detailsPageAssignments = [];
        },
        
        resetStudentAssignmentsState(state, action) {
            state.isLoading = false;
            state.error = false;
            state.errorMessage = "";
            state.studentAssignments = [];
            state.studentAssignment = {};
            state.detailsPageAssignments = [];
            state.detailsEarnedPoints = null;
            state.earnedPoints = null;
            state.update = false;
        },
    },
});

export const {
    startLoading,
    hasError,
    fetchAllAssignmentsSuccess,
    fetchDetailsPageAssignmentsSuccess,
    fetchAssignmentSuccess,
    fetchUpdateSuccess,
    resetUpdate,
    resetStudentAssignments,
    resetDetailsStudentAssignments,
    resetStudentAssignmentsState,
} = slice.actions;

export default slice.reducer;