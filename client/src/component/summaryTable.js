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
    let filledForms = data.formOneLooseMatch.filled_forms

    const columns = formDescriptor.fields.map((answer, i) => {
      return ({title :  answer.title , dataIndex : answer.name })
    })
    console.log(columns);

    let t = {};
    
    let rowdata = filledForms.map((filledForm , index)=>{
      let f = filledForm.fields;
      if(f.date_fields!==undefined  &&  f.date_fields !== null){
        flag = true;
        f.date_fields.map((date_field , i)=>{
          let key = date_field.name;
          let val = date_field.value;
          t[key] = val;
        })
      }
      if(f.text_fields!==undefined  &&  f.text_fields !== null){
        flag = true;
        f.text_fields.map((text_field , i)=>{
          let key = text_field.name;
          let val = text_field.value;
          t[key] = val;
        })
      }
      if(f.number_fields!==undefined  &&  f.number_fields !== null){
        flag = true;
        f.number_fields.map((number_field , i)=>{
          let key = number_field.name;
          let val = number_field.value;
          t[key] = val;
          console.log(val)
        })
      }
      if(f.location_fields!==undefined  &&  f.location_fields !== null){
        flag = true;
        f.location_fields.map((loc_field , i)=>{
          let key = loc_field.name;
          let val = loc_field.value.coordinates;
          t[key] = val;
          console.log(val)
        })
      }
      console.log(t)
      return t
    
    })

    console.log('data '+rowdata)

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
        dataSource = {rowdata}
      />
      
    </div>);
  }

  
