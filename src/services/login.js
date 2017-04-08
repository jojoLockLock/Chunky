/**
 * Created by Administrator on 2017/3/29.
 */
import request from '../utils/request';
import {mockConfig} from '../config/apiConfig';


export async function login(userData) {
  const options=mockConfig.isMocking
    ?
    {method:'GET'}
    :
    {method:'POST',body:JSON.stringify(userData)};
  
  return request('/api/login',options);
}
