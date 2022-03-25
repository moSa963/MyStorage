import React from "react";
import { Box, Snackbar } from "@mui/material";
import { useUpload } from "../../context/UploadContext";
import Files from "./Files";
import FilesTable from "./FilesTable";
import ToolBar from "./FilesToolBar";
import { useLocation, useNavigate } from "react-router-dom";

const FilesList = (props) => {
    if (props.layoutOptions.size === "list") {
        return <FilesTable {...props} />
    }
    return <Files {...props} />
}

const FilesContainer = ({ data, filter, setData, layoutOptions }) => {
    const {files, directories, parent, group} = data;
    const [selected, setSelected] = React.useState(null);
    const [menu, setMenu] = React.useState({ position: null, type: null });
    const [tools, setTools] = React.useState([]);
    const [message, setMessage] = React.useState(null);
    const [uploaded, pushFiles] = useUpload();
    const nav = useNavigate();
    const location = useLocation();

    React.useEffect(()=>{
        setData(f => ({...f, files: [...f.files, ...(uploaded.filter(u => !f.files.find(file => file.id === u.id)))]}));
    }, [uploaded, setData]);

    React.useEffect(() => {
        setSelected(null);
    }, [parent]);

    React.useEffect(() => {
        setTools(getToolsOptions(group, selected));
    }, [selected, group]);

    const handleContainerRightClick = (e) => {
        setSelected(null);
    }

    const handleFileRightClick = (e, f, type) => {
        setSelected({ item: f, type: 'file' });
    }

    const handleDoubleClick = (file, type) => {
        const url = type === 'folder' ? `${location.pathname}/${file.name}` : `/file/${group.id}/${file.id}`;
        nav(url)
    }

    const handleUpload = (event) => {
        pushFiles(event.currentTarget.files, parent.id);
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, width: "100%" }} >
            <Snackbar open={Boolean(message)} onClose={() => setMessage(null)} message={message} />

            <ToolBar parent={parent} 
                selected={selected} 
                group={group}
                setData={setData}
                setMessage={setMessage}
                menu={menu}
                setSelected={setSelected} 
                tools={tools}
                onMenuClose={()=>setMenu(null)}
                onOpen={handleDoubleClick}
                onUpload={handleUpload} />

            <FilesList
                filter={filter}
                directories={directories}
                files={files}
                onContainerRightClick={handleContainerRightClick}
                onFileRightClick={handleFileRightClick}
                selected={selected}
                setSelected={setSelected}
                layoutOptions={layoutOptions}
                group={group}
                onDoubleClick={handleDoubleClick}
            />
        </Box>
    );
}

const getToolsOptions = (group, selected) => {
    if (!group || group.is_read_only) {
        return [];
    }

    if (!selected) {
        return group.is_master ? ['New Folder', 'Upload'] : ['New Folder', 'Reference'];
    }

    if (group.is_master) {
        return selected.type === 'file' ? ['Open', 'Move', 'Delete', 'Rename', 'Share', 'Download'] : ['Move', 'Delete', 'Rename'];
    }

    return selected.type === 'file' ? ['Move', 'Delete', 'Download'] : ['Move', 'Delete'];
}

export default FilesContainer;