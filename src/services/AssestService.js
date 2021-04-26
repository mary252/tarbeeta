import { assetUrl } from "../common";

export const urlGenrators = (...args) => {
  let str = "";
  for (let i = 0; i < args.length; i++) {
    i === args.length - 1 ? (str += `${args[i]}`) : (str += `${args[i]}/`);
  }
  return assetUrl + str;
};
