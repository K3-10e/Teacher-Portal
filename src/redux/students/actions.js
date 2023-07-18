import { db, storage } from "../../library/firebase/firebase";
import { 
    collection,
    getDocs,
    query,
    setDoc,
    where,
    writeBatch,
    arrayUnion,
    arrayRemove,
    updateDoc,
} from "firebase/firestore";
import { 
    startLoading,
    hasError,
    fetchAllStudentsSuccess,
    fetchStudentSuccess,
    fetchUpdateSuccess,
} from "./slice";

function toDateTime(secs) {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
  return t;
}

var today = new Date();
today.setHours(0, 0, 0, 0);

export const getStudents = () => async (dispatch) => {
    dispatch(startLoading());
  
    try {
      const studentsRef = collection(db, "Student");
  
      const docSnap = await getDocs(studentsRef);
  
      var data = docSnap.docs.map((doc) => doc.data());

      for(const student of data) {
        const studentRow = data.filter((row) => row.id === student.id);

        for(let i = 0; i < student.absences.length; i++){
          var formattedDate = toDateTime(student.absences[i].seconds);
            formattedDate.setHours(0, 0, 0, 0);
          studentRow[0].absences[i] = formattedDate;
        }
      }
      // console.log(data);
      dispatch(fetchAllStudentsSuccess(data));
    } catch (error) {
      dispatch(hasError());
      console.log(error.message);
    }
};

export const getStudentsByTeacherId = (teacherId) => async (dispatch) => {
  dispatch(startLoading());
  
    try {
      const studentsRef = collection(db, "Student");
  
      const q = query(studentsRef, where("teacher_id", "==", teacherId));

      const docSnap = await getDocs(q);
  
      var data = docSnap.docs.map((doc) => doc.data());

      for(const student of data) {
        const studentRow = data.filter((row) => row.id === student.id);

        for(let i = 0; i < student.absences.length; i++){
          var formattedDate = toDateTime(student.absences[i].seconds);
          formattedDate.setHours(0, 0, 0, 0);
          studentRow[0].absences[i] = formattedDate;
        }
      }

      dispatch(fetchAllStudentsSuccess(data));
    } catch (error) {
      dispatch(hasError());
      console.log(error.message);
    }
};

export const getStudentById = (id) => async (dispatch) => {
  dispatch(startLoading());

  try {
    const studentsRef = collection(db, "Student")

    const q = query(studentsRef, where("id", "==", id));

    const docSnap = await getDocs(q);

    var data = docSnap.docs.map((doc) => doc.data());

    for(let i = 0; i < data[0].absences.length; i++){
      var formattedDate = toDateTime(data[0].absences[i].seconds);
      formattedDate.setHours(0, 0, 0, 0);
      data[0].absences[i] = formattedDate;
    }
    data[0].absences.sort((a, b) => a - b);
    // console.log(data);
    dispatch(fetchStudentSuccess(data[0]));
  } catch (error) {
    dispatch(hasError());
    console.log(error.message);
  }
};

export const updateStudents = (studentData) => async (dispatch) => {
  dispatch(startLoading());

  try {
    var anyUpdate = false;
    const studentRef = collection(db, "Student");

    const q = query(studentRef, where("teacher_id", "==", studentData[0].teacher_id));

    const docSnap = await getDocs(q);
    
    const batch = writeBatch(db)
    for(const oldStudentDoc of docSnap.docs){
      const oldStudentContent = oldStudentDoc.data();
      //the potentially new data for the student
      const newStudentData = studentData.filter((row) => row.id === oldStudentContent.id);

      //only updates if the values are different
      if(newStudentData[0].citizenship !== oldStudentContent.citizenship){
        anyUpdate = true;
        batch.update(oldStudentDoc.ref, {citizenship: newStudentData[0].citizenship});
      }

      var index = -1;
        oldStudentContent.absences.forEach((date, counter) => {
        // checks if today is present in the array   
          var convertedDate = toDateTime(date.seconds);
          convertedDate.setHours(0, 0, 0, 0);
          if(convertedDate.getTime() === today.getTime()) {
              index = counter;
          }
        })
      // if they were marked absent, but it is not in the db
      if(newStudentData[0].absentToday && index === -1){
        anyUpdate = true;
        batch.update(oldStudentDoc.ref, {absences: arrayUnion(today)});
      }
      // if they were marked not absent, but it is in the db
      if(!newStudentData[0].absentToday && index !== -1){
        anyUpdate = true;
        batch.update(oldStudentDoc.ref, {absences: arrayRemove(today)});
      }
    }
    await batch.commit();
    dispatch(fetchUpdateSuccess(anyUpdate));
  } catch (error) {
    dispatch(hasError());
    console.log(error.message);
  }
};

export const updateStudent = (studentData) => async (dispatch) => {
  dispatch(startLoading());

  try {
    const studentRef = collection(db, "Student");

    const q = query(studentRef, where("id", "==", studentData.id));

    const docSnap = await getDocs(q);

    const data = docSnap.docs[0];

    const oldStudent = data.data();
    
    var index = -1;
    oldStudent.absences.forEach((date, counter) => {
    // checks if today is present in the array   
      var convertedDate = toDateTime(date.seconds);
      convertedDate.setHours(0, 0, 0, 0);
      if(convertedDate.getTime() === studentData.date.getTime()) {
          index = counter;
      }
    })

    if(index === -1){
      await updateDoc(data.ref, {
        absences: arrayUnion(studentData.date)
      },);
    }
    else{
      await updateDoc(data.ref, {
        absences: arrayRemove(studentData.date)
      },);
    }
    
    dispatch(fetchUpdateSuccess(true));
  } catch (error) {
    dispatch(hasError());
    console.log(error.message);
  }
};