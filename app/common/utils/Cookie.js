
import { AsyncStorage } from 'react-native';

export default {
  async parseCookie(headers = []) {
      const cookies = headers.getAll('Set-Cookie');
      if(cookies.length>0) {
        const sCookies = [];
        cookies.forEach(c=>{
          c.replace(/HttpOnly,*\s/ig, '====').split('====').forEach(cc=>{
            const cookie = cc.split(';');
            const [key, value] = cookie[0].split('=');
            sCookies.push({key,value});
          })
        })
        
        const fetchCookie = sCookies.map(s=> `${s.key}=${s.value}`).join(';');
        if(fetchCookie.indexOf('koa.sid')>=0) {
          await AsyncStorage.setItem('fetch-cookies', fetchCookie);
        }
      }
  },
  async getCookies() {
    // return 'koa.sid=6sVIxGENcazxe_uQ4okGszDc7hr_ruWJ;koa.sid.sig=Pvc3VR8Do8cqCo16ZyoVE8QOY8Q';
    return await AsyncStorage.getItem('fetch-cookies');
  }
}