/**
 * Created by jojo on 2017/7/24.
 */
import React from 'react';
import FriendList from '../components/FriendList/FrendList';
export default class NotificationPanel extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    console.info(this.props.data)
    return <div>
      <FriendList/>
    </div>
  }
}


