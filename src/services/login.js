/**
 * Created by Administrator on 2017/3/29.
 */
import request from '../utils/request';
import {mockConfig} from '../config/apiConfig';


export async function login(userData) {
  console.info(JSON.stringify(userData));
  const options=mockConfig.isMocking
    ?
    {method:'GET'}
    :
    {method:'POST',body:JSON.stringify(userData),headers:{
      "Content-Type":"application/json; charset=utf-8"
    }};

  return request(mockConfig.url.login,options);
}
