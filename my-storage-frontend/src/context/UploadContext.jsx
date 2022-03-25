import { Divider, IconButton, LinearProgress, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import React, { createContext } from "react";
import MinimizeIcon from '@mui/icons-material/Minimize';
import { uploadFile } from "../http/Data";
import CloseIcon from '@mui/icons-material/Close';
import { splitr } from "../utilities";
import { List } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemAvatar } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';

const Root = styled('div')(({ theme }) => ({
    position: 'fixed',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    inset: '0 0 0 0',
    zIndex: 5000,
    color: theme.palette.text.primary,
    pointerEvents: 'none'
}));

const Card = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: 300,
    border: '1px solid ' + theme.palette.divider,
    backgroundColor: theme.palette.background.default,
    pointerEvents: 'all',
}));

const Context = createContext();

const UploadProvider = ({ children }) => {
    const [files, setFiles] = React.useState([]);
    const [uploaded, setUploaded] = React.useState([]);
    const [open, setOpen] = React.useState(true);

    const pushFiles = (newFiles = {}, directory_id) => {
        setFiles([...files, ...(Object.values(newFiles).map(e => {
            const [name, ext] = splitr(e.name, '.');
            return {
                file: e,
                name: name,
                extension: ext,
                directory_id: directory_id,
            }
        }))]);
    }

    const handleFinsh = (file, error) => {
        if (!error && file) {
            setUploaded(f => [...f, file]);
            return;
        }
    }

    const handleClose = (file) => {
        setFiles(f => f.filter(e => e !== file));
    }

    return (
        <Context.Provider value={[uploaded, pushFiles]}>
            {children}
            {
                files.length > 0 &&
                <Root>
                    <Card>
                        <Box sx={{ display: 'flex', alignItems: 'center', pr: 1, pl: 1 }}>
                            <IconButton onClick={() => setOpen(!open)} size="small"><MinimizeIcon /></IconButton>
                            <Typography flex={1} align="center">Uploading</Typography>
                        </Box>
                        <Divider />
                        <List sx={{ maxHeight: open ? 400 : 0, overflow: 'auto', transition: '200ms ease-in-out', "::-webkit-scrollbar":{ display: 'none' } }}>
                            {
                                files.map((e, i) => (
                                    <React.Fragment key={i}>
                                        <UploadingItem file={e} onClose={handleClose} onFinshed={handleFinsh}/>
                                        <Divider sx={{ m: 0.4 }} />
                                    </React.Fragment>
                                ))
                            }
                        </List>
                    </Card>
                </Root>
            }
        </Context.Provider>
    );
}


const UploadingItem = ({ file, onClose, onFinshed }) => {
    const [ajax, setAjax] = React.useState(null);
    const [progress, setProgress] = React.useState(0);
    const [finshed, setFinshed] = React.useState(false);

    React.useEffect(() => {
        if (!finshed && !ajax) {
            const a = uploadFile(file,
                (e) => setProgress((e.loaded / e.total) * 100),
                (e) => handleClose(JSON.parse(e.currentTarget?.response).data, null),
                (e) => handleClose(null, JSON.parse(e.currentTarget.response).message),
                (e) => handleClose(null, JSON.parse(e.currentTarget.response).message));
            setAjax(a);
        }
    }, [onClose, ajax, file, finshed]);

    const handleClose = (file, message)=>{
        setFinshed(true);
        onFinshed(file, message);
    }

    const handleCancel = () => {
        ajax && ajax.abort();
        onClose && onClose(file);
    }

    return (
        <ListItem>
            <ListItemAvatar >
                { finshed ? <FileDownloadDoneIcon /> : <UploadFileIcon /> }
            </ListItemAvatar>
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                <Typography variant="caption" noWrap>{file.name}</Typography>
                {!finshed && <LinearProgress variant="determinate" value={progress} />}
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    {ajax && <IconButton onClick={handleCancel} title="Cancel" sx={{ width: 15, height: 15 }}><CloseIcon sx={{ width: 15, height: 15 }} /></IconButton>}
                </Box>
            </Box>
        </ListItem>
    );
};

export default UploadProvider;

export function useUpload() { return React.useContext(Context) };