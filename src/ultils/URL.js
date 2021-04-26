export const urlQueryGenrator = (url, queryObject) => {
  let str = url;

  for (const [index, [key, value]] of Object.entries(
    Object.entries(queryObject)
  )) {
    if (Array.isArray(value)) {
      if (value.length) {
        str +=
          index == 0
            ? `${key}=${encodeURIComponent(value)}`
            : `&${key}=${encodeURIComponent(value)}`;
      }
      continue;
    }
    if (value) {
      str +=
        index == 0
          ? `${key}=${encodeURIComponent(value)}`
          : `&${key}=${encodeURIComponent(value)}`;
    }
  }

  return str;
};
