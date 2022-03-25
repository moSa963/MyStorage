import { List } from "@mui/material";
import { styled } from "@mui/system";
import React from "react";
import { sortGroups } from "../../utilities";
import Group from "./Group";

export const Root = styled(List)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    margin: 0,
    flex: 1,
    width: "100%",
    padding: 10,
    "::-webkit-scrollbar":{ display: 'none' }
}));


const GroupList = ({ onContainerClick, filter, onContainerRightClick, groups=[], orderBy, onGroupDoubleClick, onGroupRightClick, selected, onGroupClick }) => {

    const handleClick = (e) => {
        if (e.currentTarget === e.target){
            onContainerClick && onContainerClick();
        }
    }
        
    return (
        <Root sx={{ width: "100%", flex: 1 }} onClick={handleClick}>
            {
                groups && groups.filter(e => filter ? e.name.startsWith(filter) : true)
                .sort((i1, i2) => orderBy ? sortGroups(i1, i2, orderBy) : true)
                .map((e, i) => 
                    <Group
                        key={i}
                        group={e}
                        onDoubleClick={onGroupDoubleClick}
                        onRightClick={onGroupRightClick}
                        selected={selected === e}
                        onClick={onGroupClick}
                    />)
            }
        </Root>
    );
};


export default GroupList;