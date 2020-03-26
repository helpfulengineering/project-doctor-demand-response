let FormUtil = {
    trimFields: function(obj) {
        let keys = Object.keys(obj);
        keys.forEach(key => {
        if(obj[key] && typeof(obj[key]) === 'string') {
            obj[key] = obj[key].trim();
            }
        });
    },
    isEmpty: function(value) {
        if(value === undefined || value === null || (typeof(value) === 'string' && value.trim() === '')) {
            return true;
        }
        return false;
    }
}

export default FormUtil;