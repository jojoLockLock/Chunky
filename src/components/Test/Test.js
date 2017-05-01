/**
 * Created by JoJo on 2017/4/30.
 */
import React from 'react';
import styles from './Test.css';
import classnames from 'classnames';
import ReactDOM from 'react-dom';


class Test extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={styles['con']}>
        {this.props.children}
      </div>
    )
  }
}

export default Test;
