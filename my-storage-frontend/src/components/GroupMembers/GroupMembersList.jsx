import React from "react";
import { deleteMember, updateMemberPermission } from "../../http/Data";
import GroupMember from "./GroupMember";
import { Root } from "../Groups/GroupList";


const GroupMembersList = ({ users, isOwner, group, setUsers, setMessage, onContainerClick }) => {

    const handleClick = (e) => {
        if (e.currentTarget === e.target){
            onContainerClick && onContainerClick();
        }
    }

    const handelAction = (user, action) => {
        switch(action){
            case "Delete": handleDelete(user, setUsers, group, setMessage); return;
            case "Write": handleWrite(user, setUsers, group, setMessage); return;
            default: return;
        }
    }
    
    return (
        <Root sx={{ width: "100%", flex: 1 }} onClick={handleClick}>
            {
                users.map((e, i) => <GroupMember key={e.id} user={e} isOwner={isOwner} onAction={handelAction} />)
            }
        </Root>
    );
}

const handleDelete = async (user, setUsers, group, setMessage) => {
    const res = await deleteMember(user.id);

    if (res.ok){
        setUsers(users => users.filter(e => e.id !== user.id));
        return;
    }

    const js = await res.json();
    setMessage(js.message);
}

const handleWrite = async (user, setUsers, group, setMessage) => {
    const res = await updateMemberPermission(user.id, !user.is_read_only);

    if (res.ok){
        setUsers(users => users.map(e => {
            if (e.id === user.id){
                e.is_read_only = !e.is_read_only
            }
            return e;
        }));
        return;
    }

    const js = await res.json();
    setMessage(js.message);
}

export default GroupMembersList;