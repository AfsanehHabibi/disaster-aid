export function addFilledFormMID(params) {
    return `
    mutation AddFilledForm($input:FormFilled_formsInput! , $filter:FormInput!){
      formPushToFilled(input:$input,filter:$filter){
        _id
      }
    }
`
}