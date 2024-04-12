const LOCAL_STORAGE = "__my-app__";

export const configLocalStorage = () => localStorage.setItem(LOCAL_STORAGE, JSON.stringify({}))

const get = () => JSON.parse(localStorage.getItem(LOCAL_STORAGE));

export const getItem = (key) => get()[key];

export const setItem = ({ fn, key, value }) => {
    const prevData = get();

    if(fn) {
        const prevValue = getItem(key);

        value = fn(prevValue);
    }

    localStorage.setItem(LOCAL_STORAGE, JSON.stringify({ ...prevData, [key]: value}));
};