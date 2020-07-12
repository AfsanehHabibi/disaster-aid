import React from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Button, InputNumber, DatePicker, Select } from 'antd';
import { NotFound } from 'component/notFound';
import { Spin, Alert, message } from 'antd';
import { SimpleMap } from 'component/map.js';
const axios = require('axios').default;
const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
export class FormClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      formDescriptor: {},
      loadNotFound: false,
      submisionState: 'none'
    };
  }
  componentDidMount() {
    const { handle } = this.props.match.params
    axios.get(`https://secret-chamber-63894.herokuapp.com/api/forms/${handle}`)
      .then(res => {
        this.setState({
          loading: false,
          formDescriptor: res.data
        });
      })
      .catch((e) => {
        this.setState({
          loading: false,
          loadNotFound: true
        });
        console.error(e);
      });
  }
  informUser = () => {
    message
      .loading('Action in progress..', 2.5)
      .then(() => {
        if (!this.state.loading) {
          if (this.state.submisionState === 'successful') {
            message.success('form submitted', 2.5)
          } else {
            message.error('something went wrong', 2.5)
          }
        }
      })
  };
  onFinish = values => {
    this.state.formDescriptor.fields.forEach(element => {
      if (element.options) {
        if (values[element.name] !== undefined) {
          values[element.name] = JSON.parse(values[element.name]);
        }
      } else if (element.type === "Location") {
        if (values[element.name] !== undefined)
          values[element.name].value = JSON.parse(values[element.name].value);
      }
    });
    this.informUser();
    axios.post(`https://secret-chamber-63894.herokuapp.com/api/forms/${this.state.formDescriptor.id}`, { values })
      .then(res => {
        this.setState({
          submisionState: 'successful'
        })
        
      })
      .catch(res => {
        this.setState({
          submisionState: 'error'
        })
        
      })
  };

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  render() {
    let output;
    if (this.state.loading) {
      output = (<div><Spin tip="Loading..." size="large" /></div>);
    } else if (this.state.loadNotFound) {
      output = (<NotFound />);
    }
    else {
      if (!this.state.formDescriptor.fields) {
        output = (<Alert
          message="Error"
          description="Form has no item to fill"
          type="error"
          showIcon
        />)
      }
      else {
        output = (<div><Form
          {...layout}
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          {this.state.formDescriptor.fields.map((answer, i) => {
            return (<FormItem description={answer} />)
          })}
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
      </Button>
          </Form.Item>
        </Form></div>);
      }
    }
    return (
      <div>
        {output}
      </div>
    );
  }
}
class FormItem extends React.Component {

  render() {
    let inputBox;
    if (this.props.description.options) {
      inputBox = (<Form.Item
        label={this.props.description.title}
        name={this.props.description.name}
        rules={[
          {
            required: this.props.description.required,
            message: 'Please choose on option!',
          },
        ]}
      ><Select placeholder="Select option">
          {this.props.description.options.map((answer, i) => {
            return (<Option value={JSON.stringify(answer.value)}>{answer.label}</Option>)
          })}
        </Select></Form.Item>);
    } else if (this.props.description.type === "Text") {
      inputBox = (<Form.Item
        label={this.props.description.title}
        name={this.props.description.name}
        rules={[
          {
            required: this.props.description.required,
            message: 'Please fill the input!',
          },
        ]}
      ><Input /></Form.Item>);
    } else if (this.props.description.type === "Location") {
      inputBox = <Form.Item name={this.props.description.name}
        label={this.props.description.title}
        rules={[
          {
            required: this.props.description.required,
            message: 'Please choose a location!',
          },
        ]}
      >
        <SimpleMap />
      </Form.Item>
    } else if (this.props.description.type === "Number") {
      inputBox = (<Form.Item
        label={this.props.description.title}
        name={this.props.description.name}
        rules={[
          {
            required: this.props.description.required,
            message: 'Please input a number!',
          },
        ]}
      ><InputNumber formatter={value => `${value}`.replace(/[^.\d]/g, '')}
        parser={value => value} /></Form.Item>);
    } else if (this.props.description.type === "Date") {
      inputBox = (<Form.Item
        label={this.props.description.title}
        name={this.props.description.name}
        rules={[
          {
            required: this.props.description.required,
            message: 'Please pick a date!',
          },
        ]}
      ><DatePicker /></Form.Item>);
    }

    return (
      <div>{inputBox}</div>

    );
  }
}

