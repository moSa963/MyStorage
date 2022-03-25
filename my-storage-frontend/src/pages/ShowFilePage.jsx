import { LinearProgress, Snackbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import SearchBar from '../components/SearchBar';
import { deleteFile, getFileInfo } from '../http/Data';
import { useAuth } from '../context/AuthContext';
import HorizontalList from '../components/HorizontalList';
import { download, praseTime } from '../utilities';
import FileIcon from "../components/Files/FileIcon";
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { PageRoot } from '../components/StyledComponents';
import Tool from '../components/Tool';
import DialogCard from '../components/DialogCard';
import { useNavigate, useParams } from 'react-router-dom';
import GroupList from '../components/Groups/GroupList';


const Banner = ({ file, group_id, onClick, tools })=>{
    
    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
            <Box sx={{ position: 'relative', display: 'flex', aspectRatio: "1", maxWidth: 100, height: 'fit-content', justifyContent: 'center'}} >
                <FileIcon file={file} group_id={group_id} type="file" />
            </Box>
            <Box sx={{flex: 1, pl: 3, flexWrap: 'wrap', minWidth: 100}}>
                <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
                    <Typography>Name: {file.name}</Typography>
                    <Box sx={{flexGrow: 1}} />
                    <Typography variant="caption">created: {praseTime(file.created_at)}</Typography>
                </Box>
                <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
                    <Typography>Extension: {file.extension}</Typography>
                    <Box sx={{flexGrow: 1}} />
                    <Typography variant="caption">updated: {praseTime(file.updated_at)}</Typography>
                </Box>
                <Typography >Size: {file.size}</Typography>
                <Typography >Mime Type: {file.mime_type}</Typography>
                <Typography >Owner: {file?.user?.username}</Typography>

                <HorizontalList flex={1} >
                    <Tool name="Delete group" Icon={RemoveCircleOutlineIcon} tools={tools} onClick={onClick} />
                    <Tool name="Download" Icon={ArrowCircleDownIcon} tools={tools} onClick={onClick} />
                    <Tool name="Delete" Icon={RemoveCircleOutlineIcon} tools={tools} onClick={onClick}/>
                </HorizontalList>
            </Box>
            
        </Box>
    );
}

const ShowFilePage = ()=>{
    const [processing, setProcessing] = React.useState(true);
    const [file, setFile] = React.useState(null);
    const [groups, setGroups] = React.useState([]);
    const [selectedGroup, setSelectedGroup] = React.useState(null);
    const [message, setMessage] = React.useState(null);
    const [dialog, setDialogCard] = React.useState(null);
    const [filter, setFilter] = React.useState(null);
    const [auth] = useAuth();
    const param = useParams();
    const nav = useNavigate();

    React.useEffect(()=>{
        getFile(param.group_id, param.file_id, setFile, setGroups, setProcessing, nav);
    }, [param, nav]);

    const handleAction = (action)=>{
        switch(action){
            case 'Delete group' : handleDeleteGroup(file, selectedGroup.id, setGroups, setDialogCard, setMessage); return;
            case 'Delete': handleDelete(file, param.group_id, nav, setDialogCard, setMessage); return;
            case 'Download': download(param.group_id, file); return;
            default: return;
        }
    }

    const handleDialogClose = async (ok, input) => {
        ok && await dialog.action(input);
        setDialogCard(null);
    }

    return(
        <PageRoot>
            {processing&&<LinearProgress sx={{position: 'absolute', inset: "0 0 0" }}/>}

            {dialog && <DialogCard message={dialog?.message} onClose={handleDialogClose} open={dialog} withInput={dialog?.with_input} />}

            <Snackbar open={Boolean(message)} onClose={()=>setMessage(null)} message={message} />

            {file && <Banner file={file} group_id={param.group_id} auth={auth} tools={getTools(file, auth, selectedGroup)} onClick={handleAction}/> }

            <Box sx={{ display: 'flex', }}>
                <Box sx={{ flexGrow: 1 }} />
                <SearchBar onChange={setFilter}/>
            </Box>
            
                <GroupList filter={filter} groups={groups} onGroupClick={setSelectedGroup} selected={selectedGroup} onContainerClick={()=>setSelectedGroup(null)}/>
        </PageRoot>
    );
}


const getFile = async (group_id, file_id, setFile, setGroups, setProcessing, nav) => {
    setProcessing(true);
    const res = await getFileInfo(group_id, file_id);

    if (res.ok){
        setProcessing(false);
        const js = await res.json();
        setFile(js.data.file);
        setGroups(js.data.groups);
        return;
    }

    nav('/error/' + res.status + '/' + res.statusText);
}

const handleDelete = async (file, group_id, nav, setDialogCard, setMessage) => {
    setDialogCard({
        message: `Do you want to delete this file?`,
        action: async () => {
            const res = await deleteFile(group_id, file.id);
            const js = await res.json();

            if (res.ok){
                nav('/files/' + group_id + '/root');
                return;
            }
            setMessage(js.message);
        },
    });
}

const handleDeleteGroup = async (file, group_id, setGroups, setDialogCard, setMessage) => {
    setDialogCard({
        message: `Do you want to delete this file from this group?`,
        action: async () => {
            const res = await deleteFile(group_id, file.id);

            if (res.ok){
                setGroups(groups => groups.filter(e => e.id !== group_id));
                return;
            }

            const js = await res.json();
            setMessage(js.message);
        },
    });
}

const getTools = (file, auth, selectedGroup) => {
    if (auth?.user && auth.user.username === file.user.username){
        return selectedGroup ? ['Delete group'] : ['Delete', 'Download'];
    }

    return ['Download'];
}
export default ShowFilePage;