import React from "react";
import { Box } from "@mui/system";
import { Button, Divider, LinearProgress, Switch, Typography } from "@mui/material";
import { useThemeMode } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { logout } from "../http/Auth";
import { BASE_URL } from "../http/Request";
import { updateUser } from "../http/Data";
import { PageRoot, StyledFillInput, StyledImg } from "../components/StyledComponents";


const UserBanner = ({ user })=>{
    const [processing, setProcessing] = React.useState(false);

    const handleImageChange = (event)=>{
        if (!processing){
            setProcessing(true);
            updateUser(event.currentTarget.files[0])
            .then(res=>{
                window.location.reload();
            })
            .catch(err=>console.log(err));
        }
    }

    return (
        <Box sx={{
            display: 'flex',
        }}>
            {processing&&<LinearProgress sx={{position: 'absolute', inset: "0 0 0"}}/>}

            <Box sx={{ position: 'relative', display: 'flex', aspectRatio: "1", maxWidth: 100, height: 'fit-content', justifyContent: 'center', }} >
                <StyledImg src={BASE_URL + 'api/image/user/' + user.username} />
                <StyledFillInput type="file" accept="image/*" onChange={handleImageChange}/>
            </Box>
            <Box sx={{flex: 1, pl: 3}}>
                <Typography>{user.first_name + " " + user.last_name}</Typography>
                <Typography variant="caption">{user.username}</Typography>
            </Box>
        </Box>
    );
}

const SettingsPage = () => {
    const [themeMode, setThemeMode] = useThemeMode();
    const [{ user }] = useAuth();

    const handleLogout = ()=>{
        logout()
        .then(js=>{
            window.location.reload();
        });
    }

    return (
        <PageRoot>
            <UserBanner user={user}/>
            <Divider flexItem sx={{m: 3}}/>
            <Box sx={{display: 'flex', alignItems: 'center', mt: 3, mb: 3}}>
                <Typography>DarkMode</Typography>
                <Switch checked={themeMode === 'dark'}
                    onChange={(e)=>setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}/>
            </Box>
            <Box sx={{flexGrow: 1}} />
            <Button variant="outlined" color="error" onClick={handleLogout}>Logout</Button>
        </PageRoot>
    );
}


export default SettingsPage;