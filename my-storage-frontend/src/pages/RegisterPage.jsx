import { Divider, Tab, Tabs, Typography } from "@mui/material";
import { alpha, Box } from "@mui/system";
import React from "react";
import LoginPage from "./LoginPage";
import SigInPage from "./SignInPage";
import TextSnippet from "@mui/icons-material/TextSnippet";
import Folder from "@mui/icons-material/Folder";
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import ImageIcon from '@mui/icons-material/Image';


const Icon = ({ children, translateX, translateY, shadow = 0, hoverShadow = 0 })=>{

    return (
        <Box sx={{
            position: 'absolute', 
            display: 'flex',
            borderRadius: '50%',
            width: 75,
            transition: '500ms ease-in-out',
            padding: 2,
            height: 75,
            boxShadow: theme=>theme.shadows[shadow],
            backgroundColor: 'background.paper', 
            transform: `translate(${translateX}, ${translateY})`,
            ":hover":{
                boxShadow: theme=>theme.shadows[hoverShadow],
            }
        }}>
            {children}
        </Box>
    );
};


const PageImage = ()=>{


    return (
        <Box sx={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Icon shadow={7} translateX="40px" translateY="40px" hoverShadow={1}>
                <TextSnippet sx={{ width: '100%', height: '100%', }} />
            </Icon>
            <Icon shadow={2} translateX="50px" translateY="-50px" hoverShadow={10}>
                <Folder sx={{ width: '100%', height: '100%', }} />
            </Icon>
            <Icon shadow={2} translateX="-50px" translateY="50px" hoverShadow={10}>
                <AudiotrackIcon sx={{ width: '100%', height: '100%', }} />
            </Icon>
            <Icon shadow={8} translateX="-40px" translateY="-40px" hoverShadow={1}>
                <ImageIcon sx={{ width: '100%', height: '100%', }} />
            </Icon>
        </Box>
    );
};



const PageContainer = ({ selectedIndex, children, index })=>{
    

    return (
        <Box sx={{
            position: 'absolute',
            display: 'flex',
            inset: '0 0 0 0',
            width: '100%',
            height: '100%',
            color: 'text.primary',
            backgroundColor: theme=>alpha(theme.palette.background.paper, 0.5),
            transform: `translateX(${(selectedIndex - index) * -50}%) scale(${index === selectedIndex ? 1 : 0.5})`,
            transition: '500ms ease-in-out',
            zIndex: index === selectedIndex ? 5 : 1,
            opacity: selectedIndex === index ? 1 : 0,
        }}>
            <Box sx={{display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-end'}} >
                <Box sx={{flex: 1, display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="h3">My Storage</Typography>
                </Box>
                <PageImage />
            </Box>
            <Divider sx={{m: 1}} flexItem orientation="vertical" />
            <Box sx={{display: 'flex', flex: 1.5, p: 5, minWidth: { xs: '100%', sm: 0 }, }} >
                {children}
            </Box>
        </Box>
    )
}


const RegisterPage = () => {
    const [selectedTab, setSelectedTab] = React.useState(1);
    const [processing, setProcessing] = React.useState(false);

    const handleStartProcessing = ()=>{
        setProcessing(true);
    }

    const handleEndProcessing = ()=>{
        setProcessing(false);
    }

    return (
        <React.Fragment>
            <Tabs textColor="secondary" indicatorColor="secondary" variant="scrollable" value={selectedTab}
                onChange={(e, v)=>setSelectedTab(v)}>
                <Tab disabled={processing} label="Sign in" value={0} />
                <Tab disabled={processing} label="Login" value={1} />
            </Tabs>
            <Box sx={{ width: '100%', maxWidth: 900, height: '85%', position: 'relative', overflow: 'visible'}}>
                <PageContainer selectedIndex={selectedTab} index={0} >
                    <SigInPage disabled={selectedTab !== 0} onStart={handleStartProcessing} onEnd={handleEndProcessing}/>
                </PageContainer>
                <PageContainer selectedIndex={selectedTab} index={1} >
                    <LoginPage disabled={selectedTab !== 1} onStart={handleStartProcessing} onEnd={handleEndProcessing}/>
                </PageContainer>
            </Box>
        </React.Fragment>
    );
}


export default RegisterPage;