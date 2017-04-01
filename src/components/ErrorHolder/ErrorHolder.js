/**
 * Created by Administrator on 2017/4/1.
 */
import React from 'react';
import {Icon} from 'antd';
import styles from './ErrorHolder.css';
import classnames from 'classnames';

const ErrorHolder=({className,children})=>{
  let classes=classnames({
      [styles['error-holder']]:true,
      [className]:className||false
  });
  return (
    <p className={classes}>
        <Icon type="frown"/>{children||"发生未知错误"}
    </p>
  )
};
const {PropTypes}=React;
ErrorHolder.propTypes={
    className:PropTypes.string,
};

export default ErrorHolder;
