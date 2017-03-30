/**
 * Created by Administrator on 2017/3/28.
 */
import React from 'react';
import { Link} from 'dva/router';
import { connect } from 'dva';
const RootPage=({children})=>{
  return <div>
    <h1>Root Page</h1>
    <ul>
      <li><Link to="/">首页</Link></li>
      <li><Link to="/login">登录</Link></li>
      <li><Link to="/app">App</Link></li>
      <li><Link to="/404">404</Link></li>
    </ul>
    <div>{children}</div>
  </div>
};

export default connect()(RootPage);
