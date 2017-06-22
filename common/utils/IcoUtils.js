export default {
  from:"icomoon",
  glypy:{
    home: 'e900',
    user: 'e901',
    search: 'e902',
    pencil: 'e905',
    send: 'e903',
    profile: 'e923',
    newspaper: 'e904',
    heart: 'e9da',
    command: 'ea4e',
    diamonds: 'e919',
    'coin-yen': 'e93e',
    'credit-card': 'e93f'
  },
  glypyMapMaker(glypy) {
    return Object.keys(glypy)
            .map(key => ({
              key,
              value: String.fromCharCode(parseInt(glypy[key], 16))
            }))
            .reduce((map, _glypy) => {
              map[_glypy.key] = _glypy.value;
              return map;
            }, {});
  },
};