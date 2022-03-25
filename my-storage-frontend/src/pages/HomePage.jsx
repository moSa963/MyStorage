import { Box } from "@mui/system";
import React from "react";
import { Outlet } from "react-router-dom";
import AppBar from "../components/AppBar/AppBar";
import AppMenu from "../components/AppBar/AppMenu";

const HomePage = ({ children })=>{
    const [menuOpen, setMenuOpen] = React.useState(true);

    const handleAppBarAction = (action)=>{
        switch(action){
            case "menu" :setMenuOpen(!menuOpen); return;
            default: return;
        }
    }

    return(
        <React.Fragment>
            <AppBar onAction={handleAppBarAction} />
            <Box sx={{
                display: 'flex',
                flex: 1,
                flexDirection: 'row',
                width: '100%',
                backgroundColor: "background.default",
                color: "text.primary",
            }}>
                <AppMenu open={menuOpen}/>
                <Box sx={{
                    flex: 1,
                    height: '100%',
                }}>
                    <Outlet />
                </Box>
            </Box>
        </React.Fragment>
    );
}

export default HomePage;