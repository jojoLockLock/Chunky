/**
 * Created by Administrator on 2017/3/31.
 */
import React from 'react';
import styles from './LoginModal.css';
import {Spin,Button,Form, Icon, Input, Checkbox } from 'antd';
import classnames from 'classnames';
const FormItem = Form.Item;


class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.loginHandle(values);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    let classes=classnames({
      [styles["login-form"]]:true
    });
    return (
      <Form className={classes}>
        <FormItem>
          {getFieldDecorator('userAccount', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input onPressEnter={this.handleSubmit}
                   prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('userPassword', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input onPressEnter={this.handleSubmit}
                   prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
          )}
        </FormItem>

        <FormItem>

          <Button type="primary"
                  style={{width:"100%"}}
                  htmlType="button"
                  className="login-form-button"
                  onClick={this.handleSubmit}>

            Log in
          </Button >
          Don't have an account? &nbsp;<a onClick={this.props.changeToRegister}>Go to register</a>
        </FormItem>
      </Form>
    );
  }
}
const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
const LoginModal=({loading,loginHandle,changeToRegister})=>{
  return (
    <div className={styles['login-modal']}>
      <Spin spinning={loading} tip="正在登录">
        <WrappedNormalLoginForm loginHandle={loginHandle} changeToRegister={changeToRegister}/>
      </Spin>
    </div>
  )
};
export default LoginModal;
