/**
 * Created by jojo on 2017/5/2.
 */
import React from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Row, Col, Checkbox, Button ,Spin} from 'antd';
const FormItem = Form.Item;



class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSubmit&&this.props.onSubmit(values);
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
      <Form>
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
          {getFieldDecorator('inviteCode', {
            rules: [{ required: true, message: 'Please input your invitation code!', whitespace: true }],
          })(
            <Input onPressEnter={this.handleSubmit}/>
          )}
        </FormItem>

        <FormItem>
          <Button type="primary"
                  htmlType="button"
                  style={{width:"100%"}}
                  size="large" onClick={this.handleSubmit}>Sign up</Button>
          {/*Already have an account? &nbsp;*/}
          {/*<a onClick={this.props.switchFrame}>Go to login</a>*/}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(RegistrationForm);

