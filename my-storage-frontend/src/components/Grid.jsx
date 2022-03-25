import React from "react";
import { styled } from "@mui/material/styles";
import { Stack } from "@mui/material";
import { Box } from "@mui/system";

const Root = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    margin: 0,
    flex: 1,
    width: "100%",
    padding: 10,
    "::-webkit-scrollbar":{ display: 'none' }
}));

const Grid = ({ children, onClick, onRightClick }) => {
    const [mouseDown, setMouseDown] = React.useState(false);

    const handleMouseDown = (e) => {
        if (e.button === 2 && e.currentTarget === e.target) {
            setMouseDown(true);
        }
    }

    const handleMouseUp = (e) => {
        if (e.button === 2 && e.currentTarget === e.target && mouseDown) {
            onRightClick && onRightClick(e);
        }
        setMouseDown(false);
    }

    const handleClick = (e) => {
        if (e.currentTarget === e.target) {
            onClick && onClick(true);
        }
    }

    return (
        <Root onClick={handleClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
            <Stack justifyContent={{ xs: "center", sm: "flex-start" }} 
                onClick={handleClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}
                flexWrap="wrap"
                direction="row"
                overflow="auto" >
                {children}
            </Stack>
        </Root>
    );
}


export default Grid;