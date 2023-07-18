import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    error:  false,
    errorMessage: "",
    assignments: [],
    assignment: {},
    totalPoints: 0,
    missingAssignments: 0,
    action: false,
    noAssignments: false,
}

const slice = createSlice({
    name: 'assignments',
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
            state.assignments = action.payload.assignments;
            state.totalPoints = action.payload.totalPoints;
            state.noAssignments = action.payload.totalPoints === 0? true : false;
            state.missingAssignments = action.payload.missingAssignments;
        },
        fetchAssignmentSuccess(state, action) {
            state.isLoading = false;
            state.assignment = action.payload;
        },

        fetchActionSuccess(state, action) {
            state.isLoading = false;
            state.action = true;
        },

        resetAssignmentsState(state, action) {
            state.isLoading = false;
            state.error = false;
            state.errorMessage = "";
            state.assignments = [];
            state.assignment = {};
            state.totalPoints = 0;
            state.missingAssignments = 0;
            state.action = false
            state.noAssignments = false;
        },
    },
});

export const {
    startLoading,
    hasError,
    fetchAllAssignmentsSuccess,
    fetchAssignmentSuccess,
    fetchActionSuccess,
    resetAssignmentsState
} = slice.actions;

export default slice.reducer;