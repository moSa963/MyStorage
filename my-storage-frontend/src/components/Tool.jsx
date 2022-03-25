import { Divider, IconButton } from "@mui/material";
import { Box, styled } from "@mui/system";
import React from "react";

export const StyledInput = styled('input')(({theme})=>({
    position: 'absolute',
    width: '100%',
    inset: '0 0 0 0',
    opacity: '0',
    cursor: 'pointer',
}));

const Tool = ({ name, Icon, onClick, tools, transform, type, onChange })=>{

    return (
        <React.Fragment>
            {
                tools.find(v => v === name) &&
                <Box onClick={()=>onClick(name)} sx={{ minWidth:'fit-content' }}>
                    <Divider sx={{m: 1}} orientation="vertical" flexItem />
                    <IconButton sx={{ transform: transform }} size="medium" title={name}>
                        <Icon />
                        {type && <StyledInput type={type} onChange={onChange} multiple/>}
                    </IconButton>
                </Box>
            }
        </React.Fragment>
    );
};


export default Tool;