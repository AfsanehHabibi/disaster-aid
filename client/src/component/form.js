import React from 'react';
import 'antd/dist/antd.css';
import { Form, Button } from 'antd';
import { NotFound } from 'component/notFound';
import { Spin, Alert, message } from 'antd';
import { FormItem } from "component/formItem";
import { useQuery } from "@apollo/react-hooks";
import { useMutation } from '@apollo/react-hooks';
import gql from "graphql-tag";
import { formOutputToGraphqlInput } from "utilities/formater";
import { formByIdDes } from "api/graphqlQueryStr";
import { addFilledFormMID } from "api/graphqlMutationStr";


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


export class FormWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      handle: "invalidUrl"
    };
  }
  componentDidMount() {
    const { handle } = this.props.match.params
    this.setState({
      handle: handle
    })
    console.debug(handle)
  }
  render() {
    return this.state.handle === "invalidUrl" ? (<NotFound />) : <FormHook id={this.state.handle} />;
  }
}

export let FormHook = (props) => {

  const ADD_FORM = gql(addFilledFormMID());

  const { loading, error, data } = useQuery(gql(formByIdDes(props.id)))

  const [AddFilledForm, { loading: mutationLoading, error: mutationError, data: resData }] =
    useMutation(ADD_FORM);


  let onFinish = values => {
    console.debug(values)
    let fields_arr = formOutputToGraphqlInput(values, formDescriptor.fields)
    console.debug(fields_arr)
    AddFilledForm({
      variables: {
        input: { "fields": fields_arr }, filter: {
          "form_descriptor": {
            "id": formDescriptor.id,
            "title": formDescriptor.title
          }
        }
      }
    }).then((data) => {
      console.log(data)
      message.success('form submitted')
    }).catch((error) => {
      message.error('something went wrong')
      console.error(error)
    })
  };

  let onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  if (loading)
    return (<div><Spin tip="Loading..." size="large" /></div>);
  if (error){
    console.debug(error)
    return (<NotFound />);
  }
  try {
    let temp = data.formOneLooseMatch.form_descriptor
  } catch (error) {
    return (<NotFound />);
  }
  let formDescriptor = data.formOneLooseMatch.form_descriptor
  console.debug(formDescriptor)
  if (!formDescriptor.fields)
    return (<Alert
      message="Error"
      description="Form has no item to fill"
      type="error"
      showIcon
    />)
  return (<div><Form
    {...layout}
    name="basic"
    initialValues={{
      remember: true,
    }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
  >
    {formDescriptor.fields.map((answer, i) => {
      return (<FormItem description={answer} />)
    })}
    <Form.Item {...tailLayout}>
      <Button type="primary" htmlType="submit">
        Submit
    </Button>
    </Form.Item>
  </Form></div>);
}

