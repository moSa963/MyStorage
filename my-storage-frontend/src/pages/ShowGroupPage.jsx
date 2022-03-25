import React from 'react';
import { Grid, InputLabel, LinearProgress, Snackbar, Switch, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { deleteGroup, getGroup, sendGroupRequest, updateGroup } from '../http/Data';
import { useAuth } from '../context/AuthContext';
import HorizontalList from '../components/HorizontalList';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import { praseTime } from '../utilities';
import { BASE_URL } from '../http/Request';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { PageRoot, StyledFillInput, StyledImg } from '../components/StyledComponents';
import GroupMembersList from '../components/GroupMembers/GroupMembersList';
import Tool from '../components/Tool';
import DialogCard from '../components/DialogCard';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { useNavigate, useParams } from "react-router-dom";

const ToolsBar = ({ tools = [], group, setGroup, setMessage, nav }) => {
    const [dialog, setDialogCard] = React.useState(null);

    const handleAction = (action) => {
        switch (action) {
            case 'Files': nav('/files/' + group.id + '/root'); return;
            case 'Rename': handleRename(group, setGroup, setDialogCard, setMessage); return;
            case 'Delete': handleDelete(group, nav, setDialogCard, setMessage); return;
            case 'Invite': handleInvite(group, setDialogCard, setMessage); return;
            default: return;
        }
    }

    const handleDialogClose = async (ok, input) => {
        ok && await dialog.action(input);
        setDialogCard(null);
    }

    return (
        <React.Fragment>
            {dialog && <DialogCard message={dialog?.message} onClose={handleDialogClose} open={dialog} withInput={dialog?.with_input} />}

            <HorizontalList>
                <Tool name="Files" Icon={OpenInBrowserIcon} tools={tools} onClick={handleAction} />
                <Tool name="Delete" Icon={RemoveCircleOutlineIcon} tools={tools} onClick={handleAction} />
                <Tool name="Rename" Icon={DriveFileRenameOutlineIcon} tools={tools} onClick={handleAction} />
                <Tool name="Invite" Icon={PermIdentityIcon} tools={tools} onClick={handleAction} />
            </HorizontalList>
        </React.Fragment>
    );
}

const ShowGroupPage = () => {
    const [group, setGroup] = React.useState(null);
    const [processing, setProcessing] = React.useState(true);
    const [message, setMessage] = React.useState(null);
    const [members, setMembers] = React.useState([]);
    const [auth] = useAuth();
    const params = useParams();
    const nav = useNavigate();

    const owner = Boolean(group && auth?.user && group.user_id === auth.user.id);

    React.useEffect(() => {
        loadGroup(params.id, setGroup, setMembers, nav, setProcessing);
    }, [nav, params.id]);

    const handleImageChange = (event) => {
        !processing && updateImage(group, setProcessing, event.currentTarget.files[0]);
    }


    return (
        <PageRoot>
            <Snackbar open={Boolean(message)} onClose={() => setMessage(null)} message={message} />

            {processing && <LinearProgress sx={{ position: 'absolute', inset: "0 0 0" }} />}

            {
                group &&
                <React.Fragment>
                    <Grid container columns={2}>
                        <Grid item xs={2} md={1} sx={{ display: "flex", alignItems: "center" }}>
                            <Box sx={{ position: 'relative', width: 75, display: "block" }} >
                                <StyledImg  src={BASE_URL + 'api/image/group/' + group?.id} />
                                {owner && <StyledFillInput type="file" onChange={handleImageChange} accept="image/*" />}
                            </Box>
                            <Typography >{group?.name}</Typography>
                        </Grid>
                        <Grid item xs={2} md={1}>
                            <Typography>@{group?.user?.username}</Typography>
                            <Typography>created: {praseTime(group?.created_at)}</Typography>
                            <InputLabel sx={{ display: "inline" }}>Private: </InputLabel>
                            <Switch  disabled={Boolean(!owner || group?.is_master)} checked={Boolean(group?.private)} onChange={() => handlePrivate(group, setGroup)} />
                        </Grid>
                        <Grid item xs={2}>
                            <ToolsBar group={group} setGroup={setGroup} setMessage={setMessage} tools={getToolsOptions(owner, group)} nav={nav} />
                        </Grid>
                    </Grid>

                    <GroupMembersList users={members} isOwner={owner} group={group} setUsers={setMembers} setMessage={setMessage} />
                </React.Fragment>
            }
        </PageRoot>
    );
}

const handleDelete = (group, nav, setDialogCard, setMessage) => {
    setDialogCard({
        message: `Do you want to delete this group?`,
        action: async () => {
            const res = await deleteGroup(group.id);

            if (res.ok) {
                nav('/groups');
                return;
            }

            const js = await res.json();
            setMessage(js.message);
        },
    });
}

const handleRename = (group, setGroup, setDialogCard, setMessage) => {
    setDialogCard({
        message: `New name...`,
        with_input: true,
        action: async (input) => {
            const res = await updateGroup(group.id, input);

            if (res.ok) {
                setGroup({ ...group, name: input });
                setMessage(`group has been renamed sucessfully.`);
                return;
            }

            const js = await res.json();
            setMessage(js.message);
        },
    });
}

const loadGroup = async (id, setGroup, setMembers, nav, setProcessing) => {
    setProcessing(true);

    const res = await getGroup(id);
    const js = await res.json();

    if (res.ok) {
        setGroup(js.data.group);
        setMembers(js.data.members);
        setProcessing(false);
        return;
    }

    nav('/error/' + res.status + '/' + res.statusText);
}

const updateImage = async (group, setProcessing, image) => {
    setProcessing(true);
    const res = await updateGroup(group.id, null, null, image);
    if (res.ok) {
        window.location.reload();
    }
}

const handlePrivate = async (group, setGroup) => {
    const res = await updateGroup(group.id, null, !group?.private);

    if (res.ok) {
        setGroup(g => ({ ...g, private: !group?.private }));
        return;
    }
}

const handleInvite = (group, setDialogCard, setMessage) => {
    setDialogCard({
        message: `Invite a user...`,
        with_input: true,
        action: async (input) => {
            const res = await sendGroupRequest(input, group.id, true);
            if (res.ok) {
                setMessage(`${input} has been invited sucessfully.`);
                return;
            }

            const js = await res.json();
            setMessage(js.message);
        },
    });
}

const getToolsOptions = (owner, group) => {
    if (!owner) {
        return ["Files"];
    }

    if (group?.is_master) {
        return ["Files", "Rename"];
    }

    return ["Files", "Delete", "Rename", "Invite", "Private"];
}

export default ShowGroupPage;