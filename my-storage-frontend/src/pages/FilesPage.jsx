import { Divider, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import LayoutToolBar from "../components/AppBar/LayoutToolBar";
import LocationBar from "../components/LocationBar";
import SearchBar from "../components/SearchBar";
import FilesContainer from "../components/Files/FilesContainer";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GroupsIcon from '@mui/icons-material/Groups';
import { PageRoot } from "../components/StyledComponents";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GroupList from "../components/Groups/GroupList";
import { loadGroups } from "../components/Groups/GroupsContainer";

const FilesPage = () => {
    const [groups, setGroups] = React.useState([]);
    const [files, setFiles] = React.useState({ files:[], directories:[], parent:null, group:null });
    const [filter, setFilter] = React.useState(null);
    const [toolBarOpen, setToolBarOpen] = React.useState(false);
    const [layoutOptions, setLayoutOptions] = React.useState({ sortBy: "name", orderBy: "az", size: "medium" });
    const { group, ...rest } = useParams();
    const path = rest["*"] === undefined ? null : "root" + (rest["*"] === "" ? "" : "/" + rest["*"]);
    const nav = useNavigate();
    const location = useLocation();

    React.useEffect(()=>{
        loadGroups(setGroups, ()=>{}, nav);
    }, [nav]);

    const handleToolBarChange = (key, value) => {
        layoutOptions[key] = value;
        setLayoutOptions({ ...layoutOptions });
    }

    const handleGroupsClicked = () => {
        if (location.pathname !== "/files") {
            nav('/files');
        }
    }

    const handleGroupOpen = (group) => {
        setFiles({ files:[], directories:[], parent:null, group:null });
        nav('/files/' + group.id + "/root");
    }

    const handleLocationChanged = (loc) => {
        nav(location.pathname.split('root')[0] + loc);
    }

    return (
        <PageRoot>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                <IconButton sx={{ height: 'fit-content' }} onClick={handleGroupsClicked} size="small" title="Groups">
                    <GroupsIcon />
                </IconButton>
                <LocationBar onLocationChanged={handleLocationChanged}
                    group_id={group}
                    location={path}
                    onLoaded={setFiles} />
                <SearchBar onChange={setFilter}/>
                <IconButton sx={{ height: 'fit-content' }} onClick={() => setToolBarOpen(!toolBarOpen)} size="small">
                    <MoreVertIcon />
                </IconButton>
            </Box>

            <Divider sx={{ mb: 1 }} orientation="horizontal" flexItem />

            <Box sx={{ display: 'flex', flex: 1, }}>
                {
                    path && <FilesContainer filter={filter} layoutOptions={layoutOptions} setData={setFiles} data={files} />
                }
                {
                    !path && <GroupList filter={filter} onGroupDoubleClick={handleGroupOpen} groups={groups} />
                }
                <LayoutToolBar value={layoutOptions} onChange={handleToolBarChange} open={toolBarOpen} />
            </Box>
        </PageRoot>
    );
}


export default FilesPage;