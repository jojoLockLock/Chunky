import * as loginService from '../services/login';
import {message} from 'antd';
import {GLOBAL_MSG_DURATION} from '../config/componentConfig';

const initState={
  isLogin:false,
  isSuccess:false,
  isError:false,
  loginData:null,
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
    }
  },
  
  effects: {
    *login({payload:userData},{call,put}) {
      const result = yield call(loginService.login,userData);
      const {userName,userKey,message}=result;
      if(result.responseCode==1){
        yield put({
          type:'loginSuccess',
          payload:{
            userName,
            userKey,
            message,
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
          
      })
    }
  },
}
