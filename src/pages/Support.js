import { Paper, Box, Accordion, AccordionSummary, AccordionDetails, FormGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextArea from "antd/lib/input/TextArea";
import { Button, Form, Rate } from "antd";
import { sendFeedback } from "../redux/feedback/actions";

const Support = () => {
    const dispatch = useDispatch();
    const { teacherUserInfo } = useSelector(({ teacher }) => teacher);
    const [rating, setRating] = useState(2.5);

    const [form] = Form.useForm();

    useEffect(() => {},[]);

    const handleSubmit = async (params) => {
        const values = {
            teacher_id: teacherUserInfo.uid,
            rating: rating,
            description: params.feedback,
        }
        dispatch(sendFeedback(values));
    };

    return (
        <div className="container-fluid d-flex justify-content-center" style={{minHeight: '90vh',}}>
            <Paper className="m-4 col-11" style={{backgroundColor: "#FCFCFC",}}>
                <div className="row m-3 align-items-center justify-content-center justify-content-xl-between">
                    <h1 className="text-center" style={{fontSize: '1.8rem'}}>User Guide</h1>
                </div>
                <div className="container">
                    <Accordion>
                        <AccordionSummary
                         expandIcon={<ExpandMoreIcon />}
                        >
                            Class Page
                        </AccordionSummary>
                        <AccordionDetails>
                            The class page provides an at-a-glance view of students in your class and 
                            also allows for quick input of a student's daily attendance and citizenship rating.
                            Double clicking on a row will bring up details about a specific student.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                         expandIcon={<ExpandMoreIcon />}
                        >
                            Student Details Page
                        </AccordionSummary>
                        <AccordionDetails>
                            The student details page, accessed from double clicking a row on the class page, displays information 
                            regarding grades, assignments, and attendance about a specific student.
                            Here prior absences that are before or after the current date can be added or removed.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                         expandIcon={<ExpandMoreIcon />}
                        >
                            Assignments Page
                        </AccordionSummary>
                        <AccordionDetails>
                            The assignments page lists all of the assignments you have inputted into the program
                            including the type, unit, and the class average grade.
                            Assignments can be added edited or deleted using the buttons below and details about an
                            assignment can be seen by double clicking on a row.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                         expandIcon={<ExpandMoreIcon />}
                        >
                            Assignment Details Page
                        </AccordionSummary>
                        <AccordionDetails>
                            This page can be accessed by double clicking on a row on the assignments page. This is the page
                            where a student's earned points on an assignment can be added. If no value is added for a student,
                            then the assignment will appear as missing.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                         expandIcon={<ExpandMoreIcon />}
                        >
                            Reports Page
                        </AccordionSummary>
                        <AccordionDetails>
                            This page can provide you with important insight into your classroom. These graphs can help you
                            evaluate how effective your current approach is and what concepts students might be failing to
                            grasp.
                        </AccordionDetails>
                    </Accordion>
                </div>

                <div className="row m-3 align-items-center justify-content-center justify-content-xl-between">
                    <h1 className="text-center" style={{fontSize: '1.8rem'}}>Feedback</h1>
                </div>
                <div className="container">
                    <Form
                    form={form}
                    onFinish={(values) => handleSubmit(values)}
                    >
                        <div className="row justify-content-center">
                            <h5 className="mt-1 mr-3">Rating:</h5>
                            <Rate allowHalf defaultValue={2.5} onChange={(value) => {setRating(value)}} />
                        </div>

                        <div className="row justify-content-center">
                            <Form.Item
                            name="feedback"
                            className="col-10 m-2"
                            >
                                <TextArea 
                                rows={4}
                                placeholder="Feedback Description"
                                />
                            </Form.Item>
                        
                            <Form.Item
                                className="col-12 mb-sm-auto my-4 p-1"
                            >
                                <div className="row justify-content-center mb-3">
                                    <Button
                                    type="primary" 
                                    htmlType="submit"
                                    className="col-lg-2 col-sm-4 col-8"
                                    >
                                    Submit
                                    </Button>
                                </div>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </Paper>
        </div>
    )
}

export default Support;