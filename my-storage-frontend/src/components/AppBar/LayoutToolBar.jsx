import { Divider, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";


const LayoutToolBar = ({ open, onChange, value })=>{
    const [width, setWidth] = React.useState(open ? 120 : 0);

    const handleChange = (key, v) => {
        v && onChange(key, v);
    };

    React.useEffect(()=>{
        if (open && !width){
            setWidth(120);
        }
    }, [open, width]);

    return (
        <Box onTransitionEnd={()=>setWidth(open ? 120 : 0)} 
            sx={{
                display: 'inline-block',
                transform: `translateY(${open ? 0 : -100}%)`,
                maxWidth: open ? 1000 : 0,
                overflow: 'auto',
                pl: open ? 1 : 0,
                ml: open ? 1 : 0,
                borderLeft: theme=> '1px solid ' + theme.palette.divider,
                '::-webkit-scrollbar':{ display: 'none' },
                transition: '400ms ease-in-out',
        }}>
            <ToggleButtonGroup exclusive fullWidth size="small" title="Size" orientation="vertical" color="secondary"
                value={value.size}
                onChange={(e, v)=>handleChange('size', v)}
                >
                    <ToggleButton value="large" ><p>Large</p></ToggleButton>
                    <ToggleButton value="medium" ><p>Medium</p></ToggleButton>
                    <ToggleButton value="small" ><p>Small</p></ToggleButton>
                    <ToggleButton value="list" ><p>List</p></ToggleButton>
            </ToggleButtonGroup>

            <Divider flexItem orientation="horizontal" sx={{ mx: 0.5, my: 1 }} />

            <ToggleButtonGroup exclusive fullWidth size="small" title="Sort by" orientation="vertical" color="secondary"
                value={value.sortBy}
                onChange={(e, v)=>handleChange('sortBy', v)}
                >
                    <ToggleButton  value="name" ><p>Name</p></ToggleButton>
                    <ToggleButton  value="size" ><p>Size</p></ToggleButton>
                    <ToggleButton  value="type" ><p>Type</p></ToggleButton>
                    <ToggleButton  value="date" ><p>Date</p></ToggleButton>
            </ToggleButtonGroup>

            <Divider flexItem orientation="horizontal" sx={{ mx: 0.5, my: 1 }} />

            <ToggleButtonGroup exclusive fullWidth size="small" title="Order by" orientation="vertical" color="secondary"
                value={value.orderBy}
                onChange={(e, v)=>handleChange('orderBy', v)}
                >
                    <ToggleButton  value="az" ><p>A-z</p></ToggleButton>
                    <ToggleButton  value="za" ><p>Z-a</p></ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
};


export default LayoutToolBar;