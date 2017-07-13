/**
 * Created by jojo on 2017/7/13.
 */
import * as services from './ChatServices';

const initState={
  isSuccess:false,
  isError:false,
  isConnect:false,
  activeChat:null,
  noMoreChatRecords:{},
  chatRecords:{

  },
  socket:null
};

export default {

  namespace: 'chat',

  state: initState,

  reducers: {
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
      const {userAccount,records}=payload;
      const {chatRecords}=preState;
      return {
        ...preState,
        chatRecords:{
          ...chatRecords,
          [userAccount]:[
            ...records,
            ...chatRecords[userAccount]
          ]
        }
      }
    }
  },

  effects: {
    *getChatRecords({payload,resolve,reject},{call,put,select}) {

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
      const socket=yield yield call(services.connectSocket,{
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
      yield put({
        type:"addNewMessage",
        payload:{
          userAccount:payload.to,
          message:{
            ...payload,
            from:data.userAccount,
            activeDate:nowTimestamp,
            key:`${nowTimestamp}-${payload.to}`
          }
        }
      })
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
