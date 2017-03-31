
/**
 * Created by Administrator on 2017/3/28.
 */
import React from 'react';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim'
const ErrorPage=()=>{
  return (
    <QueueAnim duration={800} animConfig={{ opacity: [1, 0], translateY: [0, 100] }}>
      <div  key="error">
        <h1>404 Error Page</h1>
      </div>
    </QueueAnim>
  )
};

export default connect()(ErrorPage);
