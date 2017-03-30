import * as loginService from '../services/login';
import {message} from 'antd';
import {GLOBAL_MSG_DURATION} from '../config/componentConfig';

export default {
  
  namespace: 'login',
  
  state: {
    isLogin:false,
    isSuccess:false,
    isError:false,
    loginData:null,
  },
  
  reducers: {
    
    success(state,{payload}) {
      return {
        ...state,
        isLogin:true,
        isSuccess:true,
        loginData:payload,
      };
    },
    
    error(state,{payload}) {
      return {
        ...state,
        isError:true,
        loginData:payload,
      }
    }
  },
  
  effects: {
    *login({payload:userData},{call,put}) {
      const result = yield call(loginService.login,userData);
      const {userName,userKey,message}=result;
      if(result.responseCode==1){
        yield put({
          type:'success',
          payload:{
            userName,
            userKey,
            message,
          }
        });
        message.info(message,GLOBAL_MSG_DURATION);
      }else{
        yield put({
          type:'error',
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
          if (pathname === '/login') {
            dispatch({type:'login',payload:'??'});
          }
      })
    }
  },
}
