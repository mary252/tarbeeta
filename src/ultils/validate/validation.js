import validation from "validate.js";

import * as EN from '../../common/LocaleValidation/EN';
import * as AR from '../../common/LocaleValidation/AR';

const getLocale=()=> {
  return localStorage.getItem("locale") == "ar" ? AR:EN
}


export function validate(fieldName, value) {
  var constraints = {
    email: {
      presence:  {
          message: `^${getLocale().login.validateEmailEmpty}`
        },
      format: {
        // pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{13}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // this pattern for email only
        pattern: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{11})+$/, // this pattern for email or phone
        message: `^${getLocale().login.validateEmail}`
      },
    },
    emailRegister: {
      presence:  {
          message: `^${getLocale().login.validateEmailEmpty}`
        },
      format: {
        // pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{13}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // this pattern for email only
        pattern: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{11})+$/, // this pattern for email or phone
        message: `^${getLocale().login.validateRegisterEmail}`
      },
    },
    password: {
        presence:  {
          message: `^${getLocale().login.validatePassEmpty}`
        },
      length: {
        minimum: 8,
        // message: "^Password Must be More Than 8 Characters",
        message: `^${getLocale().login.validatePass}`
      }
    },
    oldPassword: {
        presence:  {
          message: `^${getLocale().login.validatePassEmpty}`
        },
      length: {
        minimum: 8,
        // message: "^Password Must be More Than 8 Characters",
        message: `^${getLocale().login.validatePass}`
      }
    },
    newPassword: {
      presence:  {
        message: `^${getLocale().login.validatePassEmpty}`
      },
    length: {
      minimum: 8,
      // message: "^Password Must be More Than 8 Characters",
      message: `^${getLocale().login.validatePass}`
    }
  },
    confirmPassword: {
        presence:  {
          message: `^${getLocale().login.validatePassEmpty}`
        },
      length: {
        minimum: 8,
        // message: "^Password Must be More Than 8 Characters",
        message: `^${getLocale().login.validatePass}`
      }
      // equality: "password"
    },
    firstname: {
      presence: true,
      length: {
        minimum: 2,
        message: `^${getLocale().register.validateFirstName}`
      }
    },
    lastname: {
      presence: true,
      length: {
        minimum: 2,
        message: `^${getLocale().register.validateFirstName}`
      }
    },
    mobile: {
      presence: true,
      format: {
        pattern: "^[0-9]{11}$",
        message: `^${getLocale().register.validateMobile}`
      }
    },
    code: {
      presence:  {
        message: `^${getLocale().verify.validateVerifyEmpty}`
      },
      length: {
        minimum: 5,
        message: `^${getLocale().verify.validateVerify}`
    }
    },
    name: {
      presence: true,
      length: {
        minimum: 2,
        message: `^${getLocale().shop.validateName}`
      }
    },
    shopname: {
      presence: true,
      length: {
        minimum: 2,
        message: `^${getLocale().shop.validateName}`
      }
    },
    title: {
      presence:  {
        message: `^${getLocale().addProduct.validateTitleEmpty}`
      },
      length: {
          minimum: 2,
          message: `^${getLocale().addProduct.validateTitle}`
      }
    },
    description: {
      presence:  {
        message: `^${getLocale().addProduct.validateDescriptionEmpty}`
      },
      length: {
        minimum: 5,
        maximum:150,
        message: `^${getLocale().addProduct.validateDescription}`
      }
    },
    messageContactUs: {
      presence:  {
        message: `^${getLocale().addProduct.validateDescriptionEmpty}`
      },
      length: {
        minimum: 5,
        maximum:150,
        message: `^${getLocale().addProduct.validateDescription}`
      }
    },
    price: {
      presence: true,
      format: {
        pattern: /^\d{0,8}(\.\d{1,4})?$/,
        message: `^${getLocale().addProduct.validatePrice}`
      }
    },
    address: {
      presence:  {
        message: `^${getLocale().addProduct.validateAddressEmpty}`
      },
      length: {
        minimum: 5,
        maximum:150,
        message: `^${getLocale().addProduct.validateAddress}`
      }
    },
    account_name: {
      presence:  {
        message: `^${getLocale().bankPopUp.validateAccountNameEmpty}`
      },
      length: {
        minimum: 2,
        message: `^${getLocale().bankPopUp.validateAccountName}`
      }
    },
    account_number: {
      presence:  {
        message: `^${getLocale().bankPopUp.validateAccountNumberEmpty}`
      },
      length: {
        minimum: 2,
        message: `^${getLocale().bankPopUp.validateAccountNumber}`
      }
    },
    email_verification_code: {
      presence:  {
        message: `^${getLocale().verificationPopUp.validateCodeEmpty}`
      },
      format: {
        pattern: "^[0-9]{6}$",
        message: `^${getLocale().verificationPopUp.validateCode}`
      }
    },
    review: {
      presence:  {
        message: `^${getLocale().reviewPopUp.validateReview}`
      },
      length: {
        minimum: 5,
        maximum:150,
        message: `^${getLocale().reviewPopUp.validateReviewEmpty}`
      }
    },
    username: {
      presence: true,
      format: {
        // pattern: /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$|^$/,
        pattern: /^[a-zA-Z0-9]*$/,
        message: `^${getLocale().startshop.validateUserName}`
      }
    }
    // confirmPassword: {
    //   presence: true,
    //   equality: "password"
    // },
    // phone: {
    //   presence: true,
    //   format: {
    //     pattern: "^[0-9]{9}$",
    //     message: "^Phone Number Must Be 9 Numbers"
    //   }
    // },
    // gender: {
    //   presence: true,
    //   inclusion: {
    //     within: [0, 1],
    //     message: "^You need to Choose Gender"
    //   }
    // },
    // name: {
    //   presence: true
    // },
    // handler: {
    //   presence: true
    // },
    // categories: {
    //   presence: true,
    //   length: {
    //     minimum: 1,
    //     message: "^Please Select at least One category"
    //   }
    // },
    // intersts: {
    //   presence: true,
    //   length: {
    //     minimum: 1,
    //     message: "^Please Select at least One Interstes"
    //   }
    // }
  };

  var formValues = {};
  formValues[fieldName] = value;

  var formFields = {};
  formFields[fieldName] = constraints[fieldName];

  const result = validation(formValues, formFields);

  if (result) {
    return result[fieldName][0];
  }
  return null;
}
