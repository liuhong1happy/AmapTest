import { Platform } from 'react-native';
import Cookie from './Cookie';

const SERVER_URL = 'http:/10.0.110.230';

const Ajax = async function (options) {
  let formData = null;
  if (options.type.toUpperCase() === "GET") {
    if (typeof options.data === "object") {
      if (options.url.indexOf("?") === -1) {
        options.url += "?";
      }
      const params = [];
      for (const key in options.data) {
        params.push(`${key}=${encodeURIComponent(options.data[key])}`);
      }
      options.url += params.join("&");
    }
  } else {
    switch (typeof options.data) {
      case "string":
        formData = options.data;
        break;
      case "object":
        if (options.data instanceof Array) {
          formData = JSON.stringify(options.data);
        } else if(options.dataType=== "json".toUpperCase()){
          formData = JSON.stringify(options.data);
        }
        else if(options.dataType=== "form".toUpperCase()){
          formData = new FormData();
          for (const key in options.data) {
            let value = options.data[key];
            if (value != null && typeof value === 'object' && value.type === "multipart/form-data") {
              value = options.data[key];
            }
            else if (value != null && typeof value !== "string") {
              value = JSON.stringify(value);
            }
            formData.append(key, value);
          }
        }
        break;
      default:
        break;
    }
  }

  const cookies = await Cookie.getCookies();
  fetch(SERVER_URL + options.url, {
    method:options.type,
    body:formData,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json,text/plain,*/*',
      'Content-Type': options.dataType==="json".toUpperCase() ? 'application/json' : "multipart/form-data",
      'Cookie': cookies || '',
      'channel': Platform.OS
    }
  }).then(response=> {
      Cookie.parseCookie(response.headers);
      return response;
    })
    .then(response => response.text())
    .then((responseText) => {
      var res = JSON.parse(responseText);
      if (res.status === "success") {
        options.success(res);
      } else if(String(res.status)==='401'){
        options.invalid('invalid', res.info || res.msg || '未登录，请重新登录');
      } else {
        options.error('error', res.info || res.msg || `接口调取错误:${options.url}\n${JSON.stringify(res)}`);
      }
    })
    .catch((error) => {
      options.error('warning', "服务器错误");
    });
};

export default function (options) {
  options.url = options.url || "/api/url";
  options.type = options.type || "get";
  options.success = options.success || function (e) {};
  options.error = options.error || function (e, msg) {};
  options.dataType = (options.dataType || "json").toUpperCase();
  options.invalid = options.invalid || function (e, msg) {};
  Ajax(options);
}
