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
import { formByIdDes, formByIdAll } from "api/graphqlQueryStr";
import { addFilledFormMID } from "api/graphqlMutationStr";

export class SummaryTable extends React.Component {
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
      return this.state.handle === "invalidUrl" ? (<NotFound />) : <TableHook id={this.state.handle} />;
    }
  }


  export let TableHook = (props) => {
  
    const { loading, error, data } = useQuery(gql(formByIdAll(props.id)))
  
    if (loading)
      return (<div><Spin tip="Loading..." size="large" /></div>);
    if (error){
      console.debug(error)
      return (<NotFound />);
    }
    try {
      let temp = data.formOneLooseMatch.form_descriptor
      let data1 = data.formOneLooseMatch.filled_forms
    } catch (error) {
      return (<NotFound />);
    }
    let formDescriptor = data.formOneLooseMatch.form_descriptor
    let filled_forms = data.formOneLooseMatch.filled_forms
    console.debug(formDescriptor)
    if (!formDescriptor.fields)
      return (<Alert
        message="Error"
        description="Form has no item to fill"
        type="error"
        showIcon
      />)
    return (<div>hi
      <div>{formDescriptor.title }</div>
      
    </div>);
  }
