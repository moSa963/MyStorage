export const BASE_URL = "http://localhost:8000/";

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');

    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

const getHeader = ()=>{
    var xsrfToken = getCookie('XSRF-TOKEN');

    return  {
        'Accept': "application/json",
        'X-XSRF-TOKEN': xsrfToken,
    };
}

const sendRequest =  (url = BASE_URL, method = "GET", data = null, api = true)=>{
    var body = {};
    if (data && method !== 'GET'){
        body["body"] = data;
    }

    body["headers"] = getHeader();
    body["method"] = method;
    body["credentials"] = 'include';
    
    if (!url.match(/^https?:/s)){
        url = api ? BASE_URL + "api/" + url :  BASE_URL + url;
    }

    return fetch(url, body);
}

export const processRequest = (url = BASE_URL, form, progressEvent, onLoaded, onError, onAbort)=>{
    if (!url.match(/^https?:/s)){
        url = BASE_URL + "api/" + url;
    }

    const ajax = new XMLHttpRequest();
    
    ajax.upload.addEventListener('progress', progressEvent, false);

    ajax.addEventListener("load", onLoaded, false);
    ajax.addEventListener("error", onError, false);
    ajax.addEventListener("abort", onAbort, false);

    ajax.open('POST', url);

    ajax.setRequestHeader('X-XSRF-TOKEN', getCookie('XSRF-TOKEN'));
    ajax.setRequestHeader('Accept', 'application/json');
    ajax.withCredentials = true;
    ajax.send(form);
    return ajax;
}

export default sendRequest;