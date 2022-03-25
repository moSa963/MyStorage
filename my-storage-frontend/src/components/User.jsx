import { ListItemAvatar, ListItemButton, ListItemText, Avatar, ListItem, IconButton, ListItemSecondaryAction } from "@mui/material";
import React from "react";
import { BASE_URL } from "../http/Request";

const User = ({ user, selected, onClick, onDoubleClick })=>{
    return (
        <ListItem selected={selected} sx={{ p: 0 }}
            onClick={() => onClick && onClick(user)} 
            onDoubleClick={() => onDoubleClick && onDoubleClick(user)}>
            <ListItemAvatar >
                <Avatar src={BASE_URL + 'api/image/user/' + user?.username} />
            </ListItemAvatar>
            <ListItemText primary={user?.first_name + " " + user?.last_name} secondary={"@" + user?.username} />
        </ListItem>
    )
};

export default User;