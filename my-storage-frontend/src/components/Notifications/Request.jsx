import { ListItemAvatar, ListItemText, Avatar, ListItem, ListItemSecondaryAction, ButtonGroup, Button } from "@mui/material";
import React from "react";
import { BASE_URL } from "../../http/Request";
import { acceptRequest, denyRequest } from "../../http/Data";

const Request = ({ item, setMessage, onClose })=>{


    return (
        <ListItem sx={{ p: 0 }} >
            <ListItemAvatar >
                <Avatar src={BASE_URL + 'api/image/group/' + item.group_id} />
            </ListItemAvatar>
            <ListItemText primary={item.group_name} secondary={"@" + item.username} />
            <ListItemSecondaryAction>
                <ButtonGroup size="small">
                    <Button variant="contained" onClick={() => handleAccept(item, setMessage, onClose)}>Accept</Button>
                    <Button color="error" variant="contained" onClick={() => handleDeny(item, setMessage, onClose)}>Deny</Button>
                </ButtonGroup>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

const handleAccept = async (item, setMessage, onClose) => {
    const res = await acceptRequest(item.id);

    if (res.ok){
        setMessage("The invite has been accepted.")
        onClose(item);
        return;
    }

    const js = await res.json();
    setMessage(js?.message);
}

const handleDeny = async (item, setMessage, onClose) => {
    const res = await denyRequest(item.id);

    if (res.ok){
        setMessage("The invite has been Denied.")
        onClose(item);
        return;
    }

    const js = await res.json();
    setMessage(js?.message);
}

export default Request;