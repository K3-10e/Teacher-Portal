import { Paper, Box, Popper, Fade, CircularProgress } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getStudentsByTeacherId, updateStudents } from "../redux/students/actions";
import HelpIcon from '@mui/icons-material/Help';
import { getTeacherById } from "../redux/teacher/actions";
import { getStudentAssignments } from "../redux/studentAssignments/actions";
import { getAssignmentsByTeacherId } from "../redux/assignments/actions";
import { resetDetailsStudentAssignments } from "../redux/studentAssignments/slice";
import { resetUpdate, startLoading } from "../redux/students/slice";
import { Button } from "antd";
import toast, { Toaster } from "react-hot-toast";


function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
}

const Class = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { students, isLoading, update } = useSelector(({ students }) => students);
    const { teacherUserInfo } = useSelector(({ teacher }) => teacher);
    const { studentAssignments } = useSelector(({ studentAssignments }) => studentAssignments);
    const { totalPoints, noAssignments } = useSelector(({ assignments }) => assignments);

    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [rows, setRows] = useState([]);
    const [isEdited, setIsEdited] = useState(false);

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    const columns = [
        { field: 'id',
          headerName: 'Student ID',
          flex: 1,
          minWidth: 60,
          editable: false,
        },
        {
          field: 'name',
          headerName: 'Name',
          flex: 1,
          minWidth: 60,
          editable: false,
        },
        {
            field: 'absentToday',
            headerName: 'Absent Today?',
            type: 'boolean',
            flex: 1,
            minWidth: 60,
            editable: true,
        },
        {
            field: 'absences',
            headerName: 'Total Absences',
            flex: 1,
            minWidth: 60,
            editable: false,
            valueGetter: (params) => {
                return params.value.length
            }
        },
        {
            field: 'citizenship',
            headerName: 'Citizenship',
            type: 'singleSelect',
            valueOptions: ['O', 'S', 'U'],
            flex: 1,
            minWidth: 60,
            editable: true,
          },
          {
            field: 'missingAssignments',
            headerName: 'Missing Assignments',
            flex: 1,
            minWidth: 60,
            editable: false,
          },
          {
            field: 'overallGrade',
            headerName: 'Overall Grade',
            flex: 1,
            minWidth: 60,
            editable: false,
            renderCell: (params) => {
                return (
                    <span>
                        {params.row.overallGrade}%
                    </span>
                )
              }
          },
    ];

    useEffect(() => {
        if(teacherUserInfo !== null && Object.keys(teacherUserInfo).length !== 0){
            dispatch(getStudentsByTeacherId(teacherUserInfo.uid));
            dispatch(getAssignmentsByTeacherId(teacherUserInfo.uid));
        }
        if(!Object.hasOwn(teacherUserInfo, 'first_name')){
            dispatch(getTeacherById(teacherUserInfo.uid));
        }
    }, [dispatch, teacherUserInfo]);

    useEffect(() => {
        dispatch(getStudentAssignments());
        dispatch(resetDetailsStudentAssignments());
    }, [dispatch]);

    useEffect(() => {
        if(update){
            toast.success("Student Successfully Edited!", {
                duration: 3000,
            });
            dispatch(getStudentsByTeacherId(teacherUserInfo.uid));
            dispatch(resetUpdate());
        }
    },[update]);

    if(students.length > 0 && 
        rows.length === 0 && 
        studentAssignments.length > 0 && 
        (totalPoints !== 0  || noAssignments)){
            for(const student of students){
                const personAssignments = studentAssignments?.filter(assignment => assignment.student_id === student.id);
                let studentsMissingAssignments = 0;
                let studentTotalEarned = 0;
                    for(const assignment of personAssignments){
                        if(assignment.earned_points === null)
                            studentsMissingAssignments++;
                        else{
                            studentTotalEarned += assignment.earned_points;
                        }
                    }
                
                //finds if the student is absent today
                var index = -1;
                student.absences.forEach((date, counter) => {
                    if(date.getTime() === today.getTime()) {
                        index = counter;
                    }
                })
                
                const newValues = {
                    id: student.id,
                    name: student.first_name + ' ' + student.last_name,
                    absences: student.absences,
                    citizenship: student.citizenship,
                    missingAssignments: studentsMissingAssignments,
                    overallGrade: noAssignments? 0 : ((studentTotalEarned / totalPoints) * 100).toPrecision(4),
                    teacher_id: student.teacher_id,
                    absentToday: index === -1? false : true,
                }
                setRows(currentRows => [...currentRows, newValues]);
                }
        }
    
    const handleCellDoubleClick = (params) => {
        // console.log(params.row);
        if(params.field !== 'citizenship' && params.field !== 'absentToday'){
            const navigationLink = `/studentDetails/${params.row.id}`;
            navigate(navigationLink);
        }
    };

    const handlePopClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((previousOpen) => !previousOpen);
      };

    const handleCellEdit = (params) => {
        var editedRow = rows.filter((row) => row.id === params.id);
        if(params.field === 'citizenship')
            editedRow[0].citizenship = params.value;
        if(params.field === 'absentToday'){
            editedRow[0].absentToday = params.value;
        }
            console.log(params.value);
        setIsEdited(true);
    }

    return (
        <div className="container-fluid d-flex justify-content-center" style={{minHeight: '90vh'}}>
            <Toaster />
            <Paper className="m-4 col-11" style={{backgroundColor: "#FCFCFC",}}>
                <h1 className="mt-3" style={{fontSize: '1.8rem'}}>{teacherUserInfo.first_name} {teacherUserInfo.last_name}'s Class <HelpIcon fontSize="small" style={{color:'#1890ff', cursor: 'pointer'}} onClick={handlePopClick} />
                    <Popper id={1} open={open} anchorEl={anchorEl} transition>
                        {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                            <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
                                <p>Double click a row to see student details.</p>
                                <p>Double click on the <span style={{color: 'red'}}>Absent Today?</span> cell to edit a student's current absence.</p>
                                <p>Double click on the <span style={{color: 'red'}}>Citizenship</span> cell to edit a student's citizenship</p>
                                <p>A focused editing cell's data <span style={{color: 'red'}}>will not be saved</span>.</p>
                            </Box>
                        </Fade>
                        )}
                    </Popper>
                </h1>
                {isLoading?
                <div style={{left: '50%', top: '43%', position: 'absolute'}}>
                    <CircularProgress />
                </div>:
                <>
                <DataGrid
                columns={columns}
                rows={rows}
                className=""
                components={{ Toolbar: GridToolbar }}
                onCellDoubleClick={handleCellDoubleClick}
                onCellEditCommit={handleCellEdit}
                style={{height: '70vh'}}
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
                {isEdited?
                    <div className=" m-2 py-3 row" style={{justifyContent: 'space-evenly'}}>
                        <Button 
                        type="primary"
                        className="col-xl-2 col-sm-3 col-10 mb-sm-auto mb-2 p-1"
                        onClick={() => {
                            dispatch(startLoading());
                            window.location.reload();
                        }}
                        >Cancel</Button>
                        <Button 
                        type="primary" 
                        className="col-xl-2 col-sm-3 col-10 mb-sm-auto mb-2 p-1"
                        onClick={() => {
                            dispatch(updateStudents(rows));
                            setIsEdited(false);}
                        }
                        >Save Changes</Button>
                    </div> 
                    : ''}
                    </>}
            </Paper>
        </div>
    )
}

export default Class;