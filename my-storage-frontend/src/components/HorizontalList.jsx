import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import React from "react";

const Root = styled(Box)(({theme})=>({
    position: 'relative',
    userSelect: 'none',
    "::-webkit-scrollbar":{ display: 'none' },
    paddingLeft: 10,
    paddingRight: 10,
    ":after":{
        content: "''",
        position: 'absolute',
        paddingLeft: theme.spacing(3),
        top: 0,
        bottom: 0,
        left: 0,
        backgroundImage: `linear-gradient(to right, ${theme.palette.background.default}, transparent)`,
    },
    ":before":{
        content: "''",
        position: 'absolute',
        paddingRight: theme.spacing(3),
        top: 0,
        bottom: 0,
        right: 0,
        zIndex: 1,
        backgroundImage: `linear-gradient(to left, ${theme.palette.background.default}, transparent)`,
    }
}));


const HorizontalList = ({ children })=>{

    const handleWheel = (e)=>{
        e.currentTarget.scrollLeft += e.deltaY;
    }

    return (
        <Root width="100%" alignItems="center">
            <Stack direction="row" width="100%" spacing={1} overflow="auto" onWheel={handleWheel} sx={{ alignItems: "center", "::-webkit-scrollbar":{ display: 'none' } }}>
                {children}
            </Stack>
        </Root>
    );
}

export default HorizontalList;