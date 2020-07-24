import React from 'react';
import 'antd/dist/antd.css';
import { NotFound } from 'component/notFound';
import { Spin, Alert, message } from 'antd';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { formByIdAll } from "api/graphqlQueryStr";
import { Table, PageHeader,Button} from 'antd';
import { ExportToCsv } from 'ts-export-to-csv';


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

    console.debug(formDescriptor)
    if (!formDescriptor.fields)
      return (<Alert
        message="Error"
        description="Form has no item to fill"
        type="error"
        showIcon
      />)

    let columnType = [];
    let hasAnyNumber = false;

    let index = 0;
    const columns = [];
    formDescriptor.fields.map((field, i) => {
      columnType[index] = field.type;
      columns.push({title :  field.title , dataIndex : field.name })
      if(field.type === "Location"){
        columns.push({title : field.title+" area", dataIndex : field.name+"_area"})
        index++;
        columnType[index] = "area";
      }
      if(field.type === "Number"){
        hasAnyNumber = true;
      }
      index++;
    })
    const num_of_columns = index;
    console.log(columns);

    const rowdata = filledForms.map((filledForm , index)=>{
      let f = filledForm.fields;
      let t = {};
      if(f.date_fields!==undefined  &&  f.date_fields !== null){
        f.date_fields.map((date_field , i)=>{
          let key = date_field.name;
          let val = date_field.value;
          t[key] = val;
        })
      }
      if(f.text_fields!==undefined  &&  f.text_fields !== null){
        f.text_fields.map((text_field , i)=>{
          let key = text_field.name;
          let val = text_field.value;
          t[key] = val;
        })
      }
      if(f.number_fields!==undefined  &&  f.number_fields !== null){
        f.number_fields.map((number_field , i)=>{
          let key = number_field.name;
          let val = number_field.value;
          t[key] = val;
        })
      }
      if(f.location_fields!==undefined  &&  f.location_fields !== null){
        f.location_fields.map((loc_field , i)=>{
          let key = loc_field.name;
          let val = loc_field.value.coordinates[0] + " , " +loc_field.value.coordinates[1] ;
        
          let key2 = loc_field.name+"_area";
          let val2 = "";
          loc_field.areasDoc.map((area , i)=>{
            val2 += area.properties.name + " ";
          })
  
          t[key] = val;
          t[key2] = val2;
        })
      }

      return t;
    
    })

    //calculate sum for number fields
    let sum = [];
    for(let col = 0; col < num_of_columns; col++){
      if(columnType[col] === "Number"){
        sum[col] = 0;
        rowdata.map((row, index)=>{
          let val = Object.values( row );
          sum[col] += val[col];
        })
      }else{
        sum[col] = "";
      }
    }
    
    return (<div>
      <PageHeader
      className="site-page-header"
      title= {formDescriptor.title }
      />,
      
      <Table
        columns = {columns}
        dataSource = {rowdata}
        summary ={() =>(
          hasAnyNumber === true ?
          <Table.Summary.Row style={{ background: '#d9d9d9'}}>
            {sum.map((s , i)=>{
              return (<Table.Summary.Cell > {s} </Table.Summary.Cell>)
            })} 
          </Table.Summary.Row> : null
        )}
      />
      <Button type="primary" onClick = {()=>export_csv(rowdata)} >
          export csv
      </Button>
    </div>);
  }

  function export_csv(data_arr){
    const options = { 
      fieldSeparator: ',',
      showLabels: true, 
      showTitle: true,
      title: 'Summary Table',
      useKeysAsHeaders: true,
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(data_arr);
  }
  
