/**
 * Created by 13944 on 2017/7/30.
 */
import React from 'react';
import UserDataForm from './UserDataForm';
import {Row,Col} from 'antd';
export default class extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    return <div>
      <UserDataForm/>
    </div>
  }
}
