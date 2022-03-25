import { Box, styled } from "@mui/system";
import React from "react";
import Folder from "@mui/icons-material/Folder";
import TextSnippet from "@mui/icons-material/TextSnippet";
import { BASE_URL } from "../../http/Request";
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import ImageIcon from '@mui/icons-material/Image';

const StyledImg = styled('img')(({theme})=>({
    width: '100%',
    objectFit: 'contain',
}));

const FileIcon = ({ type, file, group_id })=>{
    const [icon, setIcon] = React.useState();

    React.useEffect(()=>{
        loadIcon(setIcon, type, file, group_id);
    }, [type, file, group_id]);

    return (
        <Box sx={{
            display: 'flex',
            width: '100%',
            minHeight: '100%',
        }} >
            { icon }
        </Box>
    );
}

const loadIcon = async (setIcon, type, file, group_id)=>{
    if (type === 'directory'){
        setIcon(<Folder color="info" sx={{ width: '100%', height: '100%', }} />);
        return;
    }

    const mimeType = file.mime_type.split('/', 2)[0];

    switch(mimeType){
        case 'text' : setIcon(<TextSnippet color="info" sx={{ width: '100%', height: '100%', }} />); return;
        case 'image' : setIcon(group_id ? <StyledImg src={BASE_URL + 'api/group/' + group_id + "/file/" + file.id} /> : <ImageIcon color="info" sx={{ width: '100%', height: '100%', }} />); return;
        case 'audio' : setIcon(<AudiotrackIcon color="info" sx={{ width: '100%', height: '100%', }} />); return;
        default: setIcon(<TextSnippet color="info" sx={{ width: '100%', height: '100%', }} />);
    }
}

export default FileIcon;