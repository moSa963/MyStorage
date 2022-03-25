import sendRequest from "./Request";


export const getUser = ()=>{
    return sendRequest('user');
}

export const register = ({ first_name, last_name, username, email, password, password_confirmation})=>{
    const form = new FormData();
    form.append('first_name', first_name);
    form.append('last_name', last_name);
    form.append('username', username);
    form.append('email', email);
    form.append('password', password);
    form.append('password_confirmation', password_confirmation);

    return sendRequest('register', 'POST', form, false);
}

export const login = ({ username, password, remember = false })=>{
    const form = new FormData();
    form.append('username', username);
    form.append('password', password);
    form.append('remember', remember ? 1 : 0);

    return sendRequest('login', 'POST', form, false);
}

export const logout = ()=>{
    return sendRequest('logout', 'DELETE', false, false);
}

export const verifieEmail = (code)=>{
    const form = new FormData();
    form.append('code', code);
    return sendRequest('verifie', 'POST', form);
}

export const updateEmailCode = (code)=>{
    return sendRequest('verifie', 'PUT');
}