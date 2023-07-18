import { Form, Input, Modal, Button, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAssignmentById, addAssignment, updateAssignment, getAssignmentsByTeacherId } from "../../redux/assignments/actions";
import { v4 as uuidv4 } from "uuid";

const AssignmentModal = ({ showAssignmentModal, setShowAssignmentModal, assignmentId, type }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { assignment } = useSelector(({ assignments }) => assignments);
    const { teacherUserInfo } = useSelector(({ teacher }) => teacher);

    const handleSubmit = async (params) => {
        if(type === "Add") {
            const values ={ 
                ...params,
                create_date: new Date(),
                id: uuidv4(),
                modify_date: null,
                teacher_id: teacherUserInfo.uid,
            };
            dispatch(addAssignment(values, teacherUserInfo.uid)).then(() => dispatch(getAssignmentsByTeacherId(teacherUserInfo.uid)))
        }
        if(type === "Edit") {
            const values  = {
                ...params,
                id: assignment.id,
                modify_date: new Date(),
            }
            dispatch(updateAssignment(values)).then(() => dispatch(getAssignmentsByTeacherId(teacherUserInfo.uid)))
        }
        setShowAssignmentModal(false);
    };

    useEffect(() => {
        if (assignmentId && showAssignmentModal && type === "Edit")
            dispatch(getAssignmentById(assignmentId));
    }, [assignmentId, showAssignmentModal]);

    useEffect(() => {
        if(type === "Add" && showAssignmentModal) {
            form.setFieldsValue({
                name: '',
                type: 'Assignment',
                total_points: 15,
                unit: 1,
            })
        }
        if(showAssignmentModal && type === "Edit" && Object.keys(assignment).length !== 0){
            form.setFieldsValue({
                name: assignment.name,
                type: assignment.type,
                total_points: assignment.total_points,
                unit: assignment.unit,
            })
        }
    }, [type, assignment, showAssignmentModal]);

    return (
    <Modal 
    title={`${type} Assignment`}
    open={showAssignmentModal}
    onCancel={() => 
        {form.resetFields();
        setShowAssignmentModal(false)}}
    footer={[]}
    style={{top: '25%'}}
    >
        <Form
        form={form}
        layout="vertical"
        onFinish={(values) => handleSubmit(values)}
        >
            <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Assignments must have a name.' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
            label="Type"
            name="type"
            >
                <Select>
                    <Select.Option value="Test">Test</Select.Option>
                    <Select.Option value="Quiz">Quiz</Select.Option>
                    <Select.Option value="Assignment">Assignment</Select.Option>
                    <Select.Option value="Homework">Homework</Select.Option>
                </Select>
            </Form.Item>
            
            <div className="row ml-auto" style={{justifyContent: 'space-evenly'}}>
            <Form.Item
            label="Unit"
            name="unit"
            className=""
            >
                <InputNumber min={1}/>
            </Form.Item>
            <Form.Item
            label="Total Points"
            name="total_points"
            >
                <InputNumber min={1}/>
            </Form.Item>
            </div>

            <Form.Item className="">
                <div className="row mt-4 justify-content-around">
                    <Button 
                    size="large"
                    type="primary" 
                    onClick={() => {form.resetFields(); setShowAssignmentModal(false);}}
                    className="col-3"
                    >Cancel</Button>
                    <Button 
                    size="large" 
                    type="primary" 
                    htmlType="submit"
                    className="col-3"
                    >Submit</Button>
                </div>
            </Form.Item>
        </Form>
    </Modal>
    );
};

export default AssignmentModal;
