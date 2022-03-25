import { ListItemAvatar, ListItemText, Avatar, ListItem, Button } from "@mui/material";
import React from "react";
import { BASE_URL } from "../../http/Request";
import { deleteMember } from "../../http/Data";

const Invite = ({ item, setMessage, onClose })=>{


    return (
        <ListItem  sx={{ p: 0 }} secondaryAction={
            <Button onClick={() => handleDelete(item, setMessage, onClose)} size="small" color="error" variant="contained">Delete</Button>
        }>
            <ListItemAvatar >
                <Avatar src={BASE_URL + 'api/image/group/' + item.group_id} />
            </ListItemAvatar>
            <ListItemText primary={item.group_name} secondary={"@" + item.username} />
        </ListItem>
    );
};


const handleDelete = async (item, setMessage, onClose) => {
    const res = await deleteMember(item.id);

    if (res.ok){
        setMessage("The invite has been deleted.")
        onClose(item);
        return;
    }

    const js = await res.json();
    setMessage(js?.message);
}


export default Invite;