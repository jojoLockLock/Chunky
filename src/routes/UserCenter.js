/**
 * Created by 13944 on 2017/7/30.
 */
import React from 'react';
import UserDataForm from './UserDataForm';
import {Row,Col,Button,Menu, Icon,Spin} from 'antd';
import styles from './UserCenter.css';
import JoIcon from '../components/JoIcon/JoIcon';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
export default class extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      activeKey:"icon",
      loading:false,
    }
  }
  handleClick=(item)=>{
    this.setState({
      activeKey:item.key,
    })
  }
  getIconForm=()=>{
    const {data}=this.props;
    return <div>
      {/*<div style={{*/}
        {/*color:"rgba(0, 0, 0, 0.85)",*/}
        {/*height:"32px",*/}
        {/*lineHeight:"32px"}}>*/}
        {/*Icon:*/}
      {/*</div>*/}
      <div className={styles["user-icon"]}>
        <img src={data.icon}/>
      </div>
      <Button type="default"
              style={{width:"150px"}}>
        Upload new icon</Button>
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
