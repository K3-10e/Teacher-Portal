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
    sendFeedbackSuccess,
} from "./slice";
import { v4 as uuidv4 } from "uuid";


export const sendFeedback = (data) => async (dispatch) => {
    dispatch(startLoading());
  
    try {
      await addDoc(collection(db, "Feedback"), {
        id: uuidv4(),
        teacher_id: data.teacher_id,
        rating: data.rating,
        description: data.description,
        create_date: new Date(),
      })
    } catch (error) {
      dispatch(hasError());
      console.log(error.message);
    }
};

