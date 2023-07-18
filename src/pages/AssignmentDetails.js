import { Paper, Box, Fade, Popper, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAssignmentById } from "../redux/assignments/actions";
import { getStudentAssignmentsByAssignment, updateStudentAssignment } from "../redux/studentAssignments/actions";
import { getStudentsByTeacherId } from "../redux/students/actions";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button } from "antd";
import { Navigate, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { resetUpdate } from "../redux/studentAssignments/slice";
import HelpIcon from '@mui/icons-material/Help';
import { getTeacherById } from "../redux/teacher/actions";

const AssignmentDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { assignment } = useSelector(({ assignments }) => assignments);
    const { students } = useSelector(({ students }) => students);
    const { detailsPageAssignments, update, isLoading } = useSelector(({ studentAssignments }) => studentAssignments);
    const { teacherUserInfo } = useSelector(({ teacher }) => teacher);

    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isEdited, setIsEdited] = useState(false);

    const id = window.location.pathname.slice(19);

    const columns = [
        { field: 'id',
        },
        {
          field: 'student_id',
          headerName: 'Student ID',
          flex: 1,
          minWidth: 60,
          editable: false,
        },
        {
            field: 'student_name',
            headerName: 'Student Name',
            flex: 1,
            minWidth: 60,
            editable: false,
        },
        {
            field: 'earned_points',
            headerName: 'Points Earned',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            minWidth: 60,
            editable: true,
            preProcessEditCellProps: (params) => {
                var hasError = false;
                if(parseInt(params.props.value) > assignment.total_points || parseInt(params.props.value) < 0){
                        hasError = true;
                        toast.error("Value cannot be more than the Total Points value.", {
                            duration: 3000,
                        });
                }
                
                return { ...params.props, error: hasError };
              },
        },
    ];

    useEffect(() => {
        if(update){
            toast.success("Grades Successfully Edited!", {
                duration: 3000,
            });
           dispatch(resetUpdate());
        }
    },[update]);

    useEffect(() => {
        dispatch(getAssignmentById(id));
        dispatch(getStudentAssignmentsByAssignment(id));
    },[dispatch]);

    useEffect(() => {
        if(teacherUserInfo !== null && Object.keys(teacherUserInfo).length !== 0)
            dispatch(getStudentsByTeacherId(teacherUserInfo.uid));
        if(!Object.hasOwn(teacherUserInfo, 'first_name')){
            dispatch(getTeacherById(teacherUserInfo.uid));
        }
    }, [dispatch, teacherUserInfo]);
    

     if(students.length > 0 && detailsPageAssignments.length > 0 && rows.length === 0){
        if(detailsPageAssignments[0].assignment_id === id){
            detailsPageAssignments?.forEach((element) => {
                const student = students?.filter((student) => student.id === element.student_id);
                if(students.length !== 0){
                    const name = student[0].first_name + ' ' + student[0].last_name;
                    const newValues = {
                        ...element,
                        student_name: name,
                    }
                    setRows(currentRows => [...currentRows, newValues])
                }
            })
        }}

    const handleCellEdit = (params) => {
        var editedRow = rows.filter((row) => row.id === params.id);
        if(params.value === '')
            editedRow[0].earned_points = null;
        else
            editedRow[0].earned_points = params.value;
        setIsEdited(true);
    }

    const handlePopClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((previousOpen) => !previousOpen);
      };

    return (
        <div className="container-fluid d-flex justify-content-center" style={{minHeight: '90vh'}}>
            <Toaster />
            <Paper className="m-4 col-11" style={{backgroundColor: "#FCFCFC",}}>
                <div className="row m-lg-1 p-1 justify-content-md-between justify-content-center align-items-center">
                    <div>
                        <h1 className="text-md-left text-center" style={{fontSize: '1.8rem'}}>Assignment Name: {assignment.name} <HelpIcon fontSize="small" style={{color:'#1890ff', cursor: 'pointer'}} onClick={handlePopClick} /></h1>
                        <Popper id={1} open={open} anchorEl={anchorEl} transition>
                            {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={350}>
                                <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
                                    Click a cell in the <span style={{color: 'red'}}>Points Earned</span> column to edit it.
                                    <div>Leaving a cell blank indicates a missing assignment.</div>
                                </Box>
                            </Fade>
                            )}
                        </Popper>
                        <h5 className="text-md-left text-center">Type: {assignment.type}</h5>
                        <h5 className="text-md-left text-center">Unit: {assignment.unit}</h5>
                    </div>
                    <div className="text-center p-2 mb-sm-auto mb-2 mr-xl-5 col-xl-1 col-lg-2 col-sm-4 col-11" style={{backgroundColor: '#e6c59e', borderRadius: '13px'}}>
                        <h5>Total Points:</h5>
                        <h5 style={{fontWeight: 'bold'}}>{assignment.total_points}</h5>
                    </div>
                </div>
                <>
                    <div className="container">
                        <h3>Grading Table</h3>
                        <DataGrid
                        columns={columns}
                        rows={rows}
                        columnVisibilityModel={{
                            id: false,
                            }}
                        className=""
                        initialState={{
                            sorting: {
                            sortModel: [{ field: 'student_name', sort: 'asc' }],
                            },
                        }}
                        onCellEditCommit={handleCellEdit}
                        components={{ Toolbar: GridToolbar }}
                        style={{height: '60vh'}}
                        sx={{
                            '& .MuiTablePagination-selectLabel' : {
                                marginTop: 'auto',
                                marginBottom: 'auto',
                            },
                            '& .MuiTablePagination-displayedRows' : {
                                marginTop: 'auto',
                                marginBottom: 'auto',
                            },
                            
                        }}/>
                    </div>
                    {isEdited?
                    <div className=" m-2 py-3 row" style={{justifyContent: 'space-evenly'}}>
                        <Button 
                        type="primary"
                        className="col-xl-2 col-sm-3 col-10 mb-sm-auto mb-2 p-1"
                        onClick={() => {
                            setIsEdited(false);
                            navigate('/assignments');
                        }}
                        >Cancel</Button>
                        <Button 
                        type="primary" 
                        className="col-xl-2 col-sm-3 col-10 mb-sm-auto mb-2 p-1"
                        onClick={() => {
                            dispatch(updateStudentAssignment(rows))
                            setIsEdited(false);
                        }}
                        >Save Changes</Button>
                    </div> 
                    : ''}
                </>
            </Paper>
        </div>
    )
}

export default AssignmentDetails;