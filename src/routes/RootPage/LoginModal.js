/**
 * Created by Administrator on 2017/3/31.
 */
import React from 'react';
import styles from './LoginModal.css';
import {Spin,Button} from 'antd';
const LoginModal=({loading,loginHandle})=>{
  return (
    <div className={styles['login-modal']}>
        <Spin spinning={loading} tip="正在登录">
            <Button onClick={loginHandle}>Login</Button>
        </Spin>
    </div>
  )
};


export default LoginModal;
