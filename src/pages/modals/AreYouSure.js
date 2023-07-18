import { Modal } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAssignment, getAssignmentById, getAssignmentsByTeacherId } from "../../redux/assignments/actions";

const AreYouSureModal = ({ showAreYouSure, setShowAreYouSure, setAssignmentId, assignmentId, setRowSelected}) => {
    const dispatch = useDispatch();
    const { assignment } = useSelector(({ assignments }) => assignments);
    const { teacherUserInfo } = useSelector(({ teacher }) => teacher);
    
    useEffect(() => {
        if(assignmentId && showAreYouSure)
            dispatch(getAssignmentById(assignmentId));
    }, [showAreYouSure, assignmentId]);

    const handleOk = async () => {
        dispatch(deleteAssignment(assignmentId))
        .then(() => dispatch(getAssignmentsByTeacherId(teacherUserInfo.uid)));
        setShowAreYouSure(false);
        setAssignmentId(null);
        setRowSelected(false);
    }

    return (
    <Modal 
    title="Are you sure?"
    open={showAreYouSure}
    onCancel={() => setShowAreYouSure(false)}
    onOk={handleOk}
    style={{top: '30%'}}
    >
        <p>Are you sure you want to delete assignment: 
            <span style={{color: 'red'}}> {Object.keys(assignment).length !== 0? assignment.name: ''}</span> ?</p>
    </Modal>
    );
};

export default AreYouSureModal;