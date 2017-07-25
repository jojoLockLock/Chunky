/**
 * Created by Administrator on 2017/3/31.
 */
import React from 'react';
import {Spin,Button,Form, Icon, Input, Checkbox } from 'antd';
import classnames from 'classnames';
const FormItem = Form.Item;


class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit&&this.props.onSubmit(values);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form >
        <FormItem label="Account">
          {getFieldDecorator('userAccount', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input onPressEnter={this.handleSubmit}
                   prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                   placeholder="" />
          )}
        </FormItem>
        <FormItem label="Password">
          {getFieldDecorator('userPassword', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input onPressEnter={this.handleSubmit}
                   prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                   type="password"
                   placeholder="" />
          )}
        </FormItem>

        <FormItem >

          <Button type="primary"
                  style={{width:"100%"}}
                  htmlType="button"
                  className="login-form-button"
                  onClick={this.handleSubmit}>

            Sign in
          </Button >
          {/*Don't have an account? &nbsp;*/}
          {/*<a onClick={this.props.switchFrame}>Go to register</a>*/}
        </FormItem>
      </Form>
    );
  }
}
export default Form.create()(NormalLoginForm);

