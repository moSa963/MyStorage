import React from "react";
import { AppBar as Bar, Avatar, Badge, IconButton, Toolbar } from "@mui/material";
import ListIcon from "@mui/icons-material/Reorder";
import { Box } from "@mui/system";
import { BASE_URL } from "../../http/Request";
import { useAuth } from "../../context/AuthContext";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useNotification } from "../../context/NotificationContext";
import { useLocation, useNavigate } from "react-router-dom";

const AppBar = ({ onAction }) => {
    const [auth] = useAuth();
    const nav = useNavigate();
    const location = useLocation();
    const [notifications] = useNotification();

    const newPath = (path) => {
        if (location.pathname !== path) {
            nav(path)
        }
    }

    const handleNotificationClick = () => {
        newPath('/notifications');
    }

    const handlProfileClick = () => {
        newPath('/settings');
    }

    return (
        <Bar color="primary" elevation={0} position="static" >
            <Toolbar variant="dense" >
                <IconButton onClick={() => onAction("menu")}>
                    <ListIcon />
                </IconButton>

                <Box sx={{ flexGrow: 1 }} />

                <IconButton onClick={handleNotificationClick} sx={{ height: "fit-content" }} size="small" title="New Group">
                    <Badge badgeContent={notifications && (notifications.requests.length)} color="secondary" overlap="circular" sx={{ overflow: "visible" }}>
                        <NotificationsNoneIcon />
                    </Badge>
                </IconButton>

                <IconButton onClick={handlProfileClick}>
                    <Avatar src={BASE_URL + 'api/image/user/' + auth.user.username} />
                </IconButton>
            </Toolbar>
        </Bar>
    );
}

export default AppBar;