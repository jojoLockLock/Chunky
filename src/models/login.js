import * as loginService from '../services/login';
import {message} from 'antd';
import {GLOBAL_MSG_DURATION} from '../config/componentConfig';

const initState={
  isLogin:false,
  isSuccess:false,
  isError:false,
  loginData:{
    addressList:[]
  },
};

export default {

  namespace: 'log',

  state: initState,

  reducers: {

    loginSuccess(preState,{payload}) {
      return {
        ...preState,
        isLogin:true,
        isSuccess:true,
        loginData:payload,
      };
    },

    loginError(preState,{payload}) {
      return {
        ...preState,
        isError:true,
        loginData:payload,
      }
    },
    logout(){
      return initState;
    },
    sessionLogin(preState,{payload}) {
      return {
        ...preState,
        isLogin:true,
        isSuccess:true,
        loginData:payload,
      }
    }
  },

  effects: {
    *login({payload},{call,put}) {
      const result = yield call(loginService.login,payload);
      const {token,userData,addressList,status}=result;
      if(Object.is(status,1)){
        yield put({
          type:'loginSuccess',
          payload:{
            userData,
            token,
            addressList,
            userAccount:payload.userAccount
          }
        });
        message.info(message,GLOBAL_MSG_DURATION);
      }else{
        yield put({
          type:'loginError',
          payload:{
            message
          }
        });
        throw new Error(result.message);
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
