import React from 'react';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ShareIcon from '@mui/icons-material/Share';
import HorizontalList from "../HorizontalList";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import Tool from "../../components/Tool";
import DirectoryPicker from "../../components/DirectoryPicker";
import DialogCard from "../../components/DialogCard";
import { download } from "../../utilities";
import { createFolder, deleteFile, deleteFolder, moveFile, moveFolder, referenceFile, updateFile, updateFolder } from '../../http/Data';

const ToolBar = ({ selected, parent, group, setData, setMessage, tools, onUpload, onOpen }) => {
    const [dialog, setDialogCard] = React.useState(null);
    const [picker, setPicker] = React.useState(null);

    
    const handleAction = (action) => {
        switch (action) {
            case 'Delete': handleDelete(selected, group, setData, setDialogCard, setMessage); return; 
            case 'Rename': handleRename(selected, setData, setDialogCard, setMessage); return;
            case 'New Folder': createNewFolder(parent, setData, setDialogCard, setMessage); return;
            case 'Move': handleMove(selected, parent, group, setPicker, setData, setMessage); return;
            case 'Reference': handleReference(selected?.item || parent, setData, setPicker, setMessage); return;
            case 'Share': handleShare(selected.item, setPicker, setMessage); return;
            case 'Download': download(group.id, selected.item); return;
            case 'Open': onOpen(selected.item, selected.type); return;
            default: return;
        }
    }

    const handleDialogClose = async (ok, input) => {
        ok && await dialog.action(input);
        setDialogCard(null);
    }

    const handlePickerClose = async (item) => {
        item && await picker.action(item);
        setPicker(null);
    }

    return (
        <React.Fragment>
            {dialog && <DialogCard message={dialog?.message} onClose={handleDialogClose} open={dialog} withInput={dialog?.with_input} />}

            {picker && <DirectoryPicker open={picker} selectFile={picker?.select_file} showGroups={picker?.show_groups} onClose={handlePickerClose} defaultPath={picker?.default_path} defaultGroup={picker?.default_group} />}

            <HorizontalList>
                <Tool name="New Folder" Icon={CreateNewFolderIcon} tools={tools} onClick={handleAction} />
                <Tool name="Delete" Icon={RemoveCircleOutlineIcon} tools={tools} onClick={handleAction} />
                <Tool name="Rename" Icon={DriveFileRenameOutlineIcon} tools={tools} onClick={handleAction} />
                <Tool name="Move" Icon={DriveFileMoveIcon} tools={tools} onClick={handleAction} />
                <Tool name="Reference" Icon={DriveFileMoveIcon} tools={tools} onClick={handleAction} transform="rotateY(190deg)" />
                <Tool name="Share" Icon={ShareIcon} tools={tools} onClick={handleAction} />
                <Tool name="Upload" Icon={UploadFileIcon} tools={tools} onClick={handleAction} type="file" onChange={onUpload} />
                <Tool name="Download" Icon={ArrowCircleDownIcon} tools={tools} onClick={handleAction} />
            </HorizontalList>
        </React.Fragment>

    );
};

const handleDelete = (selected, group, setData, setDialogCard, setMessage) => {
    const action = async () => {
        return selected.type === "file" ? deleteFile(group.id, selected.item?.id) : deleteFolder(selected.item.id)
    }

    setDialogCard({
        message: `Do you want to delete this ${selected.type}?`,
        action: async () => {
            const res = await action();

            if (res.ok){
                selected.type === "file" ? setData(d => ({...d, files: d.files.filter(e => e.id !== selected.item.id)})) : setData(d => ({...d, directories: d.directories.filter(e => e.id !== selected.item.id)}));
                setMessage(`${selected.type} has been deleted sucessfully.`);
                return;
            }
            const js = await res.json();

            setMessage(js.message);
        },
    });
}

const handleRename = (item, setData, setDialogCard, setMessage) => {
    const action = async (name) => {
        return item.type === 'file' ? updateFile(item.item.id, name) : updateFolder(item.item.id, name);
    }

    setDialogCard({
        message: "New name...",
        with_input: true,
        action: async (input) => {
            const res = await action(input);
            const js = await res.json();

            if (res.ok){
                item.type === "file" ? setData(d => ({...d, files: d.files.map(e => e.id === js.data.id ? js.data : e)}))
                : setData(d => ({...d, directories: d.directories.map(e => e.id === js.data.id ? js.data : e)}));
                setMessage(`${item.type} has been renamed.`);
                return;
            }

            setMessage(js.message);
        },
    });
}

const createNewFolder = (parent, setData, setDialogCard, setMessage) => {
    setDialogCard({
        message: "New Folder...",
        with_input: true,
        action: async (input) => {
            const res = await createFolder(parent.group_id, parent.id, input);
            const js = await res.json();

            if (res.ok){
                setData(d => ({...d, directories: [...d.directories, js.data]}));
                setMessage("folder has been created.");
                return;
            }

            setMessage(js.message);
        },
    });
}

const handleMove = (selected, parent, group, setPicker, setData, setMessage) => {
    setPicker({
        select_file: false,
        show_groups: false,
        default_path: parent.location + "/" + parent.name,
        default_group: group.id,
        action: async (input) => {
            const res = await (selected.type === "file" ? moveFile(selected.item.id, parent.id, input.item.id) : moveFolder(selected.item.id, input.item.id));
            if (res.ok){
                selected.type === "file" ? 
                    setData(d => ({...d, files: d.files.filter(e => e.id !== selected.item.id)}))
                    : setData(d => ({...d, directories: d.directories.filter(e => e.id !== selected.item.id)}));
                return;
            }

            const js = await res.json();
            setMessage(js.message);
        }
    });
}

const handleShare = (file, setPicker, setMessage) => {
    setPicker({
        show_groups: true,
        action: async (input) => {
            const res = await referenceFile(file.id, input.item.id);
            if (res.ok){
                setMessage("file has been shared.");
                return;
            }
            const js = await res.json();
            setMessage(js.message);
        }
    });
}

const handleReference = (folder, setData, setPicker, setMessage) => {
    setPicker({
        select_file: true,
        show_groups: false,
        default_path: "root",
        default_group: null,
        action: async (input) => {
            const res = await referenceFile(input.item.id, folder.id);
            const js = await res.json();

            if (res.ok){
                setData(f => ({ ...f, files: [...f.files, js.data] }));
                return;
            }
            setMessage(js.message);
        }
    });
}

export default ToolBar;