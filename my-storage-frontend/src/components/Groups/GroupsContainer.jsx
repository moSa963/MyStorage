import { LinearProgress, Snackbar, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { getGroups } from "../../http/Data";
import { useAuth } from '../../context/AuthContext';
import ToolBar from "./GroupsToolBar";
import GroupList from "./GroupList";
import { useNavigate } from "react-router-dom";


const GroupsContainer = ({ orderBy = "az", onOpen }) => {
    const [groups, setGroups] = React.useState([]);
    const [selected, setSelected] = React.useState(null);
    const [type, setType] = React.useState("mine");
    const [tools, setTools] = React.useState(['New Group']);
    const [processing, setProcessing] = React.useState(false);
    const [message, setMessage] = React.useState(null);
    const [auth] = useAuth();
    const nav = useNavigate();


    React.useEffect(() => {
        loadGroups(setGroups, setProcessing, nav);
    }, [nav]);

    React.useEffect(() => {
        setTools(getToolsOptions(type, selected));
    }, [selected, type]);

    const handleClick = (group) => {
        setSelected(group);
    }

    const handleTypeChange = (e, v) => {
        v && setType(v);
        setSelected(null);
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, width: "100%" }}>

            {processing && <LinearProgress sx={{ position: 'absolute', inset: "0 0 0" }} />}

            <Snackbar open={Boolean(message)} onClose={() => setMessage(null)} message={message} />

            <Stack direction="row" alignItems="center">
                <ToggleButtonGroup sx={{ height: "fit-content" }} size="small"  color="info" exclusive value={type}
                    onChange={handleTypeChange} >
                    <ToggleButton value="mine" >Mine</ToggleButton>
                    <ToggleButton value="joined" >Joined</ToggleButton>
                </ToggleButtonGroup>

                <ToolBar group={selected} setGroups={setGroups} setMessage={setMessage} tools={tools} />
            </Stack>

            <GroupList
                onContainerClick={() => { setSelected(null) }}
                onContainerRightClick={handleClick}
                groups={filter(type, groups, auth?.user)}
                onGroupDoubleClick={onOpen}
                onGroupRightClick={handleClick}
                selected={selected}
                orderBy={orderBy}
                onGroupClick={setSelected}
            />
        </Box>
    );
}

const getToolsOptions = (type, selected) => {
    if (type === "joined") {
        return selected ? ['Delete'] : [];
    }
    return selected ? (selected.is_master ? ['Open', 'Rename',] : ['Open', 'Invite', 'Delete']) : ['New Group'];
}

export const loadGroups = async (setGroups, setProcessing, nav) => {
    setProcessing(true);

    const res = await getGroups();

    if (res.ok) {
        const js = await res.json();
        setGroups(js.data);
        setProcessing(false);
        return;
    }

    nav('/error/' + res.status + '/' + res.statusText);
}

const filter = (type, groups, auth_user) => {
    if (type === "mine") {
        return groups.filter(e => e?.user_id === auth_user.id);
    }

    return groups.filter(e => e?.user_id !== auth_user.id);
}

export default GroupsContainer;