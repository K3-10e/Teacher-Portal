import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { auth } from "./library/firebase/firebase";
import Class from './pages/Class';
import Login from './pages/Login';
import Assignments from './pages/Assignments';
import AssignmentDetails from './pages/AssignmentDetails';
import Reports from './pages/Reports';
import Support from './pages/Support';
import { fetchUserSuccess } from "./redux/teacher/slice";
import { useState } from "react";
import StudentDetails from "./pages/StudentDetails";

const App = () => {
    const dispatch = useDispatch();
    const [userExists, setUserExists] = useState(null);

    onAuthStateChanged(auth, (currentUser) => {
        if(currentUser) {
            setUserExists(true);
        }
        else{
            setUserExists(false);
        }
        dispatch(fetchUserSuccess(currentUser));
    });

    return (
        <div style={{overflowX: 'hidden'}}>
        <div style={{minHeight: '100vh', background: 'repeating-linear-gradient(#4B792B, #084758)'}}>
            {userExists? <Header /> : ''}
            <Routes>
                <Route element={ <Login userExists={userExists} /> } path="/login" />
                {userExists === true || userExists === null? 
                <> 
                    <Route element={ 
                            <Class />}
                    path="/" />
                    <Route element={ 
                            <StudentDetails />}
                    path="/studentDetails/:id" />

                    <Route element={ 
                            <Assignments />}
                    path="/assignments" /> 
                    <Route element={ 
                            <AssignmentDetails />}
                    path="/assignmentDetails/:id" />

                    <Route element={ 
                            <Reports />}
                    path="/reports" />

                    <Route element={ 
                            <Support />}
                    path="/support" />

                    <Route path="*" element={<Navigate to="/" />} />
                </>
                : <Route path="*" element={<Navigate to="/login" />} />}
                
            </Routes>
        </div>
        </div>
    )
}

export default App;