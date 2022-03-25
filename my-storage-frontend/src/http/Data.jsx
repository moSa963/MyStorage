import sendRequest, { processRequest } from "./Request";

export const updateUser = (image = null) => {
    const form = new FormData();
    image !== null && form.append('image', image);
    return sendRequest('user/update', 'POST', form);
}

export const getFile = (group_id, file_id) => {
    return sendRequest(`group/${group_id}/file/${file_id}`);
}

export const getFileInfo = (group_id, file_id) => {
    return sendRequest(`group/${group_id}/file/${file_id}/info`);
}

export const uploadFile = ({ file, name, directory_id, extension }, progressHandler, onLoaded, onError, onAbort) => {
    const form = new FormData();
    form.append('file', file);
    form.append('name', name);
    form.append('extension', extension);
    return processRequest(`directory/${directory_id}/file`, form, progressHandler, onLoaded, onError, onAbort);
}

export const moveFile = (file_id, from_dir_id, to_dir_id) => {
    return sendRequest(`file/${file_id}/move/${from_dir_id}/${to_dir_id}`, 'PUT');
}

export const referenceFile = (file_id, directory_id) => {
    return sendRequest(`directory/${directory_id}/reference/file/${file_id}`, 'POST');
}

export const deleteFile = (group_id, file_id) => {
    return sendRequest(`group/${group_id}/file/${file_id}`, 'DELETE');
}

export const updateFile = (file_id, name) => {
    const form = new FormData();
    form.append('name', name);
    return sendRequest(`file/${file_id}/update`, 'POST', form);
}

export const getFiles = (path, group_id = null) => {
    var url = group_id === null ? `directory/${path}` : `group/${group_id}/directory/${path}`;
    return sendRequest(url);
}

export const createFolder = (group_id, in_dir_id, name) => {
    const form = new FormData();
    form.append('name', name);
    return sendRequest(`group/${group_id}/directory/${in_dir_id}`, 'POST', form);
}

export const deleteFolder = (directory_id) => {
    return sendRequest(`directory/${directory_id}`, 'Delete');
}

export const moveFolder = (directory_id, to_dir_id) => {
    return sendRequest(`directory/${directory_id}/move/${to_dir_id}`, 'PUT');
}

export const updateFolder = (folder_id, name) => {
    const form = new FormData();
    form.append('name', name);
    return sendRequest(`directory/${folder_id}/update`, 'POST', form);
}

export const getGroup = (id) => {
    return sendRequest('group/' + id);
}

export const getGroups = () => {
    return sendRequest('group');
}

export const createGroup = ( name, is_private ) => {
    const form = new FormData();
    form.append('name', name);
    form.append('private', is_private ? 1 : 0);
    return sendRequest('group', 'POST', form);
}

export const deleteGroup = (group_id) => {
    return sendRequest(`group/${group_id}`, 'DELETE');
}

export const updateGroup = (group_id, name = null, is_private = null, image = null) => {
    const form = new FormData();
    name != null && form.append('name', name);
    is_private != null && form.append('private', is_private ? 1 : 0);
    image != null && form.append('image', image);
    return sendRequest(`group/${group_id}`, 'POST', form);
}

export const sendGroupRequest = (username, group_id, is_read_only = true) => {
    const form = new FormData();
    form.append('is_read_only', is_read_only ? 1 : 0);
    return sendRequest(`group/${group_id}/request/${username}`, 'POST', form);
}

export const getMembers = (group_id) => {
    return sendRequest(`group/${group_id}/members`);
}

export const acceptRequest = (request_id) => {
    return sendRequest(`group/request/${request_id}`, 'PUT');
}

export const getNotification = () => {
    return sendRequest(`notification`);
}

export const denyRequest = (request_id) => {
    return deleteMember(request_id);
}

export const getRequests = (type) => {
    return sendRequest(`group/${type === "requested" ? "invites" : "requests"}`);
}

export const deleteMember = (request_id) => {
    return sendRequest(`group/member/${request_id}`, 'DELETE');
}

export const updateMemberPermission = (request_id, read_only = true) => {
    return sendRequest(`group/member/${request_id}/${read_only ? "read" : "write"}`, 'PUT');
}

export const getBinFiles = () => {
    return sendRequest('bin');
}
export const restoreBinItem = (item_id) => {
    return sendRequest(`bin/file/${item_id}`, 'PUT');
}

export const emptyBin = () => {
    return sendRequest('bin', 'DELETE');
}