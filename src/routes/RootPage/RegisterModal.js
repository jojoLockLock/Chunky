/**
 * Created by jojo on 2017/5/2.
 */
import React from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Row, Col, Checkbox, Button ,Spin} from 'antd';
const FormItem = Form.Item;

import styles from './RegisterModal.css';


class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('userPassword')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className={styles["register-form"]}>
        <FormItem

          label="Account"
          hasFeedback
        >
          {getFieldDecorator('userAccount', {
            rules: [ {
              required: true, message: 'Please input your account!',
            }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem

          label="Password"
          hasFeedback
        >
          {getFieldDecorator('userPassword', {
            rules: [{
              required: true, message: 'Please input your password!',
            }, {
              validator: this.checkConfirm,
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem
          label="Confirm Password"
          hasFeedback
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: this.checkPassword,
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} />
          )}
        </FormItem>
        <FormItem

          label={(
            <span>
              Nickname&nbsp;
              <Tooltip title="What do you want other to call you?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
          hasFeedback
        >
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem

          label={"Invitation code"}
          hasFeedback
        >
          {getFieldDecorator('invitationCode', {
            rules: [{ required: true, message: 'Please input your invitation code!', whitespace: true }],
          })(
            <Input />
          )}
        </FormItem>

        <FormItem>
          <Button type="primary"
                  htmlType="button"
                  style={{width:"100%"}}
                  size="large" onClick={this.handleSubmit}>Register</Button>
          Already have an account? &nbsp;<a onClick={this.props.changeToLogin}>Go to login</a>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalRegisterForm = Form.create()(RegistrationForm);
const RegisterModal=({loading,registerHandle,changeToLogin})=>{
  return (
    <div className={styles['register-modal']}>
      <Spin spinning={loading} tip="正在注册">
        <WrappedNormalRegisterForm registerHandle={registerHandle} changeToLogin={changeToLogin}/>
      </Spin>
    </div>
  )
};
export default RegisterModal;
