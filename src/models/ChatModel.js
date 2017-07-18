/**
 * Created by jojo on 2017/7/13.
 */
import * as services from './ChatServices';
import moment from 'moment';

const initState={
  isSuccess:false,
  isError:false,
  isConnect:false,
  activeChat:null,
  noMoreChatRecords:{},
  chatRecords:{

  },
  socket:null,
  messageCount:{

  },
  isChatRecordsInit:false,
};

export default {

  namespace: 'chat',

  state: initState,

  reducers: {

    setMessageCount(preState,{payload}) {
      const {userAccount,count=0}=payload;
      return {
        ...preState,
        messageCount:{
          ...preState.messageCount,
          [userAccount]:count,
        }
      }
    },
    setSocketConnectState(preState,{payload}) {
      return {
        ...preState,
        isConnect:payload
      }
    },
    setSocket(preState,{payload}) {
      return {
        ...preState,
        socket:payload,
      }
    },
    addNewMessage(preState,{payload}) {
      const {userAccount,message}=payload;
      const {chatRecords}=preState;
      return {
        ...preState,
        chatRecords:{
          ...chatRecords,
          [userAccount]:[
            ...chatRecords[userAccount]||[],
            message,
          ]
        }
      }
    },
    addChatRecords(preState,{payload}) {
      const {userAccount,records}=payload,
            {chatRecords}=preState,
            targetRecords=chatRecords[userAccount]||[];

      return {
        ...preState,
        chatRecords:{
          ...chatRecords,
          [userAccount]:[
            ...records||[],
            ...targetRecords
          ]
        }
      }
    },
    initChatRecords(preState,{payload}) {
      return {
        ...preState,
        isChatRecordsInit:true,
        chatRecords:{
          ...payload
        }
      }
    },
    setNoMoreChatRecords(preState,{payload}) {
      const {noMoreChatRecords}=preState;

      const increaseNoMoreChatRecords={};

      (payload||[]).forEach(u=>{
        increaseNoMoreChatRecords[u]=true;
      })

      return {
        ...preState,
        noMoreChatRecords:{
          ...noMoreChatRecords,
          ...increaseNoMoreChatRecords
        }
      };
    }
  },

  effects: {
    *getChatRecords({payload,resolve,reject},{call,put,select}) {

      const {isLogin,token}=yield select(state=>state.user);

      if(!isLogin){
        return
      }

      const res=yield call(services.getChatRecords,{...payload,token})

      if(res.status!==1){
        return reject&&reject(res.message);
      }

      const {data}=res.payload,
            {targetAccount}=payload;

      if(data.length!==0){

        yield put({
          type:"addChatRecords",
          payload:{
            userAccount:targetAccount,
            records:data.map(i=>({
              ...i,
              key:i._id,
              type:i.from===targetAccount?"left":"right"
            }))
          }
        })

      }else{

        yield put({
          type:"setNoMoreChatRecords",
          payload:[targetAccount]
        })

      }
      resolve&&resolve();

    },
    *getAllChatRecords({resolve,reject},{call,put,select}) {
      const {isLogin,token,data}=yield select(state=>state.user);

      if(!isLogin){
        return
      }
      const {friendList}=data;
      const res=yield call(services.getAllChatRecords,{
        token,
        limit:15,
        skip:0,
        targetAccount:friendList.map(f=>f.userAccount)
      })

      if(res.status!==1){
        return reject&&reject(res.message);
      }

      const chatRecords=res.payload,
            increaseNoMoreChatRecrods=[];

      Object.keys(chatRecords||{}).forEach((k,index)=>{
        if(chatRecords[k].data.length===0){
          increaseNoMoreChatRecrods.push(k);
        }
        chatRecords[k]=chatRecords[k].data.map(i=>({
          ...i,
          key:i._id,
          type:i.from===k?"left":"right"
        }))
      })


      yield put({
        type:"initChatRecords",
        payload:chatRecords
      })

      yield put({
        type:"setNoMoreChatRecords",
        payload:increaseNoMoreChatRecrods
      })

      resolve&&resolve();
    },
    *initSocket({payload,resolve,reject},{call,put,select}) {
      const {isConnect}=yield select(state=>state.chat);
      const {isLogin,token}=yield select(state=>state.user);

      if(isConnect){
        return
      }

      if(!isLogin){
        return
      }
      const {onClose,controllers}=payload;
      const socket=yield call(services.connectSocket,{
        token,
        onClose,
      })

      Object.keys(controllers||{}).forEach(key=>{
        socket.addController(key,controllers[key]);
      })

      yield put({
        type:"setSocket",
        payload:socket,
      })

      yield put({
        type:"setSocketConnectState",
        payload:true
      })

    },
    *sendMessage({payload,resolve,reject},{call,put,select}) {
      const {isConnect,socket}=yield select(state=>state.chat);
      const {isLogin,data}=yield select(state=>state.user);
      if(!isConnect){
        return reject&&reject("socket is not connect");
      }

      if(!isLogin){
        return reject&&reject("have not login");
      }

      yield socket&&socket.sendMessage("boardCast",{
        ...payload
      }).then(()=>{
        resolve&&resolve();
      }).catch(e=>{
        reject&&reject(e.message)
      })

      let nowTimestamp=new Date().getTime();

      payload={
        userAccount:payload.to,
        message:{
          ...payload,
          from:data.userAccount,
          activeDate:nowTimestamp,
          key:`${nowTimestamp}-${payload.to}`,
          type:"right"
        }
      }

      yield put({
        type:"addNewMessage",
        payload,
      })

      socket.sendMessage("boardCast",payload);
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
