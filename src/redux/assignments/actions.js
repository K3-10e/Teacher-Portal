import { db, storage } from "../../library/firebase/firebase";
import { 
    collection,
    getDocs,
    query,
    setDoc,
    addDoc,
    deleteDoc,
    where
} from "firebase/firestore";
import { 
    startLoading,
    hasError,
    fetchAllAssignmentsSuccess,
    fetchAssignmentSuccess,
    fetchActionSuccess,
} from "./slice";
import { addStudentAssignment, deleteStudentAssignment } from "../studentAssignments/actions";


export const getAssignments = () => async (dispatch) => {
    dispatch(startLoading());
  
    try {
      const assignmentRef = collection(db, "Assignment");
  
      const docSnap = await getDocs(assignmentRef);
  
      const data = docSnap.docs.map((doc) => doc.data());
      // console.log(data);
      dispatch(fetchAllAssignmentsSuccess({assignments: data}));
    } catch (error) {
      dispatch(hasError());
      console.log(error.message);
    }
};

export const getAssignmentsByTeacherId = (teacherId) => async (dispatch) => {
  dispatch(startLoading());
  
    try {
      const assignmentRef = collection(db, "Assignment");
  
      const q = query(assignmentRef, where("teacher_id", "==", teacherId));

      const docSnap = await getDocs(q);
  
      const data = docSnap.docs.map((doc) => doc.data());
      //ascending by unit
      
      let totalPoints = 0;
      let totalMissing = 0;
      for(const element of data) {
        totalPoints += element.total_points;
        
        const SARef = collection(db, "Student_Assignment");
        const SAq = query(SARef, where("assignment_id", "==", element.id));
        const SAdocSnap = await getDocs(SAq);
        const SAdata = SAdocSnap.docs.map((doc) => doc.data());
        
        let earnedPoints = 0;   
        let missingCount = 0;
        for(const SAelement of SAdata) {
          if(SAelement.earned_points !== null)
            earnedPoints += SAelement.earned_points;
          else{
            missingCount++;
          }
        }
        element.earnedPoints = earnedPoints;
        element.missingCount = missingCount;
        totalMissing += missingCount;
        element.classGrade = ((earnedPoints / (element.total_points * (SAdata.length - missingCount))) * 100).toPrecision(4);
        if(element.classGrade === 'NaN')
          element.classGrade = 0;
      }

      data.sort((a, b) => a.unit > b.unit? 1 : -1);
      dispatch(fetchAllAssignmentsSuccess({assignments: data, totalPoints: totalPoints, missingAssignments: totalMissing}));
    } catch (error) {
      dispatch(hasError());
      console.log(error.message);
    }
};

export const getAssignmentById = (id) => async (dispatch) => {
  dispatch(startLoading());

  try {
    const assignmentRef = collection(db, "Assignment");

    const q = query(assignmentRef, where("id", "==", id));

    const docSnap = await getDocs(q);

    const data = docSnap.docs.map((doc) => doc.data());
    // console.log(data);
    dispatch(fetchAssignmentSuccess(data[0]));
  } catch (error) {
    dispatch(hasError());
    console.log(error.message);
  }
};

export const addAssignment = (data, teacherId) => async (dispatch) => {
  dispatch(startLoading());

  try {
    const assignmentRef = await addDoc(collection(db, "Assignment"), {
      ...data,
    });
    dispatch(addStudentAssignment(data.id, teacherId));
    dispatch(fetchActionSuccess());
  } catch (error) {
    dispatch(hasError());
    console.log(error.message);
  }
};

export const updateAssignment = (assignmentData) => async (dispatch) => {
  dispatch(startLoading());

  try {
    const assignmentRef = collection(db, "Assignment");

    const q = query(assignmentRef, where("id", "==", assignmentData.id));

    const docSnap = await getDocs(q);
    
    //if the document exists already
    if (docSnap.size) {
      const data = docSnap.docs[0]
    
      //updates the current assignment    
        const assignment = await setDoc(data.ref, {
            ...assignmentData,
          }, { merge: true });
    }
    dispatch(fetchActionSuccess());
  } catch (error) {
    dispatch(hasError());
    console.log(error.message);
  }
};

export const deleteAssignment = (assignmentId) => async (dispatch) => {
  dispatch(startLoading());

  try {
    const assignmentRef = collection(db, "Assignment");

    const q = query(assignmentRef, where("id", "==", assignmentId));

    const docSnap = await getDocs(q);
    
    const data = docSnap.docs[0];
    await deleteDoc(data.ref);
    dispatch(deleteStudentAssignment(assignmentId));
    dispatch(fetchActionSuccess());
  } catch (error) {
    dispatch(hasError());
    console.log(error.message);
  }
};