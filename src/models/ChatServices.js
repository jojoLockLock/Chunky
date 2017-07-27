/**
 * Created by jojo on 2017/7/13.
 */
import ApiConfig from '../config/ApiConfig';
import request from '../utils/request';
import Socket from '../utils/socket';
import * as tools from '../utils/tools';

const {httpApi,socketApi}=ApiConfig;


export async function connectSocket({token,onClose}) {

  const socket = new Socket(`${socketApi.SOCKET_HOST}?token=${token}`);

  socket.onClose(onClose);

  return socket.connect();
}


export async function getChatRecords(payload) {

  const {limit,skip,token,targetAccount}=payload;

  payload={
    limit,
    skip,
    targetAccount
  }

  const options={
    method:"GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "access-token":token,
    }
  }


  return request(httpApi.USER_CHAT_RECORD+tools.jsonToQueryString(payload),options);
}


export async function getAllChatRecords(payload) {

  const {limit,skip,token,targetAccount}=payload;

  payload={
    limit,
    skip,
    targetAccount
  }

  const options={
    method:"GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "access-token":token,
    }
  }


  return request(httpApi.USER_CHAT_RECORDS+tools.jsonToQueryString(payload),options);
}

export async function initUnreadMessagesCount(payload) {
  const {targetAccount,token}=payload;

  const options={
    method:"PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "access-token":token,
    },
    body:JSON.stringify({targetAccount})
  }

  return request(httpApi.UNREAD_MESSAGES,options);

}
