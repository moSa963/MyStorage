import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FileIcon from "./FileIcon";
import { praseTime, sortFiles, sortFolders } from "../../utilities";

const Row = ({ item, type, group_id, selected, onDoubleClick, setSelected, onFileRightClick }) => {

    const handleMouseUp = (e) => {
        if (e.button === 2 && e.currentTarget === e.target) {
            onFileRightClick && onFileRightClick(e, item, type);
        }
    }

    return (
        <TableRow vocab="" selected={selected}
            hover
            sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: "pointer" }}
            onDoubleClick={(e) => onDoubleClick(item, type)}
            onClick={() => setSelected({ item: item, type: type })}
            onMouseUp={handleMouseUp} 
        >
            <TableCell size="small" component="th" scope="row" width={75}><FileIcon file={item} group_id={group_id} type={type} /></TableCell>
            <TableCell size="small" align="center">{item?.name || "-"}</TableCell>
            {item?.original_location && <TableCell size="small" align="center">{item.original_location}</TableCell>}
            <TableCell size="small" align="center">{item?.extension || type}</TableCell>
            <TableCell size="small" align="center">{item?.mime_type || "-"}</TableCell>
            <TableCell size="small" align="center">{item?.size || "-"}</TableCell>
            <TableCell size="small" align="center">{praseTime(item?.created_at) || "-"}</TableCell>
            <TableCell size="small" align="center">{praseTime(item?.updated_at) || "-"}</TableCell>
        </TableRow>
    );
}

const FilesTable = ({ onContainerRightClick,
    selected,
    group,
    filter,
    onFileRightClick,
    onDoubleClick,
    layoutOptions,
    setSelected,
    bin=false,
    directories=[],
    files=[] }) => {

    const handleMouseUp = (e) => {
        if (e.button === 2 && e.currentTarget === e.target) {
            onContainerRightClick && onContainerRightClick(e);
        }
    }

    const handleContainerClick = (e) => {
        if (e.target === e.currentTarget){
            setSelected(null);
        }
    }

    return (
        <TableContainer component={Paper} sx={{ flex: 1, paddingBottom: 25, "::-webkit-scrollbar":{ display: 'none' }  }} onClick={handleContainerClick}>
            <Table sx={{backgroundColor: "inherit" }}>
                <TableHead sx={{ position: "sticky", top: 0, backgroundColor: "inherit" }}>
                    <TableRow onClick={() => setSelected(null)}>
                        <TableCell size="small" onMouseUp={handleMouseUp} align="center">Icon</TableCell>
                        <TableCell size="small" onMouseUp={handleMouseUp} align="center">Name</TableCell>
                        {bin && <TableCell size="small" onMouseUp={handleMouseUp} align="center">Original location</TableCell>}
                        <TableCell size="small" onMouseUp={handleMouseUp} align="center">Extension</TableCell>
                        <TableCell size="small" onMouseUp={handleMouseUp} align="center">Mime Type</TableCell>
                        <TableCell size="small" onMouseUp={handleMouseUp} align="center">Size</TableCell>
                        <TableCell size="small" onMouseUp={handleMouseUp} align="center">Created at</TableCell>
                        <TableCell size="small" onMouseUp={handleMouseUp} align="center">Updated at</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        directories && directories.sort((i1, i2) => sortFolders(i1, i2, layoutOptions?.orderBy || "az"))
                        .filter(e => filter ? e.name.startsWith(filter) : true)
                        .map((item) => 
                        <Row 
                            key={item.id} 
                            item={item} 
                            group_id={group?.id} 
                            selected={selected?.item === item} 
                            type="directory" 
                            onDoubleClick={onDoubleClick}
                            setSelected={setSelected}
                            onFileRightClick={onFileRightClick} />)
                    }
                    {
                        files && files.sort((i1, i2) => sortFiles(i1, i2, layoutOptions?.orderBy || "az", layoutOptions?.sortBy || "name"))
                        .filter(e => filter ? e.name.startsWith(filter) : true)
                        .map((item) => 
                        <Row 
                            key={item.id} 
                            item={item} 
                            group_id={group?.id} 
                            selected={selected?.item === item} 
                            type="file" 
                            onDoubleClick={onDoubleClick}
                            setSelected={setSelected}
                            onFileRightClick={onFileRightClick} />)
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default FilesTable;