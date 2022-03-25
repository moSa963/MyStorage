import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import FileIcon from "./FileIcon";
import { ItemSizes } from "../../utilities";
import Item from "../GridItem";


const File = ({ size, selected, onClick, onDoubleClick, onRightClick, file, type = 'file', group_id }) => {

    return (
        <Item selected={selected}
            maxWidth={ItemSizes[size].width}
            onRightMouseClick={(e) => onRightClick && onRightClick(e, file)}
            onClick={(event) => onClick && onClick(event, file)}
            onDoubleClick={(e) => { onDoubleClick && onDoubleClick(e, file) }}
            title={createTitle(file)}
        >
            <Box sx={{
                position: 'relative', display: 'flex', height: "100%", zIndex: 1, aspectRatio: "1",
                width: ItemSizes[size].iconWidth,
            }} >
                <FileIcon file={file} type={type} group_id={group_id} />
            </Box>
            <Box sx={{ width: '100%', zIndex: 1, flex: 1 }}>
                <Typography sx={{ width: '100%', fontSize: ItemSizes[size].fontSize, }}
                    noWrap={true}>
                    {file.name + (file.extension ? '.' + file.extension : '')}
                </Typography>
            </Box>
        </Item>
    );
}

const createTitle = (file) => {
    return (
        <>
            <p>name: {file.name}</p>
            <p>extension: {file?.extension || '-'}</p>
            <p>size: {file?.size || '-'}</p>
            <p>original location: {file?.original_location || '-'}</p>
            <p>created_at: {file?.created_at || '-'}</p>
            <p>updated_at: {file?.updated_at || '-'}</p>
        </>
    )
}

export default File;