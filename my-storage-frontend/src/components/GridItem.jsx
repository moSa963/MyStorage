import { Tooltip } from "@mui/material";
import { alpha, styled } from "@mui/system";
import React from "react";

const Root = styled('div')(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    overflow: 'hidden',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    height: 'fit-content',
    ":after":{
        content: "''",
        position: 'absolute',
        zIndex: 2,
        inset: '0 0 0 0',
    },
    ":before": {
        content: "''",
        display: 'none',
        position: 'absolute',
        inset: '0 0 0 0',
        backgroundColor: alpha(theme.palette.primary.main, 0.5),
        borderColor: theme.palette.primary.dark,
        borderWidth: 1,
        borderStyle: 'solid',
    },
    ":hover:after":{
        backgroundColor: alpha(theme.palette.primary.main, 0.3),
        borderColor: theme.palette.primary.dark,
        borderWidth: 1,
        borderStyle: 'solid',
    },
}));


const Item = ({ selected, onClick, children, draggable, maxWidth, direction = 'column', onRightMouseClick, onDoubleClick, title })=>{

    const handleClick = (event)=>{
        event.stopPropagation();
        onClick&&onClick(event);
    }

    const handleMouseUp = (e)=>{
        switch(e.button){
            case 2: onRightMouseClick&&onRightMouseClick(e);  return;
            default:  return;
        }
    }

    return (
        <Tooltip enterDelay={2000} title={title}>
            <Root draggable={draggable} sx={{ 
                padding: 0.5,
                width: maxWidth,
                flexDirection: direction,
                ":before":{ display: selected ? "block" : 'none' } 
            }} 
                onMouseUp={handleMouseUp}
                onClick={handleClick}
                onDoubleClick={onDoubleClick}
            >
                {children}
            </Root>
        </Tooltip>
    );
}

export default Item;