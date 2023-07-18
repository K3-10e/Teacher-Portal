import { db, storage } from "../../library/firebase/firebase";
import { 
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    addDoc,
    deleteDoc,
    where,
    writeBatch
} from "firebase/firestore";
import { 
    startLoading,
    hasError,
    fetchAllAssignmentsSuccess,
    fetchDetailsPageAssignmentsSuccess,
    fetchUpdateSuccess,
} from "./slice";
import { v4 as uuidv4 } from "uuid";


export const getStudentAssignments = () => async (dispatch) => {
    dispatch(startLoading());
  
    try {
      const assignmentRef = collection(db, "Student_Assignment");
  
      const docSnap = await getDocs(assignmentRef);
  
      const data = docSnap.docs.map((doc) => doc.data());
      // console.log(data);
      dispatch(fetchAllAssignmentsSuccess({assignments: data}));
    } catch (error) {
      dispatch(hasError());
      console.log(error.message);
    }
};

//will return all student score data for one assignment
export const getStudentAssignmentsByAssignment = (id) => async (dispatch) => {
  dispatch(startLoading());
  
    try {
      const assignmentRef = collection(db, "Student_Assignment");
  
      const q = query(assignmentRef, where("assignment_id", "==", id));

      const docSnap = await getDocs(q);
  
      const data = docSnap.docs.map((doc) => doc.data());
      //ascending by unit
      data.sort((a, b) => a.earned_points > b.earned_points? 1 : -1);
      let earnedPoints = 0;
      for(const element of data) {
        earnedPoints += element.earned_points;
      }

      dispatch(fetchDetailsPageAssignmentsSuccess({assignments: data, detailsEarnedPoints: earnedPoints}));
    } catch (error) {
      dispatch(hasError());
      console.log(error.message);
    }
};

//will return all assignment data for one student
export const getStudentAssignmentsByStudent = (id) => async (dispatch) => {
  dispatch(startLoading());
  
    try {
      const assignmentRef = collection(db, "Student_Assignment");
  
      const q = query(assignmentRef, where("student_id", "==", id));

      const docSnap = await getDocs(q);
  
      const data = docSnap.docs.map((doc) => doc.data());
      //ascending by unit
      data.sort((a, b) => a.earned_points > b.earned_points? 1 : -1);
      let earnedPoints = 0;
      for(const element of data) {
        earnedPoints += element.earned_points;
      }

      dispatch(fetchDetailsPageAssignmentsSuccess({assignments: data, detailsEarnedPoints: earnedPoints}));
    } catch (error) {
      dispatch(hasError());
      console.log(error.message);
    }
};



export const addStudentAssignment = (assignmentId, teacherId) => async (dispatch) => {
  dispatch(startLoading());

  try {
    //gets all students
    const studentsRef = collection(db, "Student");
  
    const q = query(studentsRef, where("teacher_id", "==", teacherId));

    const docSnap = await getDocs(q);

    const data = docSnap.docs.map((doc) => doc.data());

    const batch = writeBatch(db);

    for(const element of data){
      const SARef = doc(collection(db, "Student_Assignment"));
      batch.set(SARef,{
        id: uuidv4(),
        assignment_id: assignmentId,
        earned_points: null,
        student_id: element.id,
      });
    }

    await batch.commit();
  } catch (error) {
    dispatch(hasError());
    console.log(error.message);
  }
};

export const updateStudentAssignment = (assignmentData) => async (dispatch) => {
  dispatch(startLoading());

  try {
    var anyUpdate = false;
    const assignmentRef = collection(db, "Student_Assignment");

    const q = query(assignmentRef, where("assignment_id", "==", assignmentData[0].assignment_id));

    const docSnap = await getDocs(q);
    
    const batch = writeBatch(db)
    for(const oldDataDoc of docSnap.docs){
      const oldDataContent = oldDataDoc.data();
      const newData = assignmentData.filter((row) => row.id === oldDataContent.id);
      //only updates if the points are different
      if(newData[0].earned_points !== oldDataContent.earned_points){
        anyUpdate = true;
        if(newData[0].earned_points !== null)
          batch.update(oldDataDoc.ref, {earned_points: parseInt(newData[0].earned_points)});
        else
          batch.update(oldDataDoc.ref, {earned_points: newData[0].earned_points});
      }
    }
    await batch.commit();
    dispatch(fetchUpdateSuccess(anyUpdate));
  } catch (error) {
    dispatch(hasError());
    console.log(error.message);
  }
};

export const deleteStudentAssignment = (assignmentId) => async (dispatch) => {
  dispatch(startLoading());

  try {
    const assignmentRef = collection(db, "Student_Assignment");

    const q = query(assignmentRef, where("assignment_id", "==", assignmentId));

    const docSnap = await getDocs(q);
    
    const batch = writeBatch(db)
    for(const element of docSnap.docs){
      batch.delete(element.ref);
    }
    await batch.commit();
  } catch (error) {
    dispatch(hasError());
    console.log(error.message);
  }
};