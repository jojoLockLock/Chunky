
/**
 * Created by Administrator on 2017/3/28.
 */
import React from 'react';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim'
import ErrorHolder from '../../components/ErrorHolder/ErrorHolder';
const ErrorPage=()=>{
  return (
    <QueueAnim duration={800} animConfig={{ opacity: [1, 0], translateY: [0, 100] }}>
      <div  key="error">
        <ErrorHolder>
          {"居然被你找到了 404"}
        </ErrorHolder>
      </div>
    </QueueAnim>
  )
};

export default connect()(ErrorPage);
