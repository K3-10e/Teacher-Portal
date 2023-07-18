import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Paper, Box, Popper, Fade, CircularProgress } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import HelpIcon from '@mui/icons-material/Help';
import { getAssignmentsByTeacherId } from "../redux/assignments/actions";
import { getStudentsByTeacherId } from "../redux/students/actions";
import { getTeacherById } from "../redux/teacher/actions";
import { 
    BarChart,
     XAxis,
    YAxis, 
    Tooltip, 
    Legend, 
    Bar, 
    CartesianGrid, 
    LineChart, 
    Line, 
    ResponsiveContainer
} from "recharts";

function subtractMonths(numOfMonths, date = new Date()) {
    date.setMonth(date.getMonth() - numOfMonths);
  
    return date;
  }

const Reports = () => {
    const dispatch = useDispatch();

    const { assignments, totalPoints, missingAssignments } = useSelector(({ assignments }) => assignments);
    const { students } = useSelector(({ students }) => students);
    const { studentAssignments, update, isLoading } = useSelector(({ studentAssignments }) => studentAssignments);
    const { teacherUserInfo } = useSelector(({ teacher }) => teacher);

    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [classAverage, setClassAverage] = useState('');

    const [prevMonth3Amount, setPrevMonth3Amount] = useState(0);
    const [prevMonth2Amount, setPrevMonth2Amount] = useState(0);
    const [prevMonth1Amount, setPrevMonth1Amount] = useState(0);
    const [prevMonth0Amount, setPrevMonth0Amount] = useState(0);
    const [hasExecuted, setHasExecuted] = useState(false);

    const [unitData, setUnitData] = useState([]);
    const [unitHasExecuted, setUnitHasExecuted] = useState(false);

    const prevMonth3 = subtractMonths(3);
    const prevMonth2 = subtractMonths(2);
    const prevMonth1 = subtractMonths(1);
    const prevMonth0 = subtractMonths(0);

    const citizenshipData = [
        { name: "Outstanding",
          Students: students.filter(person => person.citizenship === 'O').length
        },
        { name: "Satisfactory",
          Students: students.filter(person => person.citizenship === 'S').length
        },
        { name: "Unsatisfactory",
          Students: students.filter(person => person.citizenship === 'U').length
        }
    ]

    const absencesData = [
        {
            name: prevMonth3.toLocaleString('default', { month: 'long' }),
            Absences: prevMonth3Amount
        },
        {
            name: prevMonth2.toLocaleString('default', { month: 'long' }),
            Absences: prevMonth2Amount
        },
        {
            name: prevMonth1.toLocaleString('default', { month: 'long' }),
            Absences: prevMonth1Amount
        },
        {
            name: prevMonth0.toLocaleString('default', { month: 'long' }),
            Absences: prevMonth0Amount
        }
    ]

    // const unitData = [
    //     {
    //         name: 'Unit',
    //         Average: 45,
    //     },
    // ]

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
        if(assignments.length > 0){
            let classTotalEarned = 0;
            let missingPointCount = 0;
            for(const assignment of assignments){
                classTotalEarned += assignment.earnedPoints;
                missingPointCount += (assignment.missingCount * assignment.total_points);
            }
           setClassAverage(((classTotalEarned / ((totalPoints * students.length) - missingPointCount)) * 100).toPrecision(4));
        }
    }, [assignments]);

    if(students.length > 0 && !hasExecuted) {
        for(const person of students){
            for(let i = 0; i < person.absences.length; i++) {
                if(person.absences[i].getMonth() === prevMonth3.getMonth()){
                    setPrevMonth3Amount((count) => count+1);
                }
                if(person.absences[i].getMonth() === prevMonth2.getMonth()){
                    setPrevMonth2Amount((count) => count+1);
                }
                if(person.absences[i].getMonth() === prevMonth1.getMonth()){
                    setPrevMonth1Amount((count) => count+1);
                    }
                if(person.absences[i].getMonth() === prevMonth0.getMonth()){
                    setPrevMonth0Amount((count) => count+1);
                 }
            }
        }
        setHasExecuted(true);
    }

    if(assignments.length > 0 && !unitHasExecuted) {
        var totalUnits = [];
        assignments?.filter((oneAssignment) => {
            //checks if it already exits in the unique value array
            var i = totalUnits.findIndex(unitNumber => (unitNumber === oneAssignment.unit));
            if(i <= -1){
                    totalUnits.push(oneAssignment.unit);
            }
            return null;
        });
        
        totalUnits.sort((a, b) => a - b ? 1 : -1);

        for(let i = 0; i < totalUnits.length; i++) {
            const unitAssignments = assignments?.filter((oneAssignment) => oneAssignment.unit === totalUnits[i]);
            var unitClassGradesAdded = 0;
            for(let i = 0; i < unitAssignments.length; i++){
                unitClassGradesAdded += parseFloat(unitAssignments[i].classGrade);
            }
            const avg = (unitClassGradesAdded / (unitAssignments.length * 100) * 100).toPrecision(4)
            const graphPoint = {
                name: `Unit ${totalUnits[i]}`,
                Average: parseFloat(avg)
            }
            setUnitData(currentRows => [...currentRows, graphPoint]);
        }

        setUnitHasExecuted(true);
    }

    return (
        <div className="container-fluid d-flex justify-content-center" style={{minHeight: '90vh'}}>
            <Toaster />
            <Paper className="m-4 col-11" style={{backgroundColor: "#FCFCFC",}}>

                <div className="row m-3 align-items-center justify-content-center justify-content-xl-between">
                    <h1 className="text-center" style={{fontSize: '1.8rem'}}>{teacherUserInfo.first_name} {teacherUserInfo.last_name}'s Class Reports
                    </h1>
                    <div className="row justify-content-around col-xl-auto col-lg-8 col-sm-12 col-11">
                    <div className="text-center p-2 mb-sm-auto mb-2 mr-xl-5 col-sm-3 col-11" style={{backgroundColor: '#e6c59e', borderRadius: '13px'}}>
                        <h5>Total Students: </h5>
                        <h5 style={{fontWeight: 'bold'}}>{students.length}</h5>
                    </div>
                    <div className="text-center p-2 mb-sm-auto mb-2 mr-xl-5 col-sm-3 col-11" style={{backgroundColor: '#e6c59e', borderRadius: '13px'}}>
                        <h5>Class Average Grade: </h5>
                        <h5 style={{fontWeight: 'bold'}}>{classAverage}%</h5>
                    </div>
                    <div className="text-center p-2 mb-sm-auto mb-2 mr-xl-5 col-sm-3 col-11" style={{backgroundColor: '#e6c59e', borderRadius: '13px'}}>
                        <h5>Total Missing Assignments: </h5>
                        <h5 style={{fontWeight: 'bold'}}>{missingAssignments}</h5>
                    </div>
                    </div>
                </div>

                <div id="Graphs" className="row justify-content-center align-items-center" style={{height: '75%'}}>
                    <div id="avg. grade per unit" className="col-xl-4 col-lg-11 col-sm-10 pl-0 pr-4 my-3">
                        <h4 className="text-center">Average Grade Per Unit</h4>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart
                            data={unitData}
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={tick => `${tick}%` } />
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend />
                            <Line type="monotone" dataKey="Average" stroke="#B24C63" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div id="Absences" className="col-xl-4 col-lg-11 col-sm-10 pl-0 pr-4 my-3">
                        <h4 className="text-center">Absences Per Month</h4>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart
                            width={500}
                            height={300}
                            data={absencesData}
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Absences" stroke="#66A3A2" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div id="Citizenship" className="col-xl-4 col-lg-11 col-sm-10 pl-0 pr-4 my-3">
                        <h4 className="text-center">Student Citizenship Graph</h4>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                            width={500}
                            height={300}
                            data={citizenshipData}
                            >
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Students" fill="#848FA5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </Paper>
        </div>
    )
}

export default Reports;