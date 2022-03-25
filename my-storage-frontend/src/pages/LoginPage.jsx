import { Alert, Button, InputLabel, LinearProgress, Switch, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { login } from "../http/Auth";
import { Validator } from "../utilities";


const validator = new Validator({
    username: { min: 3, max: 50, match: /^[A-Za-z]+([._-]?[A-Za-z0-9]+)*$/s },
    password: { min: 8, max: 50, }
});

const LoginPage = ({ onStart, onEnd, disabled }) => {
    const [processing, setProcessing] = React.useState(false);
    const [inputs, setInputs] = React.useState({ remember: false });
    const [errors, setErrors] = React.useState({});
    const [alert, setAlert] = React.useState(null);

    const handleInput = (key, value) => {
        inputs[key] = value;
        setInputs({ ...inputs });
        errors[key] = validator.validateOne(key, inputs);
        setErrors({ ...errors });
    }

    const handleLogin = async () => {
        if (processing) {
            return;
        }

        setProcessing(true);

        const errs = validator.validate(inputs);

        if (errs) {
            setErrors(errs);
            setProcessing(false);
            return;
        }

        const res = await login(inputs);
        if (res.ok) {
            window.location.reload();
            return;
        }

        const js = await res.json();
        setAlert({ message: js.message, severity: 'error' });
    }

    return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
            <Box sx={{ flex: 1, height: '100%', overflow: 'auto', }}>

                {processing && <LinearProgress color="secondary" sx={{ position: 'absolute', width: '100%', inset: "0 0 0", }} />}

                {alert && <Alert sx={{ mb: 2 }} variant="outlined" severity={alert.severity}>{alert.message}</Alert>}

                <TextField disabled={processing || disabled} color="secondary" required fullWidth label="Username"
                    onChange={(e) => handleInput('username', e.currentTarget.value)}
                    value={inputs['username'] ? inputs['username'] : ''}
                    error={Boolean(errors['username'])}
                    helperText={errors['username']}
                    sx={{ mb: 1 }}
                    variant="standard" />


                <TextField disabled={processing || disabled} color="secondary" required fullWidth label="Password"
                    onChange={(e) => handleInput('password', e.currentTarget.value)}
                    value={inputs['password'] ? inputs['password'] : ''}
                    error={Boolean(errors['password'])}
                    helperText={errors['password']}
                    sx={{ mb: 3 }}
                    minRows={6}
                    type="password"
                    variant="standard" />

                <InputLabel sx={{ display: "inline" }}>Remeper me: </InputLabel>
                <Switch checked={inputs.remember} onChange={() => handleInput('remember', !inputs.remember)} />

                <Button onClick={handleLogin} disabled={processing || disabled} color="secondary" variant="outlined" fullWidth>Login</Button>
            </Box>
        </Box>
    );
}



export default LoginPage;