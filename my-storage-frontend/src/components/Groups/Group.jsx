import { ListItemAvatar, ListItemButton, ListItemText, Avatar } from "@mui/material";
import React from "react";
import { BASE_URL } from "../../http/Request";

const Group = ({ selected, onClick, group, onRightClick, onDoubleClick })=>{
    return (
        <ListItemButton selected={selected}
            onClick={() => onClick && onClick(group)} 
            onDoubleClick={() => onDoubleClick && onDoubleClick(group)}>
            <ListItemAvatar >
                <Avatar src={BASE_URL + 'api/image/group/' + group.id} 
                    sx={{ border: group?.is_master ? "2px solid red" : null }}/>
            </ListItemAvatar>
            <ListItemText>
                {group.name}
            </ListItemText>
        </ListItemButton>
    )
};

export default Group;