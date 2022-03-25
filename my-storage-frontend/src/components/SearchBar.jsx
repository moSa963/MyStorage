import { IconButton, Input } from "@mui/material";
import { Box, styled } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";

const StyledInput = styled(Input)(({ theme }) => ({
    width: '100%',
    height: '100%',
    outline: 'none',
}));

const SearchBar = ({ onChange })=>{
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('');

    React.useEffect(()=>{
        const timeout = setTimeout(() => {
            onChange&&onChange(value === '' ? null : value);
        }, 200);
        return ()=>{
            clearTimeout(timeout);
        }
    }, [value, onChange]);

    const handleClick = () => {
        setValue('');
        setOpen(!open);
    }

    return (
        <Box sx={{
            maxWidth: '100%',
            display: "flex",
            overflow: 'hidden',
        }}>
            <Box sx={{
                width: open ? 400 : 0,
                maxWidth: '100%',
                transition: '100ms ease-in-out',
            }}>
                <StyledInput placeholder="Search..." value={value} onChange={(e)=>setValue(e.currentTarget.value)}/>
            </Box>
            <IconButton sx={{height: 'fit-content'}} onClick={handleClick} size="small">
                <SearchIcon />
            </IconButton>
        </Box>
    );
};

export default SearchBar;