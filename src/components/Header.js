import { Button } from "antd";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { Breakpoint, BreakpointProvider, setDefaultBreakpoints } from "react-socks";
import { auth } from "../library/firebase/firebase";
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch } from "react-redux";
import { resetStudentsState } from "../redux/students/slice";
import { resetAssignmentsState } from "../redux/assignments/slice";
import { resetStudentAssignmentsState } from "../redux/studentAssignments/slice";

setDefaultBreakpoints([{ xs: 0 }, {m: 1023}, { l: 1024 }, { xl: 1200 }]);

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const pathName = window.location.pathname;
    const logout = async () => {
        dispatch(resetStudentsState());
        dispatch(resetStudentAssignmentsState());
        dispatch(resetAssignmentsState());
        await signOut(auth);
      };

    return(
        <div style={{backgroundColor:  "#FCFCFC"}}>
        <div className="row p-3 justify-content-between align-items-center">
            <h4 className="pl-1 mb-0 col-lg-5 col-10" onClick={() => navigate('/')}> Grove County School District Educator Portal</h4>
            <BreakpointProvider>
                <Breakpoint m down>
                    <MenuIcon className="m-2" onClick={() => setShowMenu(!showMenu)} />
                </Breakpoint>

                <Breakpoint l up className="row justify-content-around align-items-center col-xl-5 col-lg-7">
                    <Link to="/" 
                        style={pathName === '/'? {fontWeight: 'bold', borderBottom: '2px solid green',} : {}}>Class</Link>
                    <Link to="/assignments" 
                        style={pathName === '/assignments'? {fontWeight: 'bold', borderBottom: '2px solid green',} : {}}>Assignments</Link>
                    <Link to="/reports" 
                        style={pathName === '/reports'? {fontWeight: 'bold', borderBottom: '2px solid green',} : {}}>Reports</Link>
                    <Link to="/support" 
                        style={pathName === '/support'? {fontWeight: 'bold', borderBottom: '2px solid green',} : {}}>Support</Link>
                    <Button className="" onClick={logout}> Sign Out </Button>
                </Breakpoint>
            </BreakpointProvider>
            
        </div>
            {showMenu?
            <div className="text-center row justify-content-even align-items-center">
                <Link to="/" className="col-md-4 col-5 mb-3" 
                    style={pathName === '/'? {fontWeight: 'bold', borderBottom: '2px solid green',} : {}}>Class</Link>
                <Link to="assignments" className="col-md-4 col-5 mb-3" 
                style={pathName === '/assignments'? {fontWeight: 'bold', borderBottom: '2px solid green',} : {}}>Assignments</Link>
                <Link to="/reports" className="col-md-4 col-5 mb-3" 
                    style={pathName === '/reports'? {fontWeight: 'bold', borderBottom: '2px solid green',} : {}}>Reports</Link>
                <Link to="/support" className="col-md-4 col-5 mb-3" 
                    style={pathName === '/support'? {fontWeight: 'bold', borderBottom: '2px solid green',} : {}}>Support</Link>
                <div className="col-md-4 col-5 mb-3">
                    <Button onClick={logout}> Sign Out </Button>
                </div>
            </div>
            : ''}
        </div>
    )
}

export default Header;