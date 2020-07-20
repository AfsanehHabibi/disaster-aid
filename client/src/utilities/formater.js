// transform client data format to accepted data format by server
// current server data format 
// {
//   fields: {
//       date_fields: [{
//           name: {
//               type: String,
//               required: true
//           },
//           value: {
//               type: Date
//           }
//       }],
//       location_fields: [{
//           name: {
//               type: String,
//               required: true
//           },
//           value: {
//               type: {
//                   type: String, 
//                   enum: ['Point'], 
//                   required: true
//               },
//               coordinates: {
//                   type: [Number],
//                   required: true
//               }
//           },
//           areas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Area' }]
//       }
//       ],
//       text_fields: [{
//           name: {
//               type: String,
//               required: true
//           },
//           value: {
//               type: String
//           }
//       }
//       ],
//       number_fields: [{
//           name: {
//               type: String,
//               required: true
//           },
//           value: {
//               type: Number
//           }
//       }
//       ]
//   }
// }
// current input format
// {
// name:value 
// }
// for location field value is value.value = '[long, lat]'
// number, date, text type are respectivly number, date, and string
// all values that choosed from options are string
export function formOutputToGraphqlInput(formJson, formDesFields) {
  let loc_fields = []
  let date_fields = []
  let text_fields = []
  let number_fields = []
  let loc_fields_index = 0;
  let number_fields_index = 0;
  let date_fields_index = 0;
  let text_fields_index = 0;
  formDesFields.forEach(element => {
    let hasOptions = (element.options && Array.isArray(element.options)
      && element.options.length);
    if (formJson[element.name] !== undefined) {
      let fieldValue;
      if (element.type === "Location") {
        let coordinates;
        if(hasOptions){
          coordinates=JSON.parse(formJson[element.name])
        }else{
          coordinates=JSON.parse(formJson[element.name].value)
        }
        fieldValue = {
          "type": "Point",
          "coordinates": coordinates
        };
        console.debug("loc")
        console.debug(fieldValue)
        loc_fields[loc_fields_index] = { "name": element.name, "value": fieldValue };
        loc_fields_index++;
      } else if (element.type === "Number") {
        let number;
        if(hasOptions){
          number=JSON.parse(formJson[element.name])
        }else{
          number=formJson[element.name]
        }
        number_fields[number_fields_index] = { "name": element.name, "value": number };
        number_fields_index++;
      } else if (element.type === "Date") {
        let date;
        if(hasOptions){
          date=JSON.parse(formJson[element.name])
        }else{
          date=formJson[element.name]
        }
        date_fields[date_fields_index] = { "name": element.name, "value": date };
        date_fields_index++;
      } else if (element.type === "Text") {
        text_fields[text_fields_index] = { "name": element.name, "value": formJson[element.name] };
        text_fields_index++;
      }
    }
  });
  return {
    "date_fields": date_fields,
    "location_fields": loc_fields,
    "text_fields": text_fields,
    "number_fields": number_fields
  };
}