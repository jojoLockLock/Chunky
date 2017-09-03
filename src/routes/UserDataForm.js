/**
 * Created by jojo on 2017/5/2.
 */
import React from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Row, Col, Checkbox, Button ,Spin} from 'antd';
const FormItem = Form.Item;



class RegistrationForm extends React.Component {
  state = {
    loading:false
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          loading:true
        })
        this.props.onSubmit&&this.props.onSubmit(values).then(()=>{
          this.setState({loading:false})
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {defaultValue={}}=this.props;
    const {userName=""}=defaultValue;
    const {loading}=this.state;
    return (
      <Form>
        <FormItem
          label={"Nickname"}
          // hasFeedback
          required={false}
        >
          {getFieldDecorator('userName', {
            initialValue:userName,
            rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
          })(
            <Input disabled={loading} />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary"
                  style={{width:"100%"}}
                  loading={loading}
                  size="large" onClick={this.handleSubmit}>Update</Button>

        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(RegistrationForm);

