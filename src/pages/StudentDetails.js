import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudentAssignmentsByStudent } from "../redux/studentAssignments/actions";
import { getStudentById, updateStudent } from "../redux/students/actions";
import { resetStudents, resetUpdate } from "../redux/students/slice";
import { DataGrid } from "@mui/x-data-grid";
import { getTeacherById } from "../redux/teacher/actions";
import { getAssignmentsByTeacherId } from "../redux/assignments/actions";
import { Calendar, Select, Typography, Radio, Col, Row } from "antd";
import toast, { Toaster } from "react-hot-toast";

const StudentDetails = () => {
    const dispatch = useDispatch();

    const { student, update } = useSelector(({ students }) => students);
    const { detailsPageAssignments, detailsEarnedPoints } = useSelector(({ studentAssignments }) => studentAssignments);
    const { assignments, totalPoints } = useSelector(({ assignments }) => assignments);
    const { teacherUserInfo } = useSelector(({ teacher }) => teacher);

    const [overallGrade, setOverallGrade] = useState('');
    const [missingRows, setMissingRows] = useState([]);
    const [assignmentRows, setAssignmentRows] = useState([]);
    const [absentDate, setAbsentDate] = useState(false);
    const [selectedDate, setSelectedDate] = useState();

    const id = window.location.pathname.slice(16);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    let citizenshipName;

    if(Object.keys(student).length !== 0){
        if(student.citizenship === 'O')
            citizenshipName = 'Outstanding';
        if(student.citizenship === 'S')
            citizenshipName = 'Satisfactory';
        if(student.citizenship === 'U')
            citizenshipName = 'Unsatisfactory';
    }

    const missingColumns = [
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
    ];

    const assignmentColumns = [
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
            field: 'grade',
            headerName: 'Grade',
            flex: 1,
            minWidth: 60,
            editable: false,
          },
    ];

    useEffect(() => {
        dispatch(getStudentById(id));
        dispatch(getStudentAssignmentsByStudent(id));
        dispatch(resetStudents());
    },[dispatch]);

    useEffect(() => {
        if(Object.keys(student).length !== 0){
            var pickedDate = new Date();
            pickedDate.setHours(0, 0, 0, 0);
            setSelectedDate(pickedDate);
            var index = -1;
            student?.absences.forEach((date, counter) => {
                if(date.getTime() === today.getTime()) {
                    index = counter;
                }
            })
            if(index !== -1){
                setAbsentDate(true);
            }
            else { 
                setAbsentDate(false);
            }}
    }, []);

    useEffect(() => {
        if(teacherUserInfo !== null && Object.keys(teacherUserInfo).length !== 0){
            dispatch(getAssignmentsByTeacherId(teacherUserInfo.uid));
        }
        if(!Object.hasOwn(teacherUserInfo, 'first_name')){
            dispatch(getTeacherById(teacherUserInfo.uid));
        }
    }, [dispatch, teacherUserInfo]);

    useEffect(() => {
        setOverallGrade(((detailsEarnedPoints / totalPoints) * 100).toPrecision(4));
    },[detailsEarnedPoints, totalPoints]);

    useEffect(() => {
        if(update){
            dispatch(getStudentById(id));
            toast.success("Student Successfully Edited!", {
                duration: 3000,
            });
           dispatch(resetUpdate());
        }
    },[update]);

    if(detailsPageAssignments.length > 0 && assignments.length > 0 && (assignmentRows.length === 0 && missingRows.length === 0)){
        for(const assignment of detailsPageAssignments){
            const currentAssignment = assignments?.filter(element => element.id === assignment.assignment_id);
            if(assignment.earned_points === null){
                const newValues = {
                    id: assignment.id,
                    name: currentAssignment[0].name
                }
                setMissingRows(currentRows => [...currentRows, newValues]);
            }
            else{
                const newValues = {
                    id: assignment.id,
                    name: currentAssignment[0].name,
                    grade: ((assignment.earned_points / currentAssignment[0].total_points) * 100).toPrecision(4),
                }
                setAssignmentRows(currentRows => [...currentRows, newValues]);
            }
        }
    }

    const handleCalendarSelect = (dateMoment) => {
        var pickedDate = new Date(dateMoment.toDate());
        pickedDate.setHours(0, 0, 0, 0);
        setSelectedDate(pickedDate);
        //filter the students absences to see if date exists in it
        var index = -1;
        student.absences.forEach((date, counter) => {
            if(date.getTime() === pickedDate.getTime()) {
                index = counter;
            }
        })
        if(index !== -1){
            setAbsentDate(true);
        }
        else { 
            setAbsentDate(false);
        }
    }

    const handleAbsentAdjust = () => {
        const values = {
            id: student.id,
            date: selectedDate,
        }
      
        dispatch(updateStudent(values))
        setAbsentDate(!absentDate);
    }

    function onFullRender(date){
        var day = date.toDate();
        day.setHours(0, 0, 0, 0);

        var index = -1;
        if(Object.keys(student).length !== 0){
        student?.absences.forEach((date, counter) => {
            if(date.getTime() === day.getTime()) {
                index = counter;
            }
        })}

        let style;
        if(index === -1) {
         style = {};
        }
        else {
         style = { border: "1px solid #e7acac", backgroundColor: '#e7acac'};
        }
        return(
            <div style={style} class="ant-picker-cell-inner ant-picker-calendar-date">
                <div class="ant-picker-calendar-date-value">{date.date()}</div>
                <div class="ant-picker-calendar-date-content"></div>
            </div>
        )
      }
    
    return (
        <div className="container-fluid d-flex justify-content-center" style={{minHeight: '90vh',}}>
            <Toaster />
            <Paper className="m-4 col-11" style={{backgroundColor: "#FCFCFC",}}>
                <div className="row mt-2 justify-content-center justify-content-sm-around justify-content-xl-start">
                    <div className="col-xl-5 col-12 mb-2 mb-xl-0">
                        <h3>{student.first_name} {student.last_name}</h3>
                        <h6>ID: {student.id}</h6>
                        <h6>Grade: {student.grade}</h6>
                    </div>
                    <div className="text-center p-2 mb-sm-auto mb-2 mr-xl-5 col-xl-2 col-sm-4 col-11 offset-xl-2" style={{backgroundColor: '#e6c59e', borderRadius: '13px'}}>
                        <h5>Citizenship Rating:</h5>
                        <h5 style={{fontWeight: 'bold'}}>{citizenshipName}</h5>
                    </div>
                    <div className="text-center p-2 mb-sm-auto col-xl-2 col-sm-4 col-11" style={{backgroundColor: '#e6c59e', borderRadius: '13px'}}>
                        <h5>Overall Grade:</h5>
                        <h5 style={{fontWeight: 'bold'}}>{overallGrade}%</h5>
                    </div>
                </div>
                <div className="row my-4">
                    <div className="col-xl-3 col-md-6 col-12">
                        <h4>Missing Assignments</h4>
                        <DataGrid
                        columns={missingColumns}
                        rows={missingRows}
                        rowsPerPageOptions={[]}
                        columnVisibilityModel={{
                            id: false,
                            }}
                        className=""
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
                    <div className="col-xl-3 col-md-6 col-12 my-md-0 my-4">
                        <h4>Assignments</h4>
                        <DataGrid
                        columns={assignmentColumns}
                        rows={assignmentRows}
                        rowsPerPageOptions={[]}
                        columnVisibilityModel={{
                            id: false,
                            }}
                        className=""
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
                    <div className="col-xl-6 col-md-12">
                    <h4 className="mt-2">Absences</h4>
                        <Calendar 
                        fullscreen={false}
                        onSelect={handleCalendarSelect}
                        dateFullCellRender={onFullRender}
                        headerRender={({ value, type, onChange, onTypeChange }) => {const start = 0;
                            const end = 12;
                            const monthOptions = [];
                  
                            const current = value.clone();
                            const localeData = value.localeData();
                            const months = [];
                            for (let i = 0; i < 12; i++) {
                              current.month(i);
                              months.push(localeData.monthsShort(current));
                            }
                  
                            for (let i = start; i < end; i++) {
                              monthOptions.push(
                                <Select.Option key={i} value={i} className="month-item">
                                  {months[i]}
                                </Select.Option>,
                              );
                            }
                  
                            const year = value.year();
                            const month = value.month();
                            const options = [];
                            for (let i = year - 10; i < year + 10; i += 1) {
                              options.push(
                                <Select.Option key={i} value={i} className="year-item">
                                  {i}
                                </Select.Option>,
                              );
                            }
                            return (
                              <div style={{ padding: 8 }}>
                                <Row gutter={8}>
                                    <Col>
                                        <Select
                                        size="small"
                                        dropdownMatchSelectWidth={false}
                                        className="my-year-select"
                                        value={year}
                                        onChange={newYear => {
                                            const now = value.clone().year(newYear);
                                            onChange(now);
                                        }}
                                        >
                                        {options}
                                        </Select>
                                    </Col>
                                    <Col>
                                        <Select
                                        size="small"
                                        dropdownMatchSelectWidth={false}
                                        value={month}
                                        onChange={newMonth => {
                                            const now = value.clone().month(newMonth);
                                            onChange(now);
                                        }}
                                        >
                                        {monthOptions}
                                        </Select>
                                    </Col>
                                    <Col>
                                        <Radio.Group
                                        size="small"
                                        onChange={e => onTypeChange(e.target.value)}
                                        value={type}
                                        >
                                        <Radio.Button value="month">Month</Radio.Button>
                                        <Radio.Button value="year">Year</Radio.Button>
                                        </Radio.Group>
                                    </Col>
                                    <Col 
                                    className="ml-4 px-2 py-0 ant-btn-primary" 
                                    style={{height: 'unset', cursor: 'pointer'}}
                                    onClick={handleAbsentAdjust}
                                    >
                                     {absentDate? 'Remove Absence' : 'Add Absence'}
                                    </Col>
                                </Row>
                              </div>
                            );
                          }}
                         />
                    <h4 className="mt-3">Absent Dates</h4>
                        <div className="row">
                        {student.absences?.map(date => {
                            return(
                                <h6 className="col-md-3 col-6 mb-3">• {date.toLocaleDateString()}</h6>
                            )})}
                        </div>
                    </div>
                </div>
            </Paper>
        </div>
    )
}

export default StudentDetails;