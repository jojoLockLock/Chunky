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
    logout(preState){
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
    *login({payload:userData},{call,put}) {
      const result = yield call(loginService.login,userData);
      const {userId,userName,userKey,message,addressList}=result.userData;
      if(result.responseCode==1){
        yield put({
          type:'loginSuccess',
          payload:{
            userId,
            userName,
            userKey,
            message,
            addressList,
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
