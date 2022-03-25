import React from "react";
import { Root } from "../Groups/GroupList";
import Invite from "./Invite";
import Request from "./Request";


const NotificationsList = ({ items, filter, type, setData, setMessage }) => {
    const handleClose = (item) => {
        items[type] = items[type].filter(e => e.id !== item.id);
        setData({...items});
    }
    
    return (
        <Root sx={{ width: "100%", flex: 1 }} >
            {
                items && items[type]?.filter(e => filter ? e.username.startsWith(filter) : true).map((e, i) => {
                    if (type === "invites"){
                        return <Invite key={i} item={e} onClose={handleClose} setMessage={setMessage}/>;
                    }
                    return <Request key={i} item={e} onClose={handleClose} setMessage={setMessage}/>
                })
            }
        </Root>
    );
}



export default NotificationsList;