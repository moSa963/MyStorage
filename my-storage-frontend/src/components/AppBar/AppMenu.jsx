import { Typography } from "@mui/material";
import { alpha, Box, styled } from "@mui/system";
import Dashboard from "@mui/icons-material/DashboardOutlined";
import Settings from "@mui/icons-material/SettingsOutlined";
import Group from "@mui/icons-material/GroupOutlined";
import Delete from "@mui/icons-material/DeleteOutline";
import React from "react";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useLocation, useNavigate } from "react-router-dom";



const MenuItem = ({  onClick, Icon, title, index, selected })=>{

    return (
        <Box onClick={onClick} title={title}
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                cursor: 'pointer',
                userSelect: 'none',
                backgroundColor: index === selected ? "background.default" : "primary.dark",
                ":hover":{
                    backgroundColor: theme => alpha(theme.palette.background.paper, index === selected ? 0 : 0.5),
                },
                transition: "border-radius 100ms ease-in-out",
                padding: 2,
                borderBottomRightRadius: index === selected - 1 ? 40 : 0,
                borderTopRightRadius: index === selected + 1 ? 40 : 0,
        }}>
            {Icon}
            <Typography sx={{
                marginLeft: 2,
                display:{xs: 'none',sm: 'none',md: 'flex',},
            }}>
                {title}
            </Typography>
        </Box>
    );
}

const Root = styled(Box)(({theme})=>({
    height: '100%',
    overflow: 'hidden',
    direction: 'rtl',
    "&>*":{
        direction: 'ltr',
    },
    ":hover":{
        overflow: 'auto',        
    },
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.primary.dark,
    transition: "max-width 300ms",
}));

const AppMenu = ({ open })=>{
    const [selected, setSelected] = React.useState(0);
    const nav = useNavigate();
    const location = useLocation();

    React.useEffect(()=>{
        switch(location.pathname.split('/')[1]){
            case 'files' : setSelected(0); return;
            case 'groups' : setSelected(1); return;
            case 'bin' : setSelected(2); return;
            case 'notifications' : setSelected(3); return;
            case 'settings' : setSelected(4); return;
            default: setSelected(0); return;
        }
    }, [location]);
    
    const handleClick = (to)=>{
        if (location.pathname !== to){
            nav(to)
        }
    }

    return (
        <Root sx={{ maxWidth: open ? 250 : 0, }}>
            <Box sx={{ backgroundColor: 'background.default', }}>
                <MenuItem Icon={<Dashboard />} title="Files" index={0} selected={selected} onClick={()=>handleClick('/files/root')} />
                <MenuItem Icon={<Group />} title="Groups" index={1} selected={selected} onClick={()=>handleClick('/groups')} />
                <MenuItem Icon={<Delete />} title="Bin" index={2} selected={selected} onClick={()=>handleClick('/bin')} />
                <MenuItem Icon={<NotificationsNoneIcon />} title="Notifications" index={3} selected={selected} onClick={()=>handleClick('/notifications')} />
                <MenuItem Icon={<Settings />} title="Settings" index={4} selected={selected} onClick={()=>handleClick('/settings')} />
            </Box>
        </Root>
    );
}

export default AppMenu;