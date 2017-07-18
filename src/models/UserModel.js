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

        resolve&&resolve(res.payload);

      }else{
        reject&&reject(res.message);
      }

    },
    *sortFriendListByActiveDate({payload,resolve,reject},{call,put,select}) {

      const {friendList=[]}=yield select(state=>state.user.data||{})
      const {chatRecords}=yield select(state=>state.chat);


      friendList.sort((before,after)=>{

        const beforeRecords=chatRecords[before]||[],
              afterRecords=chatRecords[after]||[];

        return parseInt((afterRecords[afterRecords.length-1]||{}).activeDate||0)-
          parseInt((beforeRecords[beforeRecords.length-1]||{}).activeDate||0)
      })
      yield put({
        type:"setFriendList",
        payload:friendList
      })
    },
    *setFriendItemToTopByUserAccount({payload,resolve,ject},{call,put,select}) {
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

    }
  }
}
