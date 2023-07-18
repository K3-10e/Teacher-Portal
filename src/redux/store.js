import { configureStore } from '@reduxjs/toolkit';
import studentSlice from './students/slice';
import teacherSlice from './teacher/slice';
import assignmentSlice from './assignments/slice';
import studentAssignmentSlice from './studentAssignments/slice';
import feedbackSlice from './feedback/slice';

const store = configureStore({
    reducer: {
        students: studentSlice,
        teacher: teacherSlice,
        assignments: assignmentSlice,
        studentAssignments: studentAssignmentSlice,
        feedback: feedbackSlice,
    },
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store;