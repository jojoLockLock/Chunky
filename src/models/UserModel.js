/**
 * Created by jojo on 2017/7/13.
 */
import * as services from './UserServices';

const userData=JSON.parse(sessionStorage.getItem("userData"))||{};
const {token,data,userAccount}=userData;
const isLogin=token&&data&&userAccount;



const initState={
  isLogin:isLogin,
  data:data&&userAccount?{...data,userAccount}:null,
  token:token||null,
  notifications:{
    friendRequest:[]
  },
  haveNew:{
    notifications:false,
    chats:false,
  },
}



export default {

  namespace: "user",

  state:initState,

  reducers:{
    setUserData(preState,{payload}) {
      return {
        ...preState,
        isLogin:true,
        data:{
          ...payload.data,
          userAccount:payload.userAccount
        },
        token:payload.token,
      }
    },
    setFriendList(preState,{payload}) {
      return {
        ...preState,
        data:{
          ...preState.data||{},
          friendList:payload,
        }
      }
    },
    addFriendNotifications(preState,{payload}) {

      const {notifications}=preState;

      const newNotifications=[];


      (notifications.friendRequest||[]).map(fr=>{
        let isExist=(payload||[0]).some(nfr=>{
          return nfr.userAccount===fr.userAccount
        })

        if(!isExist){
          newNotifications.push(fr);
        }

      })
      return {
        ...preState,
        notifications:{
          ...notifications,
          friendRequest:[
            ...newNotifications,
            ...payload,
          ]
        }
      }
    },
    initUserData(preState,{payload}) {
      return {
        isLogin:false,
        data:null,
        token:null,
        notifications:{
          friendRequest:[]
        }
      }
    },
    setHaveNew(preState,{payload}) {

      const {type,value}=payload;

      return {
        ...preState,
        haveNew:{
          ...preState.haveNew,
          [type]:!!value,
        }
      }
    },
    setFriendNotifications(preState,{payload}) {
      return {
        ...preState,
        notifications:{
          ...preState.notifications,
          friendRequest:payload,
        }
      }
    }

  },

  effects:{
    *login({payload,resolve,reject},{call,put,select}) {
      const res=yield call(services.login,{...payload});
      if(res.status===1){

        const finalPayload={
          ...res.payload,
          userAccount:payload.userAccount
        }

        yield put({
          type:"setUserData",
          payload:finalPayload
        })

        sessionStorage.setItem("userData",JSON.stringify(finalPayload));

        const unreadMessagesCount={};
        let count=0;

        res.payload.data.unreadMessagesCount.map(urm=>{
          count+=urm.count;
          unreadMessagesCount[urm.userAccount]=urm.count;
        });

        yield put({
          type:"chat/setAllMessagesCount",
          payload:unreadMessagesCount,
        })

        if(res!==0){
          yield put({
            type:"setHaveNew",
            payload:{
              type:"chats",
              value:true
            }
          })
        }

        resolve&&resolve(res.payload);

      }else{
        reject&&reject(res.message);
      }

    },
    *logout({payload,resolve,reject},{call,put,select}) {
      window.sessionStorage.clear();
      // yield put({
      //   type:"initUserData"
      // })
      window.location.reload();

    },
    *sortFriendListByActiveDate({payload,resolve,reject},{call,put,select}) {

      const {friendList=[]}=yield select(state=>state.user.data||{})
      const {chatRecords}=yield select(state=>state.chat);


      friendList.sort((before,after)=>{

        const beforeRecords=chatRecords[before.userAccount]||[],
              afterRecords=chatRecords[after.userAccount]||[];

        return parseInt((afterRecords[afterRecords.length-1]||{}).activeDate||0)-
          parseInt((beforeRecords[beforeRecords.length-1]||{}).activeDate||0);
      })

      yield put({
        type:"setFriendList",
        payload:friendList
      })

    },
    *setFriendItemToTopByUserAccount({payload,resolve,reject},{call,put,select}) {
      const {userAccount}=payload;
      const {friendList=[]}=yield select(state=>state.user.data||{})

      let flag=-1;

      friendList.some((f,index)=>{
        if(f.userAccount===userAccount){
          flag=index;
          return true;
        }
      })

      if(flag===-1){
        return;
      }

      yield put({
        type:"setFriendList",
        payload:[
          friendList[flag],
          ...friendList.slice(0,flag),
          ...friendList.slice(flag+1),
        ]
      })

    },
    *queryUser({payload,resolve,reject},{call,put,select}){
      const {value}=payload;
      const {isLogin,token}=yield select(state=>state.user);

      const res=yield call(services.queryUser,{value,token});

      if(res.status===1){
        resolve&&resolve([res.payload])

      }else{

        reject&&reject(res.message);

      }
    },
    *putUserFriendRequest({payload,resolve,reject},{call,put,select}) {
      const {token}=yield select(state=>state.user);

      const res=yield call(services.putUserFriendRequest,{...payload,token});

      if(res.status===1){

        resolve&&resolve()

      }else{

        reject&&reject(res.message);

      }
    },
    *patchUserFriendRequest({payload,resolve,reject},{call,put,select}) {
      const {token,notifications}=yield select(state=>state.user);
      const {friendRequest}=notifications;

      friendRequest.some((fr,index)=>{
        if(fr.userAccount===payload.targetAccount){
          fr[index]={
            ...fr[index],
            resCode:payload.resCode
          }
        }
      })

      yield put({
        type:"setFriendRequest",
        payload:friendRequest
      })

      const res=yield call(services.patchUserFriendRequest,{...payload,token});

      if(res.status===1){

        resolve&&resolve()

      }else{

        reject&&reject(res.message);

      }
    },
    *getFriendNotifications({payload,resolve,reject},{call,put,select}) {
      const {token}=yield select(state=>state.user);

      const res=yield call(services.getFriendNotifications,{...payload,token});

      if(res.status===1){
        yield put({
          type:"addFriendNotifications",
          payload:res.payload.data,
        })
        resolve&&resolve()

      }else{

        reject&&reject(res.message);

      }
    },
    *getBasicData({payload,resolve,reject},{call,put,select}) {
      const {token,data}=yield select(state=>state.user);

      if(!token){
        return;
      }

      const res=yield call(services.getBasicData,{token})
      if(res.status===1){
        const {userAccount}=data;

        const finalPayload={
          ...res.payload,
          token,
          userAccount,

        }

        yield put({
          type:"setUserData",
          payload:finalPayload
        })

        const unreadMessagesCount={}
        let count=0;

        res.payload.data.unreadMessagesCount.map(urm=>{
          count+=0;
          unreadMessagesCount[urm.userAccount]=urm.count;
        });

        yield put({
          type:"chat/setAllMessagesCount",
          payload:unreadMessagesCount,
        })

        if(res!==0){
          yield put({
            type:"setHaveNew",
            payload:{
              type:"chats",
              value:true
            }
          })
        }

        resolve&&resolve();
      }else{
        reject&&reject(res.message);
      }

    },
    *register({payload,resolve,reject},{call,put,select}) {
      const res=yield call(services.register,{...payload||{}})

      if(res.status===1){
        resolve&&resolve();
      }else{
        reject&&reject(res.message);
      }
    },
    *patchBasicData({payload,resolve,reject},{call,put,select}) {
      const res = yield call(services.patchBasicData,{...payload||{}});
      if(res.status===1){
        resolve&&resolve();
      }
    }
  }
}
