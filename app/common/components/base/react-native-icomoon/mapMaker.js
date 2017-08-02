export default (glypy) => {
    return Object.keys(glypy)
            .map(key => ({
                key,
                value: String.fromCharCode(parseInt(glypy[key], 16))
            }))
            .reduce((map, _glypy) => {
                map[_glypy.key] = _glypy.value;
                return map;
            }, {});
};