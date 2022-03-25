import React from "react";
import { Box } from "@mui/system";
import { Paper, Typography, LinearProgress, Button, Input, Alert } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { hideEmail } from "../utilities";
import { updateEmailCode, verifieEmail } from "../http/Auth";

const CharInput = ({ onChange, disabled})=>{
    const [value, setValue] = React.useState("");
    const [selected, setSelected] = React.useState(false);

    const handleTextChange = (event) =>{
        var value = event.currentTarget.value;
        value = value.length > 0 ? value.charAt(value.length - 1) : "";
        value = value === " " ? "" : value;
        setValue(value);
        onChange(value);
    }
    
    return (
        <Box  sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding:{ xs: 0.3, sm: 1, },
        }}>
            <Box sx={{
                position: 'relative',
                display: 'block',
                width: '100%',
                paddingTop: '100%',
                backgroundColor: 'background.default',
                boxShadow: theme => theme.shadows[selected ? 5 : 0],
                transition: '300ms ease-in-out',
            }}>
                <Input sx={{
                    position: 'absolute',
                    inset: "0 0 0 0",
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    fontSize: { xs: 35 , sm: 55, },
                    "& > *": { textAlign: 'center', }
                }} 
                    disabled={disabled}
                    onFocus={()=>setSelected(true)}
                    onBlur={()=>setSelected(false)}
                    value={value}
                    onChange={handleTextChange}
                />
            </Box>
        </Box>
    );
}

const VerifyEmailPage = () => {
    const [auth] = useAuth();
    const [code, setCode] = React.useState(["", "", "", "", "", ""]);
    const [progressing, setProgressing] = React.useState(false);
    const [error, setError] = React.useState(null);

    const handleChange = (index, value)=>{
        code[index] = value;
        setCode([...code]);
    }

    React.useEffect(()=>{
        if (code.find((e) => e === "") === undefined){
            if (!progressing){
                setProgressing(true);
                verifieEmail(code.join(''))
                .then(res=>{
                    if (res.ok){
                        window.location.reload();
                        return;
                    }
                    setCode(['', '', '', '', '', '']);
                    setProgressing(false);
                    res.json().then(js=>setError({message: js.message, severity: 'error'}));
                })
                .catch(err=>setError({message: err, severity: 'error'}));
            }
        }
    }, [code, progressing]);

    const handleUpdate = ()=>{
        if (!progressing){
            setProgressing(true);
            updateEmailCode()
            .then(res=>{
                setProgressing(false);
                if (res.ok){
                    setError({message: 'We sent you a new code.', severity: 'success'});
                    return;
                }
                res.json().then(js=>setError({message: js.message, severity: 'error'}));
            })
            .catch(err=>setError({message: err, severity: 'error'}));
        }
    }

    return (
        <Paper sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: 800,
            maxHeight: '100%',
            overflow: 'auto',
            padding: 2,
        }}>
            {
                progressing && <LinearProgress color="secondary" sx={{ position: 'absolute', width: '100%', inset: "0 0 0", }}/>
            }

            {
                error && <Alert variant="outlined" severity={error.severity}>{error.message}</Alert>
            }

            <Typography color="secondary" width="100%" variant="h5" align="center" mb={4}>Hello {auth.user.first_name + " " + auth.user.last_name} </Typography>

            <Typography mb={2} >We have sent you a code to this email: <strong>{hideEmail(auth.user.email)}</strong> </Typography>

            <Typography >Please enter the code to verify your email:</Typography>

            <Box sx={{ display: 'flex', width: '100%', }}>
                <CharInput disabled={progressing} onChange={(v)=>handleChange(0, v)} />
                <CharInput disabled={progressing} onChange={(v)=>handleChange(1, v)} />
                <CharInput disabled={progressing} onChange={(v)=>handleChange(2, v)} />
                <CharInput disabled={progressing} onChange={(v)=>handleChange(3, v)} />
                <CharInput disabled={progressing} onChange={(v)=>handleChange(4, v)} />
                <CharInput disabled={progressing} onChange={(v)=>handleChange(5, v)} />
            </Box>

            <Button onClick={handleUpdate} disabled={progressing} color="secondary" sx={{ width: 'fit-content', marginLeft: 'auto',}}>
                Resend the code?
            </Button>
        </Paper>
    );
}


export default VerifyEmailPage;