/**
 * Created by JoJo on 2017/4/29.
 */
import * as getChatRecordsService from '../services/getChatRecords';
import {message as Message} from 'antd';
import {GLOBAL_MSG_DURATION} from '../config/componentConfig';
import {getTimeString} from '../utils/tools';
const initState={
  isSuccess:false,
  isError:false,
  activeChat:null,
  isAnimate:false,
  noMoreChatRecords:{},
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
      //给每条信息都加上唯一的key
      payload.chatRecords.forEach((item,index)=>{
        item.key=`${targetAccount}${targetChatRecords.length+index}`;
      });
      const lastTime=getTimeString(targetChatRecords[targetChatRecords.length-1].date);

      const timeMessage={
        senderAccount:"sys",
        key:`${lastTime}${targetChatRecords.length}`,
        content:lastTime,
      };
      return {
        ...preState,
        isSuccess:true,
        chatRecords:{
          ...chatRecords,
          [targetAccount]:[...payload.chatRecords,timeMessage,...targetChatRecords]
        }
      };
    },
    getChatRecordsAllSuccess(preState,{payload}) {
      //给每条信息加上唯一的key
      const {chatRecords}=payload;
      Object.keys(chatRecords).forEach(key=>{
        chatRecords[key].forEach((item,index)=>{
          item.key=`${key}${index}`
        })
      });
      return {
        ...preState,
        isSuccess:true,
        chatRecords:{
          ...chatRecords
        }
      }
    },
    addNoMoreChatRecords(preState,{payload}){
      const {chatRecords}=preState;
      const {targetAccount}=payload;
      const targetChatRecords=chatRecords[targetAccount]||[];

      const lastTime=getTimeString(targetChatRecords[targetChatRecords.length-1].date);
      const noMoreMessage={
        senderAccount:"sys",
        key:`${lastTime}${targetChatRecords.length} No more`,
        content:"No more chat records",
      };
      const timeMessage={
        senderAccount:"sys",
        key:`${lastTime}${targetChatRecords.length}`,
        content:lastTime,
      };
      return {
        ...preState,
        isSuccess:true,
        noMoreChatRecords:{...preState.noMoreChatRecords,[targetAccount]:targetAccount},
        chatRecords:{
          ...chatRecords,
          [targetAccount]:[noMoreMessage,timeMessage,...targetChatRecords]
        }
      };
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
        if(Object.is(chatRecords.length,0)){
          yield put({
            type:'addNoMoreChatRecords',
            isAnimate:false,
            payload:{
              targetAccount,
            }
          });
        }else{
          yield put({
            type:'getChatRecordsSuccess',
            isAnimate:false,
            payload:{
              targetAccount,
              chatRecords
            }
          });
        }

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
