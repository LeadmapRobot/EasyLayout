import { configureStore } from "@reduxjs/toolkit";
import { containerReducer, titleReducer, pageReducer, setCurrentFocusReducer } from "./slice.js";

export default configureStore({
  reducer: {
    containersConfig: containerReducer,
    titlesConfig: titleReducer,
    pageConfig: pageReducer,
    setCurrentFocus: setCurrentFocusReducer,
    
  }
})