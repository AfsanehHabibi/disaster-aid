export function formOutputToGraphqlInput(formJson,formDesFields) {
    let fields_arr = []
    let index = 0;
    formDesFields.forEach(element => {
      if (formJson[element.name] !== undefined) {
        let fieldValue;
        if (!element.options || !Array.isArray(element.options)
          || !element.options.length) {
          if (element.type === "Location") {
            fieldValue = formJson[element.name].value;
            console.debug("loc")
            console.debug(fieldValue)
          } else if (element.type === "Number" || element.type === "Date") {
            fieldValue = (formJson[element.name]).toString();
          } else {
            fieldValue = formJson[element.name];
          }
        } else {
          fieldValue = formJson[element.name];
        }
        fields_arr[index] = { "name": element.name, "value": fieldValue };
        index++;
      }
    });
    return fields_arr;
}