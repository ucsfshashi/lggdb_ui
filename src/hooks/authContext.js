import {createContext, useContext,useReducer} from 'react'
import configData from "../config.json";

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
  
 const initialState = {apiUrl:configData.apiUrl ,token: null, selRole: null,selTag:null,userName:null,topic:'Demographics'};   
 
 
 const reducer = (state, updates) => {
  localStorage.setItem("auth_context", JSON.stringify({...state,...updates}));     
  return {...state,...updates};
 };      
    
  const [loginContext, setLoginContext] = useReducer(
      reducer,
      JSON.parse(localStorage.getItem("auth_context"))
    );
                      
 return (
    <AuthContext.Provider value={{loginContext, setLoginContext}}>
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext);