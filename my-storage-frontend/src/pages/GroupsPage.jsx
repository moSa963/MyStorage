import { Divider, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import LayoutToolBar from "../components/AppBar/LayoutToolBar";
import SearchBar from "../components/SearchBar";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GroupsContainer from "../components/Groups/GroupsContainer";
import { PageRoot } from "../components/StyledComponents";
import { useNavigate, useLocation } from "react-router-dom";

const GroupsPage = () => {
    const [toolBarOpen, setToolBarOpen] = React.useState(false);
    const [layout, setLayout] = React.useState({sortBy: "name", orderBy: "az", size: "medium"});
    const [filter, setFilter] = React.useState(null);
    const nav = useNavigate();
    const location = useLocation();

    const handleLayoutBarChange = (key, value)=>{
        layout[key] = value;
        setLayout({...layout});
    }

    const handleOpenGroup = (group)=>{
        if (location.pathname !== "/files"){
            nav('/group/' + group.id);
        }
    }

    return (
        <PageRoot>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
                <SearchBar onChange={setFilter}/>
                <IconButton sx={{height: 'fit-content'}} onClick={()=>setToolBarOpen(!toolBarOpen)} size="small">
                    <MoreVertIcon />
                </IconButton> 
            </Box>
            
            <Divider sx={{mb: 1}} orientation="horizontal" flexItem />

            <Box sx={{ display: 'flex', flex: 1, }}>
                <GroupsContainer filter={filter} {...layout} flex={1} width="100%" height="100%" onOpen={handleOpenGroup} />  
                <LayoutToolBar value={layout} onChange={handleLayoutBarChange} open={toolBarOpen}/>
            </Box>
        </PageRoot>
    );
}

export default GroupsPage;