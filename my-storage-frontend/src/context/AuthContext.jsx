import { Backdrop, CircularProgress } from "@mui/material";
import React, { createContext } from "react";
import { getUser } from "../http/Auth";

export const AuthStatus = {
    WAITING: 0,
    AUTHENTICATED: 1,
    UNVERIFIED: 2,
    UNAUTHENTICATED: 3,
}

const Context = createContext();

const AuthProvider = ({ children })=>{
    const [auth, setAuth] = React.useState({ status: AuthStatus.WAITING, user: null });
    
    React.useEffect(()=>{
        loadUser(setAuth);
    }, []);

    return (
        <Context.Provider value={[auth, setAuth]}>
            {
                auth.status === AuthStatus.WAITING ? <Backdrop open><CircularProgress /></Backdrop> : children
            }
        </Context.Provider>
    );
}

const loadUser = async (setAuth) => {
    const res = await getUser();
    const js = await res.json();

    if (res.ok){
        setAuth({
            status: js.email_verified_at ? AuthStatus.AUTHENTICATED : AuthStatus.UNVERIFIED,
            user: js,
        });
    } else if (res.status === 401){
        setAuth({ status: AuthStatus.UNAUTHENTICATED, user: null });
    }
}
 
export default AuthProvider;

export function useAuth () { return React.useContext(Context) };