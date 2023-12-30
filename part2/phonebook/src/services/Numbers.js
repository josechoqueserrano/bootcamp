import axios from "axios";
const baseUrl = "http://192.168.1.14:3001/persons";

const getAll = () => {
    const require = axios.get(baseUrl);
    return require.then((res) => res.data); 
}

const create = (newObject) => {
    const require = axios.post(baseUrl, newObject);
    return require.then((res) => res.data);
}

const update = (id, newObject) => {
    const require = axios.put(`${baseUrl}/${id}`, newObject);
    return require.then((res) => res.data);
}

const deletePerson = (id) => {
    const require = axios.delete(`${baseUrl}/${id}`);
    return require.then((res) => id);
}


export default { getAll, create, update, deletePerson };