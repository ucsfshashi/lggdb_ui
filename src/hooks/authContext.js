import {createContext, useContext,useReducer} from 'react'

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
  
 const initialState = {token: null, authority: null,selTag:null,userName:null};   
 const [loginContext, setLoginContext] = useReducer(
      (state, updates) => ({
        ...state,
        ...updates,
      }),
      initialState
    );
  return (
    <AuthContext.Provider value={{loginContext, setLoginContext}}>
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext);