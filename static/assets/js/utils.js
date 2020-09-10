window.utils = {
    findWithAttr: (array, attr, value) => {
        for(var i = 0; i < array.length; i += 1) {
            if(array[i][attr] == value) {
                return i;
            }
        }
        return -1;
    },
    storage: {
        get: key => {
            return JSON.parse(localStorage.getItem(key));
        },
        set: (key, value) => {
            return localStorage.setItem(key, JSON.stringify(value));
        },
        remove: key => {
            return localStorage.removeItem(key);
        }
    }
}