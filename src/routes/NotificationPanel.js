/**
 * Created by jojo on 2017/7/24.
 */
import React from 'react';
import {Button} from 'antd';
import UserList from '../components/UserList/UserList';
export default class NotificationPanel extends React.Component{
  constructor(props) {
    super(props);
  }
  getResHandle=(targetAccount,resCode)=>{
    return ()=>{
      this.props.patchUserFriendRequest(targetAccount,resCode);
    }
  }
  render() {
    const {data=[],patchUserFriendRequest}=this.props;
    return <div>
      <UserList data={
        data.map(i=>{
          return {
            icon:i.data.icon,
            count:0,
            subtext:`${i.userAccount}`,
            title:i.data.userName,
            key:`${i.userAccount}-notification`,
            time:i.resCode===0
              ?<Button onClick={this.getResHandle(i.userAccount,1)}>
                Accept</Button>
              : <span>Has accept</span>
          }
        })
      }/>
    </div>
  }
}


