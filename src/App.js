import React, { Component } from "react";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  withRouter,
  Redirect
} from "react-router-dom";
import Search from "./containers/Search";

import Login from "./containers/auth/Login";
import ForgotPassword from "./containers/auth/ForgotPassword";
import ResetPassword from "./containers/auth/resetPassword";

import Register from "./containers/auth/Register";
import Verify from "./containers/Verify";
import Mobile from "./containers/Mobile";
import Shop from "./containers/Shop";
import StartShop from "./containers/Shop/StartShop";
import EditShop from "./containers/Shop/EditShop";
// import Department from "./containers/Departments/Department";
import Subcategory from "./containers/Subcategory";
import AddProduct from "./containers/Products/AddProduct";
import Categories from "./containers/categories/Categories";
import Discover from "./containers/Discover";
import Wallet from "../src/containers/Wallet/Wallet";
import Orders from "./containers/Orders/Orders";
import CartPage from "./containers/Cart";
import CheckoutPage from "./containers/Checkout/Checkout";
import ThankUPage from "./containers/ThankU";
import * as serviceWorker from "./serviceWorker";
import ProductDetails from "./containers/Products/Details";
import { Provider } from "react-redux";
import store from "./Store";
import AccountSettings from "./containers/auth/AccountSettings";
import PaymentCallback from "./containers/PaymentCallback";
import OrderInfo from "./containers/Orders/OrderInfo";
import Faqs from "./containers/Faqs";
import ChangePassword from "./containers/auth/ChangePassword";
import Activate from "./containers/auth/Activate";
import Favorites from "./containers/favorites";
import QuickRegister from './containers/auth/QuickRegester'
import ContactUs from "./containers/ContactUs";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { withLoader, NotFound } from "./components";
import { loadLang } from "./ultils/main";
import { EN, AR } from "./common";

import "./App.css";

const defaultLang = "ar";

class App extends Component {
  state = {
    loading: false,
    locale: {},
    lang: null
  };

  componentWillMount() {
    let lang = loadLang(window.location.pathname.split("/")[1]);
    if (lang !== "en") {
      this.setState({
        locale: require("./containers/Locale/AR"),
        lang,
        loading: true
      });
      import("./App-ar.css").then(() => this.setState({ loading: false }));
    } else {
      this.setState({
        locale: require("./containers/Locale/EN"),
        lang
      });
    }
  }

  render() {
    const { locale, lang } = this.state,
      lang_id = lang == "en" ? EN : AR;
    return (
      <Provider store={store}>
        {/* <Router basename="/site"> */}

        <Router basename="/">
          {/* <Suspense fallback={<Mainloader />}> */}
          {/* <Header /> */}
          <Route
            path="/:lang?"
            component={withRouter(props => (
              <Header {...{ ...props, locale, lang, lang_id }} />
            ))}
          />

          <Switch>
            <Route
              path="/:lang(en|ar)?"
              exact
              component={withRouter(props => (
                <Discover {...{ ...props, locale, lang, lang_id }} />
              ))}
            />
            <Route
              path="/:lang/search"
              component={withRouter(props => (
                <Search {...{ ...props, locale, lang, lang_id }} />
              ))}
            />
            <Route
              path="/:lang/quick-register"
              component={withRouter(props=>(
                <QuickRegister {...{...props,locale, lang, lang_id}} />
              ))}
            />
            <Route
              path="/:lang/products/new"
              component={withRouter(props => (
                <AddProduct {...{ ...props, locale, lang, lang_id }} />
              ))}
            />

            <Route
              path="/:lang/products/edit/:id"
              component={withRouter(props => (
                <AddProduct {...{ ...props, locale, lang, lang_id }} />
              ))}
            />

            <Route
              path="/:lang/products/:id"
              component={withRouter(props => (
                <ProductDetails {...{ ...props, locale, lang, lang_id }} />
              ))}
            />

            <Route
              path="/payment/callback"
              component={withRouter(props => (
                <PaymentCallback {...{ ...props, locale, lang, lang_id }} />
              ))}
            />

            <Route
              path="/:lang/login"
              component={withRouter(props => (
                <Login {...{ ...props, locale, lang, lang_id }} />
              ))}
            />
            <Route
              path="/:lang/forgot-password"
              component={withRouter(props => (
                <ForgotPassword {...{ ...props, locale, lang, lang_id }} />
              ))}
            />
            <Route
              path="/:lang/activate"
              component={withRouter(props => (
                <Activate {...{ ...props, locale, lang, lang_id }} />
              ))}
            />

            <Route
              path="/:lang/register"
              component={withRouter(props => (
                <Register {...{ ...props, locale, lang, lang_id }} />
              ))}
            />

            <Route
              path="/:lang/password"
              component={withRouter(props => (
                <ChangePassword {...{ ...props, locale, lang, lang_id }} />
              ))}
            />

            <Route
              path="/:lang/verify"
              component={withRouter(props => (
                <Verify {...{ ...props, locale, lang, lang_id }} />
              ))}
            />

            <Route
              path="/:lang/faqs"
              component={withRouter(props => (
                <Faqs {...{ ...props, locale, lang, lang_id }} />
              ))}
            />

            <Route
              path="/:lang/recover"
              component={withRouter(props => (
                <ResetPassword {...{ ...props, locale, lang, lang_id }} />
              ))}
            />

            <Route
              path="/:lang/contactus"
              component={withRouter(props => (
                <ContactUs {...{ ...props, locale, lang, lang_id }} />
              ))}
            />
            <Route
              path="/:lang/mobile"
              component={withRouter(props => (
                <Mobile {...{ ...props, locale, lang, lang_id }} />
              ))}
            />

            <Route
              path="/:lang/settings"
              component={withRouter(props => (
                <AccountSettings {...{ ...props, locale, lang, lang_id }} />
              ))}
            />
            <Route
              path="/:lang/wallet"
              component={withRouter(props => (
                <Wallet {...{ ...props, locale, lang, lang_id }} />
              ))}
            />
            <Route
              path="/:lang/orders"
              component={withRouter(props => (
                <Orders {...{ ...props, locale, lang, lang_id }} />
              ))}
            />
            <Route
              path="/:lang/order/info/:id"
              component={withRouter(props => (
                <OrderInfo {...{ ...props, locale, lang, lang_id }} />
              ))}
            />
            <Route
              path="/:lang/shop/edit"
              component={withRouter(props => (
                <EditShop {...{ ...props, locale, lang, lang_id }} />
              ))}
            />
            <Route
              path="/:lang/shop/:id"
              component={withRouter(props => (
                <Shop {...{ ...props, locale, lang, lang_id }} />
              ))}
            />
            <Route
              path="/:lang/start"
              component={withRouter(props => (
                <StartShop {...{ ...props, locale, lang, lang_id }} />
              ))}
            />

            {/* <Route
              path="/:lang/department"
              component={withRouter(props => (
                <Department {...{ ...props, locale, lang, lang_id }} />
              ))}
            /> */}

            <Route
              path="/:lang/favorites"
              component={withRouter(props => (
                <Favorites {...{ ...props, locale, lang, lang_id }} />
              ))}
            />

            <Route
              path="/:lang/categories/:department_url"
              component={withRouter(props => (
                <Categories {...{ ...props, locale, lang, lang_id }} />
              ))}
            />
            <Route
              path="/:lang/subcategory/:department_url?/:category_url?/:subcategory_url?"
              component={withRouter(props => (
                <Subcategory {...{ ...props, locale, lang, lang_id }} />
              ))}
            />

            <Route
              path="/:lang/cart"
              component={withRouter(props => (
                <CartPage {...{ ...props, locale, lang, lang_id }} />
              ))}
            />
            <Route
              path="/:lang/checkout"
              component={withRouter(props => (
                <CheckoutPage {...{ ...props, locale, lang, lang_id }} />
              ))}
            />

            <Route
              path="/:lang/thankyou/:id"
              component={withRouter(props => (
                <ThankUPage {...{ ...props, locale, lang, lang_id }} />
              ))}
            />
            
            <Redirect from={"/shop/:id"} to={`/${defaultLang}/shop/:id`} />
            <Redirect
              from={"/products/:id"}
              to={`/${defaultLang}/products/:id`}
            />

            <Redirect from={"/start"} to={`/${defaultLang}/start`} />
            <Redirect
              from={"/forgot-password"}
              to={`/${defaultLang}/forgot-password`}
            />
            <Redirect from={"/section"} to={`/${defaultLang}/section`} />
            <Redirect from={"/login"} to={`/${defaultLang}/login`} />
            {/* <Redirect from={"/department"} to={`/${defaultLang}/department`} /> */}

            <Redirect from={"/register"} to={`/${defaultLang}/register`} />
            <Redirect from={"/verify"} to={`/${defaultLang}/verify`} />
            <Redirect from={"/mobile"} to={`/${defaultLang}/mobile`} />
            <Redirect from={"/cart"} to={`/${defaultLang}/cart`} />
            <Redirect from={"/checkout"} to={`/${defaultLang}/checkout`} />
            <Redirect from={"/faqs"} to={`/${defaultLang}/faqs`} />
            <Redirect from={"/recover"} to={`/${defaultLang}/recover`} />
            <Redirect from={"/contactus"} to={`/${defaultLang}/contactus`} />

            <Redirect from={"/password"} to={`/${defaultLang}/password`} />

            <Redirect
              from={"/forgot-password"}
              to={`/${defaultLang}/forgot-password`}
            />

            <Redirect from={"/activate"} to={`/${defaultLang}/activate`} />
            <Redirect from={"/checkout"} to={`/${defaultLang}/checkout`} />

            <Redirect from={"/wallet"} to={`/${defaultLang}/wallet`} />

            <Redirect from={"/orders"} to={`/${defaultLang}/orders`} />

            <Redirect from={"/shop/edit"} to={`/${defaultLang}/shop/edit`} />

            <Redirect from={"/favorites"} to={`/${defaultLang}/favorites`} />
            <Redirect from={"/search"} to={`/${defaultLang}/search`} />

            <Redirect
              from={"/products/new"}
              to={`/${defaultLang}/products/new`}
            />
            <Redirect from={"/check-mail"} to={`/${defaultLang}/check-mail`} />
            <Redirect
              from={"/thankyou/:id"}
              to={`/${defaultLang}/thankyou/:id`}
            />

            <Redirect
              from={"/categories/:department_url"}
              to={`/${defaultLang}/categories/:department_url`}
            />

            <Redirect
              from={
                "/subcategory/:department_url?/:category_url?/:subcategory_url?"
              }
              to={`/${defaultLang}/subcategory/:department_url?/:category_url?/:subcategory_url?`}
            />
            <Redirect
            from={"/"}
            to={`/${
              localStorage.getItem("locale")
                ? localStorage.getItem("locale")
                : defaultLang
            }`}
          />

            <Route
              component={withRouter(props => (
                <NotFound {...{ ...props, locale, lang, lang_id }} />
              ))}
            />
          </Switch>
          {/* </Suspense> */}

          <Route
            path="/:lang(en|ar)?"
            component={withRouter(props => (
              <Footer {...{ ...props, locale, lang, lang_id }} />
            ))}
          />
        </Router>
      </Provider>
    );
  }
}

export default withLoader(App);
