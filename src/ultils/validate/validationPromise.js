import { validate } from 'validate.js';

export const validation = (fieldsArray, component) => {
    component.setState({
      error_msg: null
    })


    return new Promise (async (resolve, reject) => {
      const errorsArray = await fieldsArray.map((field, i) => {
        return {[`${field}Error`]: validate(field, component.state[field])}
      })

      let hasErrors = false

      errorsArray.map((error, j) => {
        let value = Object.values(error)[0];

        // component.setState({
        //   [key]: value
        // });

        if (value !== null) {
          hasErrors = true
        }
      })

      if (hasErrors) {
        reject(errorsArray)
      }

      resolve({
          greeting: "Hello"
      })
    });
  }