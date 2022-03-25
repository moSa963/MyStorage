import { ListItemAvatar, ListItemText, Avatar, ListItem, IconButton, ListItemSecondaryAction, Menu, Fade, MenuItem, InputLabel, Switch } from "@mui/material";
import React from "react";
import { BASE_URL } from "../../http/Request";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const GroupMember = ({ user, selected, isOwner, onAction })=>{
    const [anchorEl, setAnchorEl] = React.useState(null);
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <ListItem selected={selected} sx={{ p: 0 }} >
            <ListItemAvatar >
                <Avatar src={BASE_URL + 'api/image/user/' + user?.username} />
            </ListItemAvatar>
            <ListItemText primary={"@" + user?.username} secondary={user.is_read_only ? "read" : "read/write"} />
            {
                isOwner && 
                <ListItemSecondaryAction>
                    <IconButton onClick={handleClick}>
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                    >
                        <MenuItem >
                            <InputLabel>Write: </InputLabel>
                            <Switch checked={!user?.is_read_only} onChange={() => onAction(user, "Write")}/>
                        </MenuItem>
                        <MenuItem onClick={() => onAction(user, "Delete")}>Delete</MenuItem>
                    </Menu>
                </ListItemSecondaryAction>
            }
        </ListItem>
    );
};

export default GroupMember;