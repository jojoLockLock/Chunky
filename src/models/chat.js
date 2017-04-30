/**
 * Created by JoJo on 2017/4/29.
 */
import * as getChatRecordsService from '../services/getChatRecords';
import {message as Message} from 'antd';
import {GLOBAL_MSG_DURATION} from '../config/componentConfig';

const initState={
  isSuccess:false,
  isError:false,
  activeChat:null,
  isAnimate:false,
  chatRecords:{

  },
};

export default {

  namespace: 'chat',

  state: initState,

  reducers: {
    setActiveChat(preState,{payload}) {
      const {activeChat}=payload;

      return {
        ...preState,
        activeChat,
      }
    },
    getChatRecordsSuccess(preState,{payload}) {
      const {chatRecords}=preState;
      const {targetAccount}=payload;
      const targetChatRecords=chatRecords[targetAccount]||[];
      return {
        ...preState,
        isSuccess:true,
        chatRecords:{
          ...chatRecords,
          [targetAccount]:[...payload.chatRecords,...targetChatRecords]
        }
      };
    },
    getChatRecordsAllSuccess(preState,{payload}) {
      return {
        ...preState,
        isSuccess:true,
        chatRecords:{
          ...payload.chatRecords
        }
      }
    },
    getChatRecordsError(preState,{payload}) {
      return {
        ...preState,
        isError:true
      }
    },
    openAnimate(preState) {
      return {
        ...preState,
        isAnimate:true
      }
    },
    closeAnimate(preState) {
      return {
        ...preState,
        isAnimate:false,
      }
    },
    addChatRecords(preState,{payload}) {
      const {chatRecords}=preState;
      const {targetAccount,message}=payload;
      const targetChatRecords=chatRecords[targetAccount]||[];
      return {
        ...preState,
        chatRecords:{
          ...chatRecords,
          [targetAccount]:[...targetChatRecords,message]

        }
      }
    }


  },

  effects: {
    *getChatRecords({payload},{call,put,select}) {
      const {targetAccount}=payload;
      const {userAccount,token} =yield select(state=>state.log.loginData);
      const targetChatRecords=yield select(state=>state.chat.chatRecords[targetAccount]);
      const current=targetChatRecords?targetChatRecords.length:0;
      const result = yield call(getChatRecordsService.getChatRecords,
        {...payload,userAccount,token,current});

      const {chatRecords,status,message}=result;
      if(Object.is(status,1)){
        yield put({
          type:'getChatRecordsSuccess',
          isAnimate:false,
          payload:{
            targetAccount,
            chatRecords
          }
        });
        // Message.info(message,GLOBAL_MSG_DURATION);
      }else{
        yield put({
          type:'getChatRecordsError',
          payload:{
            message
          }
        });
        throw new Error(message);
      }
    },
    *getChatRecordsAll({payload},{call,put,select}) {
      const {userAccount,token} =yield select(state=>state.log.loginData);
      const result = yield call(getChatRecordsService.getChatRecordsAll,
        {...payload,userAccount,token});
      const {chatRecords,status,message}=result;
      if(Object.is(status,1)){
        yield put({
          type:'getChatRecordsAllSuccess',
          isAnimate:false,
          payload:{
            chatRecords
          }
        });
        // Message.info(message,GLOBAL_MSG_DURATION);
      }else{
        yield put({
          type:'getChatRecordsError',
          payload:{
            message
          }
        });
        throw new Error(message);
      }
    },

  },

  subscriptions: {
    setup({dispatch,history}) {
      return history.listen(({pathname,query})=>{
        // console.info(pathname,query);
      })
    }
  },
}
