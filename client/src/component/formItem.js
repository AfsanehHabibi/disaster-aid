import React from 'react';
import { SimpleMap } from 'component/map.js';
import { Form, Input, Button, InputNumber, DatePicker, Select } from 'antd';
const { Option } = Select;


export class FormItem extends React.Component {

    render() {
      let inputBox;
      if (this.props.description.options && Array.isArray(this.props.description.options) 
      && this.props.description.options.length) {
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
              return (<Option value={answer.value}>{answer.label}</Option>)
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
  
  