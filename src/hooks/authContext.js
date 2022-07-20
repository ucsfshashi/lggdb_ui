import {createContext, useContext,useReducer} from 'react'

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
  
 const initialState = {token: null, authority: null,selTag:null,userName:null,topic:'Demographics'};   
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