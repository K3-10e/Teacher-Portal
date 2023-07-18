import {
    collection,
    getDocs,
    query,
    setDoc,
    addDoc,
    where
} from "firebase/firestore";
import { db } from "../library/firebase/firebase";
import { v4 as uuidv4 } from "uuid";

// use to add documents to database
// paste this somewhere on a page:
// <button onClick={async () => {dispatch(addDocument())}}>add button</button>
export const addDocument = () => async (dispatch) => {
    try {
        await addDoc(collection(db, "Student_Assignment"), {
          id: uuidv4(),
          assignment_id: 'e7c2bb42-3cea-43aa-8e1a-5065fe7c6b1a',
          student_id: '',
          earned_points: 0,
        })
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.log(error.message);
      }
};

//use to update existing documents
// paste this somewhere on a page:
// <button onClick={async () => {dispatch(massUpdate())}}>update button</button>
export const massUpdate = () => async (dispatch) => {
  try {
    //table here
    const studentsRef = collection(db, "Student");

    //condition here
    const q = query(studentsRef, where("grade", "==", '7'));

    const docSnap = await getDocs(q);

    const data = docSnap.docs.map((doc) => doc);

    console.log('data' + data);
    for(const element of data) {
      await setDoc(element.ref, {
        //thing to update here
        grade: 7,
        teacher_id: 'uCqQUayoISQbyem6dqNzcfZbGeU2',
      }, { merge: true });
      console.log('element: ' + element)
    }
  } catch (error) {
    console.log(error.message);
  }
};