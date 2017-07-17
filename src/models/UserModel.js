/**
 * Created by jojo on 2017/7/13.
 */
import * as services from './UserServices';
const initState={
  isLogin:false,
  data:null,
  token:null,
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
    initUserData(preState,{payload}) {
      return initState;
    }

  },

  effects:{
    *login({payload,resolve,reject},{call,put,select}) {
      const res=yield call(services.login,{...payload});
      if(res.status===1){
        yield put({
          type:"setUserData",
          payload:{
            ...res.payload,
            userAccount:payload.userAccount
          }
        })

        resolve&&resolve(res.payload);

      }else{
        reject&&reject(res.message);
      }

    }
  }
}
