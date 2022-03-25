import React, { createContext } from "react";
import { getNotification } from "../http/Data";
import { AuthStatus, useAuth } from "./AuthContext";

const Context = createContext();

const NotificationProvider = ({ children })=>{
    const [notifications, setNotifications] = React.useState(null);
    const [{status}] = useAuth();

    React.useEffect(()=>{
        if (status === AuthStatus.AUTHENTICATED){
            loadNotification(setNotifications);
        }
    }, [status]);

    return (
        <Context.Provider value={[notifications, setNotifications]}>
            {children}
        </Context.Provider>
    );
}

const loadNotification = async (setNotifications) =>{
    const res = await getNotification();
    if (res.ok){
        const js = await res.json();
        setNotifications(js.data);
    }
}

export default NotificationProvider;

export function useNotification () { return React.useContext(Context) };