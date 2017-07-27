/**
 * Created by jojo on 2017/7/19.
 */
import React from 'react';
import {Input,Spin,Icon,Button,Checkbox} from 'antd';
import styles from './QueryFrame.css';

export default class QueryUser extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      loading:false,
      value:"",
      result:null,
      hideInFriendList:true,
      disabled:{

      }
    }
  }
  componentDidMount=()=>{
    $(this.target).niceScroll({cursorborder:"",cursorcolor:"#cccccc",boxzoom:false})
  }
  onQuery=()=>{

    if(this.state.value.trim().length===0){
      return;
    }

    this.setState({
      loading:true,
      result:null,
    })

    this.props.queryUser&&this.props.queryUser(this.state.value)
      .then(result=>{

        this.setState({
          result
        })

      }).catch(msg=>{

        console.error(msg);

      }).then(()=>{

        this.setState({
          loading:false
        })

      })
  }
  onChange=(e)=>{
    this.setState({
      value:e.target.value,
    })
  }
  checkOnChange=(e)=>{
    this.setState({
      hideInFriendList:e.target.checked,
    })
  }
  getPutUserFriendRequest=(targetAccount)=>{
    return ()=>{
      this.setState({
        disabled:{
          ...this.state.disabled,
          [targetAccount]:true
        }
      })
      this.props.putUserFriendRequest&&this.props.putUserFriendRequest(targetAccount)
      this.timer=setTimeout(()=>{
        this.setState({
          disabled:{
            ...this.state.disabled,
            [targetAccount]:false,
          }
        })
      },5000);
    }
  }
  componentWillUnmount=()=>{
    clearTimeout(this.timer);
  }
  getQueryResultPanel=()=>{

    const {result,hideInFriendList}=this.state,
          {friendList}=this.props;

    if(result.length===0){
      return (
        <p style={{textAlign:"center"}}>
          <Icon type="frown"/>&nbsp; 未找到任何结果
        </p>
      )
    }

    const rows=[];

    result.forEach(i=>{

      let inFriendList=friendList.some(f=>{
        return f.userAccount===i.userAccount;
      });

      if(inFriendList&&hideInFriendList){
        return
      }

      let {userAccount,userName}=i;
      rows.push(
        <tr key={userAccount}
            className={styles["query-item"]}>
          <td>
            {userName}
          </td>
          <td>
            <Button type="primary"
                    style={{width:"80px"}}
                    onClick={this.getPutUserFriendRequest(userAccount)}
                    disabled={inFriendList||this.state.disabled[userAccount]}>
              {inFriendList?"已添加":"添加"}
            </Button>
          </td>
        </tr>
      );
    })


    return (
      <table className={styles["query-result"]}>
        <tbody>
          {rows}
        </tbody>
      </table>
    )




  }
  render() {


    return (
      <div style={{
        width:"100%",
        textAlign:"left",
        overflow:"auto",
        height:"100%"}}
           ref={target=>this.target=target}>

          <Input.Search onChange={this.onChange}
                        onSearch={this.onQuery}
                        disabled={this.state.loading}/>

          <Checkbox style={{color:"#919191",userSelect:"none"}}
                    onChange={this.checkOnChange}
                    checked={this.state.hideInFriendList}>
            不显示已添加的好友
          </Checkbox>

          <div style={{marginTop:"15px",width:"100%",height:"100%"}}
               >

            {this.state.result!==null
              ?
              this.getQueryResultPanel()
              :
              null}

          </div>
      </div>
    )
  }
}


