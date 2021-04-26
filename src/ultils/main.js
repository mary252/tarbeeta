export const loadLang = lang => {
  if (lang != "ar" && lang != "en") {
    // first get from local storage else set local storage
    localStorage.getItem("locale")
      ? localStorage.getItem("locale")
      : localStorage.setItem("locale", "ar");
    return localStorage.getItem("locale");
  } else {
    localStorage.setItem("locale", lang ? lang : "ar");
    return lang;
  }
};

export const getShopId = () => JSON.parse(localStorage.getItem("shop_id"));
export const getShopName = () => localStorage.getItem("shop_username");

export const getViewMode = () => localStorage.getItem("view_mode");
export const getCurrLang = componentContext =>
  componentContext.props.match.params.lang;

export function changeLang(location) {
  let locationArray = location.split("/");
  locationArray.splice(1, 1);
  let locationPath = locationArray.join("/");

  if (locationArray.length > 0) {
    return locationPath;
  }
}
