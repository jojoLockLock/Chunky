/**
 * Created by jojo on 2017/7/13.
 */
import ApiConfig from '../config/ApiConfig';

import request from '../utils/request';

import * as tools from '../utils/tools';

const {httpApi}=ApiConfig;

export async function login(payload) {

  const options={
    method:"GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }

  }
  return request(httpApi.LOGIN+tools.jsonToQueryString(payload),options);
}


export async function queryUser(payload) {

  const {token,value}=payload;

  payload={
    value,
  }

  const options={
    method:"GET",
    headers:{
      "Content-Type": "application/json; charset=utf-8",
      "access-token":token,
    }
  }

  return request(httpApi.USER+tools.jsonToQueryString(payload),options);

}


export async function putUserFriendRequest(payload) {

  const {token,targetAccount}=payload;

  payload={
    targetAccount
  }

  const options={
    method:"PUT",
    headers:{
      "Content-Type": "application/json; charset=utf-8",
      "access-token":token,
    },
    body:JSON.stringify(payload)
  }

  return request(httpApi.USER_FRIEND_REQUEST,options);

}


export async function patchUserFriendRequest(payload) {

  const {token,targetAccount,resCode}=payload;

  payload={
    targetAccount,
    resCode
  }

  const options={
    method:"PATCH",
    headers:{
      "Content-Type": "application/json; charset=utf-8",
      "access-token":token,
    },
    body:JSON.stringify(payload)
  }

  return request(httpApi.USER_FRIEND_REQUEST,options);

}
