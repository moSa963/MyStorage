import { Alert, Button, LinearProgress, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { register } from "../http/Auth";
import { Validator } from "../utilities";

const validator = new Validator({
    first_name: {min: 3, max: 50},
    last_name:  {min: 3, max: 50},
    username:   {min: 3, max: 50 , match:/^[A-Za-z]+([._-]?[A-Za-z0-9]+)*$/s},
    email:      {min: 8, max: 50, match:/^[a-zA-z]+([._]?[a-zA-z0-9]+)*[@][a-zA-z]+[.][a-zA-z]+$/s},
    password:   {min: 8, max: 50},
    password_confirmation: { min: 8, max: 50, confirm: 'password'},
});


const SigInPage = ({ onStart, onEnd, disabled })=>{
    const [processing, setProcessing] = React.useState(false);
    const [inputs, setInputs] = React.useState({});
    const [errors, setErrors] = React.useState({});
    const [alert, setAlert] = React.useState(null);

    const handleInput = (key, value)=>{
        inputs[key] = value;
        setInputs({...inputs});
        errors[key] = validator.validateOne(key, inputs);
        setErrors({...errors});
    }

    const handleSigIn = ()=>{
        if (!processing){
            setProcessing(true);

            const errs = validator.validate(inputs);
            if (errs){
                setErrors(errs);
                setProcessing(false);
                return;
            }

            register(inputs)
            .then(res=>{
                if (res.ok){
                    window.location.reload();
                }
                res.json().then(js=>setAlert({ message: js.message, severity: 'error' }));
                setProcessing(false);
            })
            .catch(err=>setAlert({ message: err, severity: 'error' }));
        }
    }

    return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
            <Box sx={{ flex: 1, height: '100%', overflow: 'auto', }}>

                {
                    processing && <LinearProgress color="secondary" sx={{ position: 'absolute', width: '100%', inset: "0 0 0", }}/>
                }
                {
                    alert && <Alert sx={{mb: 2}} variant="outlined" severity={alert.severity}>{alert.message}</Alert>
                }
                <Box sx={{display: 'flex'}}>
                    <TextField disabled={processing || disabled} fullWidth color="secondary" required label="First name" 
                            onChange={(e)=>handleInput('first_name', e.currentTarget.value)}
                            value={inputs['first_name'] || ''}                        
                            error={Boolean(errors['first_name'])}
                            helperText={errors['first_name']}  
                            sx={{mb: 1}} 
                            variant="standard" />

                    <TextField disabled={processing || disabled} fullWidth color="secondary" required label="Last name" 
                            onChange={(e)=>handleInput('last_name', e.currentTarget.value)}
                            value={inputs['last_name'] || ''}                        
                            error={Boolean(errors['last_name'])}
                            helperText={errors['last_name']}  
                            sx={{mb: 1}} 
                            variant="standard" />
                </Box>

                <TextField disabled={processing || disabled} color="secondary" required fullWidth label="Username" 
                        onChange={(e)=>handleInput('username', e.currentTarget.value)}
                        value={inputs['username'] || ''}                        
                        error={Boolean(errors['username'])}
                        helperText={errors['username']}  
                        sx={{mb: 1}} 
                        variant="standard" />


                <TextField disabled={processing || disabled} color="secondary" required fullWidth label="Email" 
                        onChange={(e)=>handleInput('email', e.currentTarget.value)}
                        value={inputs['email'] || ''}                        
                        error={Boolean(errors['email'])}
                        helperText={errors['email']}  
                        sx={{mb: 1}}
                        type="email"
                        variant="standard" />


                <TextField disabled={processing || disabled} color="secondary" required fullWidth label="Password"  
                        onChange={(e)=>handleInput('password', e.currentTarget.value)}
                        value={inputs['password'] || ''}
                        error={Boolean(errors['password'])}
                        helperText={errors['password']}  
                        sx={{mb: 1}}
                        type="password"
                        variant="standard" />


                <TextField disabled={processing || disabled} color="secondary" required fullWidth label="Confirmation"  
                        onChange={(e)=>handleInput('password_confirmation', e.currentTarget.value)}
                        value={inputs['password_confirmation'] || ''}
                        error={Boolean(errors['password_confirmation'])}
                        helperText={errors['password_confirmation']}  
                        sx={{mb: 10}}
                        type="password"
                        variant="standard" />


                <Button onClick={handleSigIn} disabled={processing || disabled} color="secondary" variant="outlined" fullWidth>Sign in</Button>
            </Box>
        </Box>
    );
}



export default SigInPage;