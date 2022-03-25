import { Backdrop, Button, Divider, IconButton, LinearProgress, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import GroupsIcon from "@mui/icons-material/Group";
import LocationBar from "./LocationBar";
import FilesTable from "./Files/FilesTable";
import GroupList from "./Groups/GroupList";
import { loadGroups } from "./Groups/GroupsContainer";
import { useNavigate } from "react-router-dom";


const DirectoryPicker = ({ open, selectFile = false, showGroups, onClose, defaultPath=null, defaultGroup=null }) => {
    const [data, setData] = React.useState(null);
    const [groups, setGroups] = React.useState(null);
    const [selected, setSelected] = React.useState(null);
    const [group, setGroup] = React.useState(defaultGroup);
    const [path, setPath] = React.useState(defaultPath);
    const [processing, setProcessing] = React.useState(false);
    const nav = useNavigate();

    React.useEffect(()=>{
        loadGroups(setGroups, setProcessing, nav);
    }, [nav]);

    React.useEffect(()=>{
        if (!group){
            setData(null);
            setSelected(null);
            setPath(null);
        }
    }, [group]);

    React.useEffect(()=>{
        if (!selected ) {
            return !selectFile && setSelected(data?.parent && {item: data.parent, type: "directory"});
        }
        return selectFile && selected.type === "directory" && setSelected(null);
    }, [selected, data, selectFile]);

    const handleDoubleClick = (value, type) => {
        if (type === "directory"){
            setPath((path || "root") + '/' + value.name);
            setData(null);
            setSelected(null);
        }
    }

    const handleSave = () => {
        if (!selectFile) {
            return onClose(selected ? selected : { item: data.parent, type: 'folder' });
        }
        onClose(selected);
    }

    const handleClose = () => {
        onClose(null);
    }

    const handleGroupChanged = (value) => {
        setGroup(value.id);
        setData(null);
        setSelected(null);
        setPath(value ? "root" : null);
    }

    return (
        <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={Boolean(open)}>
            <Box onClick={(e) => e.currentTarget === e.target && setSelected(null)} sx={{ p: 0.5, position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', height: '100%', maxWidth: 500, backgroundColor: 'background.default', maxHeight: '90%', boxShadow: theme => theme.shadows[5] }}>

                { processing && <LinearProgress sx={{ position: 'absolute', inset: "0 0 0" }} /> }

                <Stack alignItems="center" direction="row">
                    <IconButton disabled={!showGroups} onClick={() => setGroup(null)} size="small" title="Groups"> <GroupsIcon /> </IconButton>
                    <LocationBar onLocationChanged={setPath} group_id={group} location={path} onLoaded={setData} files={data} />
                </Stack>

                <Divider sx={{ m: 1 }} />
                
                {
                    (group || !showGroups) && <FilesTable files={selectFile && data?.files} directories={data?.directories} group={group} onDoubleClick={handleDoubleClick} selected={selected} setSelected={setSelected} />
                }
                {
                    (!group && showGroups) && <GroupList groups={filterGroups(groups)} onGroupDoubleClick={handleGroupChanged} />
                }

                <Divider sx={{ m: 1 }} />

                <Stack p={1} direction="row" width="100%" justifyContent="end" spacing={3}>
                    <Button variant="outlined" color="error" onClick={handleClose}>Cancel</Button>
                    <Button variant="outlined" color="info" onClick={handleSave} disabled={!selected} >Save</Button>
                </Stack>
            </Box>
        </Backdrop>
    );
};

const filterGroups = (groups) => {
    return groups && groups.filter(e => !e.is_master && !e.is_read_only);
}

 
export default DirectoryPicker;