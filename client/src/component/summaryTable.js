import React from 'react';
import 'antd/dist/antd.css';
import { NotFound } from 'component/notFound';
import { Spin, Alert, message } from 'antd';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { formByIdAll } from "api/graphqlQueryStr";
import { Table} from 'antd';


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
      let temp1 = data.formOneLooseMatch.form_descriptor
      let temp2 = data.formOneLooseMatch.filled_forms
    } catch (error) {
      return (<NotFound />);
    }
    let formDescriptor = data.formOneLooseMatch.form_descriptor
    let filled_forms = data.formOneLooseMatch.filled_forms

    const columns = formDescriptor.fields.map((answer, i) => {
      return ({title :  answer.title })
    })
    console.log(columns);

    console.debug(formDescriptor)
    if (!formDescriptor.fields)
      return (<Alert
        message="Error"
        description="Form has no item to fill"
        type="error"
        showIcon
      />)
    return (<div>
      <div>{formDescriptor.title }</div>
      <Table
        columns = {columns}
      />
      
    </div>);
  }

  