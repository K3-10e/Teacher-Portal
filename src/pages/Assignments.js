import { Paper, Box, Popper, Fade, CircularProgress } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAssignmentsByTeacherId } from "../redux/assignments/actions";
import toast, { Toaster } from "react-hot-toast";
import HelpIcon from '@mui/icons-material/Help';
import AssignmentModal from "./modals/AssignmentModal";
import AreYouSureModal from "./modals/AreYouSure";
import { resetStudentAssignments } from "../redux/studentAssignments/slice";

const Assignments = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { assignments, totalPoints, isLoading } = useSelector(({ assignments }) => assignments);
    const { teacherUserInfo } = useSelector(({ teacher }) => teacher);
    
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [assignmentId, setAssignmentId] = useState(null);
    const [type, setType] = useState('');
    const [showAreYouSure, setShowAreYouSure] = useState(false);
    const [rowSelected, setRowSelected] = useState(false);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const columns = [
        { field: 'id',
        },
        {
          field: 'name',
          headerName: 'Name',
          flex: 1,
          minWidth: 60,
          editable: false,
        },
        {
            field: 'total_points',
            headerName: 'Total Points',
            flex: 1,
            minWidth: 60,
            editable: false,
        },
        {
            field: 'type',
            headerName: 'Type',
            flex: 1,
            minWidth: 60,
            editable: false,
        },
        {
            field: 'unit',
            headerName: 'Unit',
            flex: 1,
            minWidth: 60,
            editable: false,
        },
        {
            field: 'classGrade',
            headerName: 'Class Average',
            flex: 1,
            minWidth: 60,
            editable: false,
            renderCell: (params) => {
                return (
                    <span>
                        {params.row.classGrade}%
                    </span>
                )
              }
        },
    ];

    useEffect(() => {
        if(teacherUserInfo !== null && Object.keys(teacherUserInfo).length !== 0)
            dispatch(getAssignmentsByTeacherId(teacherUserInfo.uid));
    }, [dispatch, teacherUserInfo]);

    useEffect(() => {
        dispatch(resetStudentAssignments());
    }, [dispatch]);
    
    const handleRowDoubleClick = (params) => {
        // console.log(params.row);
        const navigationLink = `/assignmentDetails/${params.row.id}`;
        navigate(navigationLink);
    };

    const handlePopClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((previousOpen) => !previousOpen);
      };

    return (
        <div className="container-fluid d-flex justify-content-center" style={{minHeight: '90vh'}}>
            <Toaster />
            <AssignmentModal
            showAssignmentModal={showAssignmentModal}
            setShowAssignmentModal={setShowAssignmentModal}
            assignmentId={assignmentId}
            type={type}
            />
            <AreYouSureModal 
            showAreYouSure={showAreYouSure}
            setShowAreYouSure={setShowAreYouSure}
            assignmentId={assignmentId}
            setAssignmentId={setAssignmentId}
            setRowSelected={setRowSelected}
            />
            <Paper className="m-4 col-11" style={{backgroundColor: "#FCFCFC",}}>
                <div className="row m-3 justify-content-md-between justify-content-center align-items-center">
                    <h1 className="" style={{fontSize: '1.8rem'}}>Assignments <HelpIcon fontSize="small" style={{color:'#1890ff', cursor: 'pointer'}} onClick={handlePopClick} />
                    <Popper id={1} open={open} anchorEl={anchorEl} transition>
                        {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                            <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
                                Double click a row to see assignment details.
                            </Box>
                        </Fade>
                        )}
                    </Popper>
                    </h1>
                    <div className="text-center p-2 mb-sm-auto mb-2 mr-xl-5 col-xl-1 col-lg-2 col-sm-4 col-11" style={{backgroundColor: '#e6c59e', borderRadius: '13px'}}>
                        <h5>Total Points:</h5>
                        <h5 style={{fontWeight: 'bold'}}>{totalPoints}</h5>
                    </div>
                </div>
                {isLoading && !showAreYouSure && !showAssignmentModal?
                <div style={{left: '50%', top: '43%', position: 'absolute'}}>
                    <CircularProgress />
                </div>:
                <>
                <DataGrid
                columns={columns}
                rows={assignments}
                columnVisibilityModel={{
                    id: false,
                    }}
                className=""
                components={{ Toolbar: GridToolbar }}
                onRowDoubleClick={handleRowDoubleClick}
                onRowClick={(params) =>{
                    setRowSelected(true);
                    setAssignmentId(params.row.id)
                }}
                style={{height: '65vh'}}
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
                <div className=" m-2 py-3 row justify-content-sm-around justify-content-center">
                    <Button 
                    type="primary"
                    className="col-xl-2 col-sm-3 col-10 mb-sm-auto mb-2 p-1"
                    onClick={() => {
                        setType('Add');
                        setShowAssignmentModal(true);
                    }}
                    >Add Assignment</Button>
                    <Button 
                    type="primary" 
                    className="col-xl-2 col-sm-3 col-10 mb-sm-auto mb-2 p-1"
                    onClick={() => {
                        if(rowSelected){
                            setType('Edit');
                            setShowAssignmentModal(true);
                        }
                        else{
                            toast.error("A row must be selected!", {
                                duration: 3000,
                              });
                        }
                    }}
                    >Edit Assignment</Button>
                    <Button 
                    type="primary" 
                    className="col-xl-2 col-sm-3 col-10 p-1"
                    onClick={() => {
                        if(rowSelected){
                            setShowAreYouSure(true);
                        }
                        else{
                            toast.error("A row must be selected!", {
                                duration: 3000,
                              });
                        }
                    }}
                    >Delete Assignment</Button>
                </div>
                </>}
            </Paper>
        </div>
    )
}

export default Assignments;