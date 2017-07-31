/**
 * Created by 13944 on 2017/7/30.
 */
import React from 'react';
import UserDataForm from './UserDataForm';
import {Row,Col,Button,Menu, Icon,Spin,Upload,message as Message} from 'antd';
import styles from './UserCenter.css';
import JoIcon from '../components/JoIcon/JoIcon';
import { connect } from 'dva';


class UserCenter extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      activeKey:"icon",
      loading:false,
      file:null,
    }
  }
  handleClick=(item)=>{
    this.setState({
      activeKey:item.key,
    })
  }
  getIconForm=()=>{
    const { loading } = this.state;
    const props = {
      action: '',
      beforeUpload: (file) => {

        if(file.size/1024/1024>2){
          Message.error("Not allowed over 2M size")
          return false;
        }
        if(!file.name.endsWith(".jpg")){
          Message.error("Can only receive jpg or png")
          return false;
        }
        if(!file.name.endsWith(".png")){
          Message.error("Can only receive jpg or png")
          return false;
        }
        this.setState({
          file,
        })

        return false;
      },
    };

    const {data}=this.props;
    return <div>
      <div className={styles["user-icon"]}>
        <img src={data.icon}/>
      </div>
      <Upload {...props} >
        <Button style={{width:"150px"}}>
           Upload new icon
        </Button>
      </Upload>
    </div>
  }
  getBasicForm=()=>{
    const {data}=this.props;

    return <UserDataForm defaultValue={{userName:data.userName}}/>
  }
  getForm=()=>{
    const {activeKey}=this.state;
    if(activeKey==='icon'){
      return this.getIconForm();
    }
    if(activeKey==="basic-data"){
      return this.getBasicForm();
    }
    return null;
  }
  render() {
    return <div>
      <Spin spinning={this.state.loading}>
        <Row type="flex" gutter={10}>
          <Col span={6}>
            <Menu defaultSelectedKeys={[this.state.activeKey]}
                  onClick={this.handleClick}
                  mode="inline">
              <Menu.Item key="icon">
                <JoIcon type="pig"/>&nbsp;
                <span>Icon</span>
              </Menu.Item>
              <Menu.Item key="basic-data">
                <JoIcon type="doc-file"/>&nbsp;
                <span>Basic data</span>
              </Menu.Item>
            </Menu>
          </Col>
          <Col span={16}>
            {
              this.getForm()
            }
          </Col>

        </Row>
      </Spin>
    </div>
  }
}

function mapStateToProps(state) {
  return {
    data:state.user.data,

  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    uploadIcon:(icon)=>{
      return new Promise((resolve,reject)=>{
        dispatch({
          type:"user/uploadIcon",
          payload:{
            icon,
          },
          resolve,
          reject,
        })
      })
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(UserCenter);
