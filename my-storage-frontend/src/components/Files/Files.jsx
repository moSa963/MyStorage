import React from "react";
import { sortFiles, sortFolders } from "../../utilities";
import File from "./File";
import Grid from "../Grid";


const Files = ({ onContainerRightClick,
    selected,
    filter,
    group,
    onFileRightClick,
    onDoubleClick,
    layoutOptions,
    setSelected,
    directories,
    files }) => {

    const handleContainerClick = (e) => {
        if (e.target === e.currentTarget) {
            setSelected(null);
        }
    }

    return (
        <Grid onClick={handleContainerClick} onRightClick={onContainerRightClick}>
            {
                directories && directories.sort((i1, i2) => sortFolders(i1, i2, layoutOptions.orderBy))
                .filter(e => filter ? e.name.startsWith(filter) : true)
                .map((e, i) =>
                    <File
                        key={e.id}
                        file={e}
                        size={layoutOptions.size}
                        type="directory"
                        selected={selected?.item === e}
                        onDoubleClick={(e, f) => onDoubleClick(f, 'folder')}
                        onRightClick={(e, f) => onFileRightClick(e, f, 'folder')}
                        onClick={(e, f) => setSelected({ item: f, type: 'folder' })} />)
            }
            {
                files && files.sort((i1, i2) => sortFiles(i1, i2, layoutOptions.orderBy, layoutOptions.sortBy))
                .filter(e => filter ? e.name.startsWith(filter) : true)
                .map((e, i) =>
                    <File
                        key={e.id}
                        file={e}
                        size={layoutOptions.size}
                        type="file"
                        group_id={group?.id}
                        selected={selected?.item === e}
                        onDoubleClick={(e, f) => onDoubleClick(f, 'file')}
                        onRightClick={(e, f) => onFileRightClick(e, f, 'file')}
                        onClick={(e, f) => setSelected({ item: f, type: 'file' })} />)
            }
        </Grid>
    );
};

export default Files;