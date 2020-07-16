export function formByIdDes(id) {
    return `{
        formOneLooseMatch(filter:{form_descriptor:{id:"${id}"}}){
          form_descriptor{
            title
            id
            fields{
            options{
              label
              value
            }
              required
              type
              name
              title
          }
          }
        }
      }
        `;
}
export function formsIdTitle(params) {
  return`
  {
    formMany{
      form_descriptor{
        id
        title
      }
    }
  }
    `
}