/**
 * Created by jojo on 2017/7/19.
 */
import React from 'react';
import {Input,Spin,Icon,Button} from 'antd';
import styles from './QueryUser.css';

export default class QueryUser extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      loading:false,
      value:"",
      result:null
    }
  }
  onQuery=()=>{

    this.setState({
      loading:true,
      result:null,
    })

    this.props.queryUser&&this.props.queryUser(this.state.value)
      .then(result=>{

        this.setState({
          result
        })

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
  getPutUserFriendRequest=(targetAccount)=>{
    return ()=>{
      this.props.putUserFriendRequest&&this.props.putUserFriendRequest(targetAccount)
    }
  }
  render() {
    return (
      <div style={{width:"100%"}}>

          <Input.Search onChange={this.onChange}
                        onSearch={this.onQuery}
                        disabled={this.state.loading}/>
          <div style={{marginTop:"15px",width:"100%"}}>

            {this.state.result!==null
              ?
              (this.state.result.length!==0
                  ?
                  <table className={styles["query-result"]}>
                    <tbody>
                      {this.state.result.map(i=>{
                        return (
                          <tr key={i.userAccount}
                              className={styles["query-item"]}>
                            <td>
                              {i.userName}
                            </td>
                            <td>
                              <Button type="default"
                                      onClick={this.getPutUserFriendRequest(i.userAccount)}
                                      icon="user-add">
                                添加
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  :
                  <p style={{textAlign:"center"}}>
                    <Icon type="frown"/>&nbsp; 未找到任何结果
                  </p>
              )
              :null}

          </div>
      </div>
    )
  }
}


