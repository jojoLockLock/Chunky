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
          [targetAccount]:[...targetChatRecords,...payload.chatRecords]
        }
      };
    },
    addToTop(preState,{payload}) {
      const {chatRecords}=preState;
      const {targetAccount}=payload;
      const targetChatRecords=chatRecords[targetAccount]||[];
      return {
        ...preState,
        chatRecords:{
          ...preState.chatRecords,
          [targetAccount]:[...payload.chatRecords,...targetChatRecords]

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
    *getChatRecords({payload},{call,put}) {
      const result = yield call(getChatRecordsService.getChatRecords,payload);
      const {targetAccount}=payload;
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
        Message.info(message,GLOBAL_MSG_DURATION);
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
    *test({payload},{call,put}) {
      const result = yield call(getChatRecordsService.getChatRecords,payload);
      const {targetAccount}=payload;
      const {chatRecords,status,message}=result;
      if(Object.is(status,1)){
        yield put({
          type:'addToTop',
          isAnimate:false,
          payload:{
            targetAccount,
            chatRecords
          }
        });
        Message.info(message,GLOBAL_MSG_DURATION);
      }else{
        yield put({
          type:'getChatRecordsError',
          payload:{
            message
          }
        });
        throw new Error(message);
      }

    }
  },

  subscriptions: {
    setup({dispatch,history}) {
      return history.listen(({pathname,query})=>{
        // console.info(pathname,query);
      })
    }
  },
}
