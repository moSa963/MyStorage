import React from "react";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import GroupIcon from '@mui/icons-material/Group';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import HorizontalList from "../HorizontalList";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import Tool from "../Tool";
import DialogCard from "../DialogCard";
import { createGroup, deleteGroup, sendGroupRequest, updateGroup } from "../../http/Data";

const ToolBar = ({ tools = [], group, setGroups, setMessage, setType, type }) => {
    const [dialog, setDialogCard] = React.useState();

    const handleAction = (action) => {
        switch (action) {
            case 'New Group': handleNewGroup(group, setGroups, setDialogCard, setMessage); return;
            case 'Rename': handleRename(group, setGroups, setDialogCard, setMessage); return;
            case 'Delete': handleDelete(group, setGroups, setDialogCard, setMessage); return;
            case 'Invite': handleInvite(group, setGroups, setDialogCard, setMessage); return;
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

            <HorizontalList >
                <Tool name="New Group" Icon={GroupIcon} tools={tools} onClick={handleAction} />
                <Tool name="Delete" Icon={RemoveCircleOutlineIcon} tools={tools} onClick={handleAction} />
                <Tool name="Rename" Icon={DriveFileRenameOutlineIcon} tools={tools} onClick={handleAction} />
                <Tool name="Invite" Icon={PermIdentityIcon} tools={tools} onClick={handleAction} />
            </HorizontalList>
        </React.Fragment>

    );
};

const handleDelete = (group, setData, setDialogCard, setMessage) => {
    setDialogCard({
        message: `Do you want to delete this group?`,
        action: async () => {
            const res = await deleteGroup(group.id);

            if (res.ok){
                setData(f => f.filter(e => e.id !== group.id));
                setMessage(`group has been deleted sucessfully.`);
                return;
            }

            const js = await res.json();
            setMessage(js.message);
        },
    });
}

const handleRename = (group, setData, setDialogCard, setMessage) => {
    setDialogCard({
        message: `New name...`,
        with_input: true,
        action: async (input) => {
            const res = await updateGroup(group.id, input);
            const js = await res.json();

            if (res.ok){
                setData(f => f.filter(e => e.id === group.id ? js.data : e));
                setMessage(`group has been renamed sucessfully.`);
                return;
            }

            setMessage(js.message);
        },
    });
}

const handleNewGroup = (group, setData, setDialogCard, setMessage) => {
    setDialogCard({
        message: `New group name...`,
        with_input: true,
        action: async (input) => {
            const res = await createGroup(input, true);
            const js = await res.json();

            if (res.ok){
                setData(f => [...f, js.data]);
                setMessage(`A new group has been created sucessfully.`);
                return;
            }
            setMessage(js.message);
        },
    });
}

const handleInvite = (group, setData, setDialogCard, setMessage) => {
    setDialogCard({
        message: `Invite a user...`,
        with_input: true,
        action: async (input) => {
            const res = await sendGroupRequest(input, group.id, true);
            const js = await res.json();
            if (res.ok){
                setMessage(`${input} has been invited sucessfully.`);
                return;
            }
            setMessage(js.message);
        },
    });
}

export default ToolBar;