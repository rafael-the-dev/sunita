const LOCAL_STORAGE = "__my-app__";

export const getItem = (key) => localStorage.getItem(LOCAL_STORAGE)[key];

export const setItem = ({ fn, key, value }) => {
    if(fn) {
        const prevValue = getItem(key);
        // return n
        value = fn(prevValue);
    }

    localStorage.setItem(LOCAL_STORAGE, value);
};