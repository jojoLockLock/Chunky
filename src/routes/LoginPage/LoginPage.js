/**
 * Created by Administrator on 2017/3/28.
 */
import React from 'react';
import { connect } from 'dva';
import styles from './LoginPage.css';

const LoginPage=({loading,login})=>{
    return <div>Login Page
    <pre>
      {JSON.stringify(loading,null,2)}
      
    </pre>
    <pre>
      {JSON.stringify(login,null,2)}
    </pre>
    </div>
};
const select=(state)=>{
    const {login}=state;
    return {
      loading:state.loading.models.login,
      login,
    }
};
export default connect(select)(LoginPage);
