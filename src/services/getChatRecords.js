/**
 * Created by JoJo on 2017/4/29.
 */
import request from '../utils/request';
import {mockConfig} from '../config/apiConfig';


export async function getChatRecords(payload) {
  const options=mockConfig.isMocking
    ?
    {method:'GET'}
    :
    {method:'POST',body:JSON.stringify(payload),headers:{
      "Content-Type":"application/json; charset=utf-8"
    }};

  return request(mockConfig.url.getChatRecords,options);
}


export async function getChatRecordsAll(payload) {
  const options=mockConfig.isMocking
    ?
    {method:'GET'}
    :
    {method:'POST',body:JSON.stringify(payload),headers:{
      "Content-Type":"application/json; charset=utf-8"
    }};

  return request(mockConfig.url.getChatRecordsAll,options);
}
