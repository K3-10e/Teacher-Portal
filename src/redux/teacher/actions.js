import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db } from "../../library/firebase/firebase";
import {
  fetchTeacherSuccess,
  hasError,
  startLoading
} from "./slice";

export const getTeacherById = (teacherId) => async (dispatch) => {
  dispatch(startLoading());
  
    try {
      const teacherRef = collection(db, "Teacher");
  
      const q = query(teacherRef, where("id", "==", teacherId));

      const docSnap = await getDocs(q);
  
      const data = docSnap.docs.map((doc) => doc.data());
      dispatch(fetchTeacherSuccess(data[0]));
    } catch (error) {
      dispatch(hasError());
      console.log(error.message);
    }
};