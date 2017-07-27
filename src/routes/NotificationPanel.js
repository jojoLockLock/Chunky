/**
 * Created by jojo on 2017/7/24.
 */
import React from 'react';
import {Button} from 'antd';
import UserList from '../components/UserList/UserList';
export default class NotificationPanel extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      loading:{

      }
    }
  }
  getResHandle=(targetAccount,resCode)=>{
    return ()=>{

      this.setState({
        loading:{
          ...this.state.loading,
          [targetAccount]:true
        }
      })

      this.props.patchUserFriendRequest(targetAccount,resCode)
        .then(result=>{

          this.setState({
            loading:{
              ...this.state.loading,
              [targetAccount]:false,
            }
          })

          this.props.getFriendNotifications({limit:15,skip:0})
          this.props.getBasicData();
        });
    }
  }
  componentDidMount=()=>{
    // this.props.getFriendNotifications({limit:15,skip:0})
  }
  render() {
    const {data=[],patchUserFriendRequest}=this.props;
    return <div>
      <UserList data={
        data.map(i=>{
          const {userAccount}=i;
          return {
            icon:i.data.icon,
            count:0,
            subtext:`${userAccount}`,
            title:i.data.userName,
            key:`${i.userAccount}-notification`,
            time:i.resCode===0
              ?<Button onClick={this.getResHandle(userAccount,1)}>
                Accept</Button>
              : <span>Has accept</span>
          }
        })
      }/>
    </div>
  }
}


