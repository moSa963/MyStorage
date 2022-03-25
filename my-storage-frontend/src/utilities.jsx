import { BASE_URL } from "./http/Request";

export const sortFolders = (item1, item2, orderBy) => {
    switch (orderBy) {
        case 'za': return item2.name.localeCompare(item1.name);
        default: return item1.name.localeCompare(item2.name);
    }
}

export const sortFiles = (item1, item2, orderBy, sortBy) => {
    if (orderBy === 'za') {
        const i1 = item1;
        item1 = item2;
        item2 = i1;
    }
    switch (sortBy) {
        case 'size': return item1.size > item2.size;
        case 'type': return item1.extension.localeCompare(item2.extension);
        case 'date': return (new Date(item1.created_at)).getTime() > (new Date(item2.created_at)).getTime();
        default: return item1.name.localeCompare(item2.name);
    }
};

export const sortGroups = (item1, item2, orderBy) => {
    switch(orderBy){
        case 'za': return item2?.name?.localeCompare(item1.name);
        default: return item1?.name?.localeCompare(item2.name);
    }
};


export const hideEmail = (email)=>{

    return email.replace(/(.{2})(.*)(?=@)/,
        (g1, g2, g3) => { 
            for(let i = 0; i < g3.length; i++) { 
                g2+= "*"; 
            } 
            return g2; 
        });
}

export const praseTime = (timeStr)=>{
    if (!timeStr) return null;
    return new Date(timeStr).toLocaleDateString();
}


export const splitr = (string, spliter)=>{
    var name = '';
    var ext = '';

    for (var i = string.length - 1; i >= 0; --i){
        if (string.charAt(i) === spliter){
            name = string.slice(0, i);
            ext = string.slice(i + 1, string.length);
            return [name, ext];
        }
    }

    return [string, ''];
}

export const download = (group_id, file)=>{
    const a = document.createElement('a');
    a.href = BASE_URL + "api/group/" + group_id + "/file/" + file.id;
    a.download = file.name + '.' + file.extension;
    a.click();
    a.remove();
}

export const ItemSizes = {
    small:{
        width: 50,
        iconWidth: '100%',
        variant: "caption",
        fontSize: "0.7rem",
    },
    medium:{
        width: 85,
        iconWidth: '100%',
        variant: "subtitle2",
        fontSize: "0.9rem",
    },
    large:{
        width: 120,
        iconWidth: '100%',
        variant: "subtitle2",
        fontSize: "1rem",
    },
    list:{
        width: 120,
        iconWidth: '100%',
        variant: "subtitle2",
        fontSize: "1rem",
    },
}


export class Validator{
    
    constructor(values = {}){
        this.values = values;
    }

    min(name, values) {
        return this.values[name]['min'] > values[name].length ? name + ' minimum length is ' + this.values[name]['min'] : null;
    }

    max(name, values) {
        return values[name].length > this.values[name]['max'] ? name + ' maximum length is ' + this.values[name]['max'] : null;
    }

    match(name, values){
        if (!values[name].match(this.values[name]['match'])){
            return name + " format is not valide";
        }
        return null;
    }

    confirm(name, values){
        if (values[name] !== values[this.values[name]['confirm']]){
            return this.values[name]['confirm'] + " confirmation is wrong.";
        }
        return null;
    }

    validateOne(name, values){
        var error = null;
        if (!this.values[name]) return null; 
        Object.keys(this.values[name]).forEach(prop=>{
            if (!this[prop]) return null; 
            const res = this[prop](name, values);
            if (res !== null){
                error = res;
                return;
            }
        });
        return error;
    }

    validate(values = {}){
        var errors = null;
        const keys = Object.keys(values);

        Object.keys(this.values).forEach(name=>{
            if (!values[name]){
                if (!errors) errors = {};
                errors[name] = name + ' is requered.';
            }
        });

        keys.forEach(name=>{
            const error = this.validateOne(name, values);
            if (error){
                if (!errors) errors = {};
                errors[name] = error;
            }
        });

        return errors;
    }
}
 