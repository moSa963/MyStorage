import { Backdrop, Button, Divider, LinearProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import React from "react";


const DialogCard = ({ open, onClose, message, withInput=false })=>{
    const [prosessing, setProsessing] = React.useState(false);
    const [input, setInput] = React.useState("");

    const handleSuccess = ()=>{
        if (!prosessing){
            setProsessing(true);
            onClose(true, withInput ? input : null);
        }
    }

    const handleFailure = ()=>{
        setProsessing(true);
        onClose && onClose(false, null);
    }

    return (
        <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} onClose={handleFailure} open={Boolean(open)}>
            <Paper color="background.default" sx={{
                position: 'relative',
                width: '100%',
                maxWidth: 500,
                p: 2,
            }}>
                {prosessing && <LinearProgress sx={{position: 'absolute', inset: "0 0 0"}}/>}
                <Typography m={1} variant="h5">{message}</Typography>
                <Divider sx={{m: 1}} flexItem/>
                {
                    withInput && 
                    <TextField disabled={prosessing} color="secondary" variant="filled" fullWidth onChange={(e)=>setInput(e.currentTarget.value)} value={input} />
                }
                <Stack p={1} direction="row" spacing={5} justifyContent="end" width="100%" >
                    <Button disabled={prosessing} variant="outlined" color="error" onClick={handleFailure}>Cancel</Button>
                    <Button disabled={prosessing} sx={{ml: 1}} variant="outlined" color="info" onClick={handleSuccess}>{withInput ? "Save" : "Yes"}</Button>
                </Stack>
            </Paper>
        </Backdrop>
    );
};


export default DialogCard;