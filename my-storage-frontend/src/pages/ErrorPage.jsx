import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useParams } from "react-router-dom";



const ErrorPage = () => { 
    const param = useParams();


    return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', }}>
            <Typography variant="h5">{param?.code}</Typography>
            <Typography variant="h4">{param?.text}</Typography>
        </Box>
    );
}


export default ErrorPage;