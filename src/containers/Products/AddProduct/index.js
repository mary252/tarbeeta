import React, { Component } from "react";
import {
  Page,
  AddressPopUp,
  withLoader,
  PlateColors,
  DropDown,
  TextBox,
  ColorButton,
  UploadPicButton,
  TButton,
  TextInput,
  Notification
} from "../../../components";
import { connect } from "react-redux";
import * as actions from "../../../actions";

import "./css/EN.css";
import {
  addProduct,
  fetchColors,
  VariationFactory,
  fetchSizes,
  fetchMaterials,
  uploadPic,
  editProduct,
  fetchtDepartment,
  fetchtProductDetails
} from "../../../services";
import MessengerCustomerChat from "react-messenger-customer-chat";

import { validate } from "../../../ultils/validate/validation";
import {
  FACEBOOK_CHAT_POPUP_THEME_COLOR,
  FACEBOOK_APP_ID,
  FACEBOOK_PAGE_ID
} from "../../../common";

import CustomCheckbox from "../../../components/Form/CheckBox/CustomCheckbox";
const factory = new VariationFactory();

const mapStateToProps = state => {
  const {
    user: { address, shop_id, shop_username },
    departments: { all }
  } = state;
  return {
    departments: all,
    address,
    shop_id,
    shop_username
  };
};
class AddProduct extends Component {
  // constructor() {
  // super();

  AddressPopup = null;
  btn = null;
  // }

  state = {
    categories: [],
    subCategories: [],
    colours: [],
    color_popup_top: `150%`,
    container_overflow_y: `scroll`,
    edit_stock_popup_top: `150%`,
    add_address_popup: `150%`,
    description: null,
    title: null,
    material_id: null,
    department_id: null,
    subcategory_id: null,
    materials: [],
    variations: [],
    price: 0,
    sizes: [],
    selectedDepartment: null,
    selectedCategory: null,
    currPic: 0,
    saveAndAddNewOne: true,
    isEdit: false,
    departments: [],
    currentStock: null,
    images: {},
    pickup_address_id: null,
    is_busy: false,
    isError: false,
    current_address: {},
    id: null,
    titleError: "",
    descriptionError: "",
    priceError: "",
    colorError: "",
    imagesError: "",
    sizeError: "",
    stockFlag: true,
    verify_robot: false,
    stockError: null,
    checked: false,
    isShop_verified: true,
    has_colour: true,
    has_material: true
  };

  verify_robot = value => {
    this.setState({
      verify_robot: true
    });
  };

  async componentDidMount() {
    this.setState({ loading: true });

    let { id } = this.props.match.params,
      product = null,
      subcategory_id = null,
      selectedCategory = null,
      material_id = null,
      department_id = null,
      lang_id = this.props.lang_id;

    if (id) {
      let resProduct = await fetchtProductDetails(id, lang_id),
        product = resProduct.data;

      const {
        description,
        title,
        material_id,
        subcategory_id,
        price,
        selectedDepartment,
        selectedCategory,
        shop_id,
        variations
      } = product;

      this.setState({
        description,
        title,
        shop_id,
        material_id,
        subcategory_id,
        price,
        selectedDepartment,
        selectedCategory,
        variations,
        isEdit: true,
        id
      });
    }

    if (product) {
      subcategory_id = product.subcategory_id;
      selectedCategory = product.department_category_id;
      material_id = product.material_id;
      department_id = product.department_id;
    }

    await this.getdepartments(
      department_id,
      selectedCategory,
      subcategory_id,
      lang_id
    );

    await this.init(material_id);
    this.setState({
      loading: false
    });
  }

  toggle_busy = () => this.setState({ is_busy: !this.state.is_busy });

  init = async material_id => {
    try {
      let colorRes = await fetchColors(),
        materials = await this.getMaterials();

      this.setState({
        colours: colorRes.data,
        materials,
        material_id: material_id || materials.length ? materials[0].value : null
      });
    } catch (e) {}
  };

  getdepartments = async (id, selectedCategory, subcategory_id, lang_id) => {
    try {
      let departmentsRes = await fetchtDepartment(lang_id, 1);
      let departments = departmentsRes.data.map(el => {
        return {
          title: el.department_name,
          value: el.department_id,
          selected: el.department_id == id,
          has_colour: el.has_colour || false,
          has_material: el.has_material || false,
          categories: el.categories
        };
      });

      if (departments.length) {
        this.setState({
          departments,
          selectedDepartment: id || departments[0].value
        });
        await this.getDepartmentCategory(
          id || departments[0].value,
          selectedCategory,
          subcategory_id
        );
      }
    } catch (e) {}
  };

  initEditProduct = () => {
    let variations = [...this.state.variations];
    variations.forEach(colour => {
      while (colour.images.length < 3) {
        colour.images.push({ file: "", is_main: 0 });
      }
      if (colour.sizes.length < this.state.sizes.length) {
        colour.sizes = this.state.sizes.map(item1 => ({
          ...{ ...item1, stock: 0 },
          ...colour.sizes.find(t => t.size_id == item1.size_id)
        }));
      }
    });
    this.setState({ variations });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let addressAdded = JSON.parse(localStorage.getItem("address_added"));

    if (nextProps.address !== prevState.address) {
      return {
        current_address: nextProps.address.length
          ? // ? nextProps.address[nextProps.address.length - 1]
            addressAdded
            ? addressAdded
            : nextProps.address[0]
          : // ? nextProps.address[0]
            {},
        address: nextProps.address,
        shop_id: nextProps.shop_id
      };
    } else return null;
  }

  getSizes = async id => {
    try {
      let lang_id = this.props.lang_id;
      let sizesRes = await fetchSizes(id, lang_id);

      this.setState({ sizes: sizesRes.data }, this.initEditProduct);
    } catch (e) {}
  };
  getMaterials = async id => {
    try {
      let res = await fetchMaterials(this.props.lang_id);

      return res.data.map(mat => {
        return { title: mat.name, value: mat.id, selected: mat.id == id };
      });
    } catch (e) {}
  };

  saveToState = e => this.setState({ [e.target.name]: e.target.value });

  validation = fieldsArray => {
    this.setState({
      error_msg: null
    });

    return new Promise(async (resolve, reject) => {
      const errorsArray = await fieldsArray.map((field, i) => {
        return { [`${field}Error`]: validate(field, this.state[field]) };
      });

      let hasErrors = false;

      errorsArray.map((error, j) => {
        let key = Object.keys(error)[0],
          value = Object.values(error)[0];

        this.setState({
          [key]: value
        });

        if (value !== null) {
          hasErrors = true;
        }
      });

      if (hasErrors) {
        reject(false);
      }

      resolve(true);
    });
  };

  saveProduct = async () => {
    this.validation(["title", "description", "price"])
      .then(async () => {
        /*for (let i = 0; i < this.state.variations.length; i++) {
          /*for (let x = 0; x < this.state.variations[i].images.length; x++) {
            if (this.state.variations[i].images[x].file != "") {
              this.setState({
                imagesError: ""
              });
              break;
            } else {
              this.setState({
                imagesError: this.props.locale.images_validation_msg
              });
              // break;
            }
          }
        }*/

        if (this.state.variations.length == 0) {
          this.setState({
            colorError: this.props.locale.color_validation_msg
          });
        } /*else if (Object.entries(this.state.images).length == 0) {
          this.setState({
            imagesError: this.props.locale.images_validation_msg
          });
        }*/ else {
          if (this.state.imagesError == "") {
            let shop_id = this.props.shop_id;
            try {
              const {
                description,
                title,
                material_id,
                subcategory_id,
                saveAndAddNewOne,
                isEdit,
                images,
                current_address,
                id
              } = this.state;

              let product = {
                shop_id,
                title,
                description,
                material_id,
                subcategory_id,
                variations: this.filterSelectedColors(),
                pickup_address_id: current_address ? current_address.id : 0
              };
              this.toggle_busy();
              let lang_id = this.props.lang_id;
              let res = isEdit
                ? await editProduct(product, images, id, lang_id)
                : await addProduct(product, images, lang_id, "v2");
              this.toggle_busy();

              if (saveAndAddNewOne) {
                this.resetState();
                this.props.init_notification({
                  type: "success",
                  title: "Success",
                  message: this.props.locale.product_add_success_message
                });
                return;
              }
              this.props.history.push(
                `/${this.props.lang}/shop/${this.props.shop_username}`
              );
            } catch (e) {
              this.toggle_busy();
            }
          } else {
            this.props.init_notification({
              type: "error",
              title: this.props.locale.error,
              message: this.props.locale.validation_general_msg
            });
          }
        }
      })
      .catch(formErrors => {
        this.props.init_notification({
          type: "error",
          title: this.props.locale.error,
          message: this.props.locale.validation_general_msg
        });
      });
  };

  filterSelectedColors = () => {
    return this.state.variations.map(x => ({
      colour_id: x.colour_id,
      currency_id: 1,
      image_url: x.image_url,
      price: this.state.price,
      images: x.images.filter(x =>
        !x.file ? false : x.file.includes("blob") ? false : true
      ),
      // .map(x => ({ file: x.file, is_main: 0 }))
      sizes: x.sizes.map(x => ({
        size_id: x.size_id,
        stock: x.stock
      }))
    }));
  };

  drawSizes = () =>
    this.state.sizes.map((item, i) => (
      <div className="size-label-desktop">{item.abbreviation}</div>
    ));
  renderSummaryColors = () =>
    this.state.variations.map((col, i) => (
      <div
        key={i}
        className="color-box"
        style={{ backgroundColor: col.hex_code }}
      />
    ));

  genQuanInpPerSizes = (sizes, colour_id) => {
    return sizes.map((item, i) =>
      this.state.isShop_verified ? (
        <TextInput
          key={i}
          divClassName="quality-per-size-desktop-input"
          value={item.stock}
          tabIndex={0}
          onChange={e =>
            this.sizeChange(colour_id, i, parseInt(e.target.value))
          }
          type="number"
        />
      ) : (
        <div className="quality-per-size-desktop-input-text-box" key={i}>
          <CustomCheckbox
            checked={item.stock}
            onChange={e => this.sizeChange(colour_id, i, item.stock ? 0 : 1)}
          />
        </div>
      )
    );
  };

  getQuantity = () => {
    return []
      .concat(
        ...this.state.variations.map(color => color.sizes.map(x => x.stock))
      )
      .filter(Boolean)
      .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
  };

  drawMobileQtySize = sizes =>
    sizes.map((size, i) => (
      <div className="column is-3-mobile size-qty-wrapper " key={i}>
        <p className="size-mobile-label">{size.abbreviation}</p>
        <p className="quantity-mobile-label">{size.stock}</p>
      </div>
    ));

  hide_color_popup = () => {
    this.setState({ color_popup_top: "150%" });
  };

  show_color_popup = () => {
    this.setState({ color_popup_top: "0%" });
  };

  hide_add_address_popup = () => {
    this.setState({ add_address_popup: "150%" });
  };

  show_add_address_popup = () => {
    this.setState({ add_address_popup: `0%` });
  };

  hide_stock_popup = () => {
    this.setState({ edit_stock_popup_top: "150%" });
  };

  show_stock_popup = currentStock => {
    this.setState({ edit_stock_popup_top: "0%", currentStock });
  };

  selectColor = (isSelected, colour) => {
    this.setState(state => {
      return {
        variations: isSelected
          ? state.variations.filter(a => a.colour_id !== colour.id)
          : [
              ...this.state.variations,
              factory.createVariation(true, colour, this.state.sizes)
            ]
      };
    });
  };

  sizeChange = (colour_id, itemIndex, val) => {
    let variations = [...this.state.variations];

    let colourIndex = variations.findIndex(el => el.colour_id == colour_id);

    variations[colourIndex].sizes[itemIndex].stock = val;
    this.setState({ variations });
  };

  colourImgChange = (colourIndex, itemIndex, val, file, colour_id) => {
    let variations = [...this.state.variations];

    variations[colourIndex].images[itemIndex > 5 ? 5 : itemIndex].file = val;

    let images = {
      ...this.state.images,
      ...{
        [`${colour_id}_${itemIndex === 0 ? "1" : "0"}_${itemIndex + 1}`]: file
      }
    };

    this.setState({ variations, images });
  };

  drawGallery = (images, colourIndex, colour_id) =>
    images.map((image, i) => (
      <div className="column is-4-desktop is-4-touch" key={i}>
        <UploadPicButton
          picture={image.file}
          active={true}
          onUpload={(value, file) =>
            this.colourImgChange(colourIndex, i, value, file, colour_id)
          }
          rmImage={() => {
            this.colourImgChange(colourIndex, i, "", "");
            this.setState(() => {
              return {
                currPic: this.state.currPic ? this.state.currPic - 1 : 0
              };
            });
          }}
        />
      </div>
    ));
  getIOImg = colourIndex =>
    this.state.variations[colourIndex].images.filter(x => !!x.file).length;

  drawRawPerColor = () =>
    this.state.variations.map((colour, i) => (
      // <div className="white-div" key={i}>
      <div className="columns is-multiline">
        <div className="column is-1 is-flex aic jcc">
          <div className=" colur_btn ">
            <ColorButton colour={colour.color_image} />
          </div>
        </div>

        <div className="column is-3-desktop is-6-tablet">
          <div className="pictures-warper">
            <div className="columns is-mobile is-multiline">
              {this.drawGallery(colour.images, i, colour.colour_id)}
              {colour.images.some(x => x.file) != "" ? null : (
                <span className="input-error-message">
                  {this.state.imagesError}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="column is-4-tablet is-hidden-desktop is-hidden-mobile" />

        <div className="column is-2-desktop is-4-tablet is-flex aic">
          <TButton
            ariaLabel="Upload Picture"
            text={this.props.locale.product_containers.choose_picture_button}
            className="blue outline"
            onPress={e => this.refs[`upload_${i}_button`].click()}
          />
          <input
            type="file"
            accept="image/*"
            key={i}
            className="is-hidden"
            ref={`upload_${i}_button`}
            onChange={e =>
              uploadPic(e, (data, file) =>
                this.colourImgChange(
                  i,
                  this.getIOImg(i),
                  data,
                  file,
                  colour.colour_id
                )
              )
            }
          />
        </div>

        <div className="column is-2-desktop is-8-tablet is-flex aic">
          <p className="image-text">
            {this.props.locale.product_containers.image_upload_helper_paragraph}
          </p>
        </div>

        {/* <div className="column  is-1" /> */}
        <div className="column  is-flex aic">
          <TextInput
            divClassName="wid-80"
            type="Text"
            placeholder={
              this.props.locale.product_containers.image_link_placeholder
            }
            errorMessage={this.state.titleError}
            onChange={e => this.updateVariationLink(e, i)}
          />
        </div>

        <div className="column  is-flex aic">
          <TextInput
            divClassName="wid-80"
            type="Text"
            placeholder={
              this.props.locale.product_containers.id_input_placeholder
            }
            name="title"
            errorMessage={this.state.titleError}
            onChange={e => this.updateVariationTracking(e, i)}
          />
        </div>
      </div>
    ));

  updateVariationLink = (e, variation_index) => {
    let variations = [...this.state.variations];

    variations[variation_index].image_url = e.target.value;
    this.setState({ variations });
  };

  updateVariationTracking = (e, variation_index) => {
    let variations = [...this.state.variations];

    variations[variation_index].seller_tracking_id = e.target.value;
    this.setState({ variations });
  };
  drawEditAmount = () => {
    const { currentStock } = this.state;

    return currentStock
      ? currentStock.sizes.map((size, i) => (
          <div
            className={`edit-stock-mobile-row ${
              this.props.lang == "ar" ? "rtl" : ""
            }`}
            key={i}
          >
            <label className="size-label-mobile is-flex aic">
              {size.title}
            </label>
            <TextInput
              className="quantity-size-input-mobile"
              value={size.stock}
              onChange={e =>
                this.sizeChange(
                  currentStock.colour_id,
                  i,
                  parseInt(e.target.value)
                )
              }
              type="number"
            />
          </div>
        ))
      : null;
  };

  draw_color_buttons = () => (
    <PlateColors
      {...this.state}
      selectColor={this.selectColor}
      selectedColorMethod={this.selectedColorMethod}
    />
  );

  draw_large_color_buttons = () => (
    <PlateColors
      {...this.state}
      selectedColorMethod={this.selectedColorMethod}
      selectColor={this.selectColor}
      className="column is-3"
    />
  );

  getDepartmentCategory = async (
    selectedDepartment,
    category_id,
    subcategory_id
  ) => {
    if (selectedDepartment) {
      this.setState({ selectedDepartment }, () => {
        if (!this.getSelecteDepartment().has_colour && !this.state.isEdit) {
          this.setState({ variations: [factory.createVariation(false)] });
        }
      });
    }
    let department = this.state.departments.find(
      x => x.value == selectedDepartment
    );

    let categories = department.categories.map(cat => {
      return {
        title: cat.name,
        value: cat.department_category_id,
        selected: cat.category_id == category_id,
        subCategories: cat.subcategories
      };
    });
    if (categories.length) {
      this.setState({
        categories,
        selectedCategory: category_id || categories[0].value,
        selectedDepartment
      });
      await this.getSubCategory(
        category_id || categories[0].value,
        subcategory_id,
        categories
      );
    }
  };

  getSubCategory = async (selectedCategory, subcategory_id, categories) => {
    try {
      this.setState({ selectedCategory });
      let current_cat = categories ? categories : this.state.categories;
      let category = current_cat.find(x => x.value == selectedCategory);
      let subCategories = category.subCategories.map(cat => {
        return {
          title: cat.subcategory_name,
          value: cat.subcategory_id,
          selected: cat.subcategory_id == subcategory_id
        };
      });

      if (subCategories.length) {
        this.setState({
          subCategories,
          subcategory_id: subcategory_id || subCategories[0].value
        });

        await this.getSizes(subcategory_id || subCategories[0].value);
      }
    } catch (e) {}
  };

  getSelecteDepartment = () => {
    let x = this.state.departments.findIndex(
      x => x.value == this.state.selectedDepartment
    );

    return this.state.departments[x] ? this.state.departments[x] : {};
  };

  getCategoryName = () => {
    let x = this.state.categories.findIndex(
      x => x.value == this.state.selectedCategory
    );

    return this.state.categories[x] ? this.state.categories[x].title : "";
  };

  getSubCategoryName = () => {
    let x = this.state.subCategories.findIndex(
      x => x.value == this.state.subcategory_id
    );

    return this.state.subCategories[x] ? this.state.subCategories[x].title : "";
  };

  navigate = right =>
    this.setState(state => {
      return {
        currPic: right ? state.currPic + 1 : state.currPic - 1
      };
    });

  getGallary = () =>
    []
      .concat(
        ...this.state.variations.map(color => color.images.map(x => x.file))
      )
      .filter(Boolean);

  getSelectedSizes = () => {
    let allSizes = []
      .concat(
        ...this.state.variations.map(color =>
          color.sizes.map(x => {
            return { stock: x.stock, title: x.title };
          })
        )
      )
      .filter(x => !!x.stock)
      .map(x => x.title);

    return [...new Set(allSizes)].join(" , ");
  };

  getMaterialName = () => {
    let x = this.state.materials.findIndex(
      x => x.value == this.state.material_id
    );

    return this.state.materials[x] ? this.state.materials[x].title : "";
  };

  resetState = () => {
    this.setState(() => {
      return {
        description: "",
        title: "",
        price: 0,
        currPic: 0,
        saveAndAddNewOne: true,
        variations: this.getSelecteDepartment().has_colour
          ? []
          : [factory.createVariation(false)],
        images: {}
      };
    });
    window.scrollTo(0, 0);
  };

  openPopUp = () => this.AddressPopup.toggle();

  getQtySize = () =>
    this.state.currentStock
      ? this.state.currentStock.sizes
          .map(x => x.stock)
          .filter(Boolean)
          .reduce((x, y) => x + y, 0)
      : 0;

  pickAddress = id => {
    let index = this.props.address.findIndex(x => x.id == id),
      current_address = this.props.address[index];

    this.setState({ pickup_address_id: id, current_address });
  };

  autoSelectAddress = id => {};

  updateAddress = data => {
    this.props.addNewAddress(data);
  };

  selectedColorMethod = () => {
    return this.state.variations.length == 0
      ? this.setState({
          colorError: "Select one color at least"
        })
      : null;
  };
  handleCheckboxChange = event => {
    this.setState(state => ({ checked: !state.checked }));
  };

  componentWillMount() {
    // if(this.props.address.length > 0){
    //   this.setState({
    //     current_address: this.props.address[0]
    //   });
    // }
    // if(this.props.shop_id == null || this.props.shop_id == ""){
    //   this.props.history.push(`/${localStorage.getItem("locale")}`);
    // }

    if (this.state.shop_id == null) {
      this.props.history.push(`/${localStorage.getItem("locale")}`);
    }
  }

  // componentWillMount(){
  //   if (this.props.shop_id == null) {
  //     this.props.history.push("/");
  //   }
  // }

  render() {
    const {
      state: {
        categories,
        subCategories,
        price,
        currPic,
        saveAndAddNewOne,
        title,
        description,
        departments,
        isEdit,
        is_busy,
        message,
        isError,
        variations,
        selectedDepartment,
        current_address: {
          area_name = "--",
          city_name = "--",
          address_line_1 = "--",
          id
        }
      },
      props: { address, locale }
    } = this;
    let is_department_has_material = this.getSelecteDepartment().has_material;
    let is_department_has_colour = this.getSelecteDepartment().has_colour;

    return (
      <Page
        title={
          isEdit
            ? `${locale.product_containers.edit_page_title}  ${title}`
            : locale.product_containers.add_page_title
        }
        description={locale.product_containers.add_page_desc}
        {...this.props}
      >
        <Notification
          message={message}
          isError={isError}
          onClose={() => {
            this.setState({ message: null });
          }}
        />

        <div className="section">
          <div className="container">
            <div>
              {/* <MessengerCustomerChat
                pageId={FACEBOOK_PAGE_ID}
                greeting_dialog_display="hide"
                appId={FACEBOOK_APP_ID}
                themeColor={FACEBOOK_CHAT_POPUP_THEME_COLOR}
                language={this.props.lang == "en" ? "en_US" : "ar_AR"}
                greetingDialogDelay={0}
                minimized={true}
                shouldShowDialog={false}
                loggedInGreeting={
                  this.props.locale.facebook_chat_greeting_message
                }
                loggedOutGreeting={
                  this.props.locale.facebook_chat_greeting_message
                }
              /> */}
            </div>
            <p className="Add-new-product">{locale.add_page_title}</p>

            <div className="white-div">
              <div className="columns aic is-mobile">
                <div className="column is-9-desktop is-mobile">
                  <div className="columns is-mobile aic is-multiline">
                    <div className="column is-one-quarter-desktop is-full-mobile is-one-fifth-tablet">
                      <label className="form-label">
                        {locale.product_containers.product_details_label}
                      </label>
                    </div>
                    {/* Departments */}

                    <div className="column is-one-quarter-desktop">
                      <DropDown
                        ariaLabel="Select departments"
                        options={departments}
                        onSelect={e =>
                          this.getDepartmentCategory(e.target.value)
                        }
                      />
                    </div>
                    {/* Categories */}

                    <div className="column is-one-quarter-desktop">
                      <DropDown
                        ariaLabel="Select categories"
                        options={categories}
                        onSelect={e => this.getSubCategory(e.target.value)}
                      />
                    </div>
                    {/* sub Categories */}

                    <div className="column is-one-quarter-desktop">
                      <DropDown
                        ariaLabel="Select subCategories"
                        options={subCategories}
                        onSelect={e => {
                          this.setState({ subcategory_id: e.target.value });
                          this.getSizes(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="white-div">
              <div className="columns is-mobile">
                <div className="column is-9-desktop is-mobile">
                  <div className="columns is-mobile aic is-multiline">
                    <div className="column is-one-quarter-desktop is-full-mobile is-one-fifth-tablet">
                      <label className="form-label">
                        {locale.product_containers.product_info_label}
                      </label>
                    </div>

                    <div className="column is-half-desktop">
                      <TextInput
                        type="Text"
                        placeholder={
                          locale.product_containers.title_input_placeholder
                        }
                        name="title"
                        errorMessage={this.state.titleError}
                        onBlur={() =>
                          this.validation(["title"])
                            .then()
                            .catch(e => {})
                        }
                        onChange={this.saveToState}
                        value={title}
                      />
                    </div>

                    {is_department_has_material && (
                      <div className="column is-one-quarter-desktop">
                        <DropDown
                          ariaLabel="Select materials"
                          options={this.state.materials}
                          onSelect={e =>
                            this.setState({ material_id: e.target.value })
                          }
                        />
                      </div>
                    )}
                  </div>

                  <div className="columns is-mobile aic">
                    <div className="column is-one-quarter-desktop is-hidden-mobile is-one-fifth-tablet">
                      <label className="form-label" />
                    </div>

                    <div className="column is-9-desktop">
                      <TextBox
                        rows={5}
                        placeholder={locale.description_label}
                        name="description"
                        onChange={this.saveToState}
                        onBlur={() =>
                          this.validation(["description"])
                            .then()
                            .catch(e => {})
                        }
                        value={description}
                        errorMessage={this.state.descriptionError}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="div-title">{locale.product_containers.stock_head}</p>
            <div className="is-hidden-mobile">
              {is_department_has_colour && (
                <div className="white-div">
                  <p className="colors-text">
                    {locale.product_containers.choose_available_colors_p}
                  </p>
                  <div className="color-desktop-warper">
                    <div className="columns is-multiline ">
                      {this.draw_color_buttons()}
                      {this.state.variations.length == 0 && (
                        <span className="input-error-message">
                          {this.state.colorError}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="white-div is-hidden-tablet is-hidden-desktop">
                <p className="form-label">
                  {locale.product_containers.choose_available_colors_p}
                </p>
                <div className="mobile-color-choose-button">
                  <TButton
                    ariaLabel="Open Colour Popup"
                    text={
                      locale.product_containers.choose_button_mobile_placeholder
                    }
                    onPress={e => this.show_color_popup(e)}
                    className="blue outline"
                  />
                </div>
              </div>
              <div
                className="popup is-hidden-desktop"
                style={{ top: this.state.color_popup_top }}
              >
                <div className="popup-top-bar">
                  <button
                    aria-label="Open Colours Picker PopUp"
                    onClick={e => this.hide_color_popup(e)}
                    className="popup-button"
                  >
                    <span className="fas fa-times" />
                  </button>
                  <p className="popup-text is-uppercase">
                    {locale.product_containers.choose_color_mobile_head_text}
                  </p>
                  <button
                    aria-label="PopUp Button"
                    className="popup-button"
                    onClick={e => this.hide_color_popup(e)}
                  >
                    <span className="fas fa-check" />
                  </button>
                </div>
                <div className="color-popup-color-warper">
                  <div className="columns is-mobile is-multiline">
                    {this.draw_large_color_buttons()}
                  </div>
                </div>
              </div>
              <div
                className="popup is-hidden-desktop"
                style={{ top: this.state.edit_stock_popup_top }}
              >
                <div className="popup-top-bar">
                  <button
                    aria-label="Close Colours Picker PopUp"
                    onClick={e => this.hide_stock_popup(e)}
                    className="popup-button"
                  >
                    <span className="fas fa-times" />
                  </button>
                  <p className="popup-text is-uppercase">
                    {locale.product_containers.edit_stock_button_placeholder}
                  </p>
                  <button
                    aria-label="PopUp Button"
                    className="popup-button"
                    onClick={e => this.hide_stock_popup(e)}
                  >
                    <span className="fas fa-check" />
                  </button>
                </div>
                <div className="stock-mobile-col-wrapper">
                  <div
                    className={`stock-info-mobile ${
                      this.props.lang == "ar" ? "rtl" : ""
                    }`}
                  >
                    <div className="stock-info-color" />
                    <div>
                      <p className="stock-info-mobile-label">
                        {locale.product_containers.stock_info_mobile_label}
                      </p>
                      <p className="stock-mobile-Total-Quantity">
                        {locale.product_containers.stock_mobile_total_qty}{" "}
                        <strong>{this.getQtySize()}</strong>
                      </p>
                    </div>
                  </div>
                  <div
                    className={`edit-stock-mobile-row ${
                      this.props.lang == "ar" ? "rtl" : ""
                    }`}
                  >
                    <p className="edit-stock-mobile-column-label is-uppercase">
                      {locale.size}
                    </p>
                    <p className="edit-stock-mobile-column-label is-uppercase">
                      {locale.product_containers.edit_stock_mobile_amount_label}
                    </p>
                  </div>
                  {this.drawEditAmount()}
                </div>
                <div
                  className={`edit-stock-mobile-row ${
                    this.props.lang == "ar" ? "rtl" : ""
                  }`}
                >
                  <p className="edit-stock-mobile-column-label is-uppercase">
                    {locale.size}
                  </p>
                  <p className="edit-stock-mobile-column-label is-uppercase">
                    {locale.product_containers.edit_stock_mobile_amount_label}
                  </p>
                </div>
                {this.drawEditAmount()}
              </div>
              {/* variation section */}
              <div className="is-hidden-desktop is-hidden-tablet" />
              {Boolean(this.state.variations.length) && (
                <div className="white-div">
                  <p className="colors-text">{locale.upload_images_label}</p>
                  {this.drawRawPerColor()}
                </div>
              )}
              <div className="white-div">
                <p className="form-label">
                  {locale.product_containers.pricing_head}
                </p>
                <div className="white-box mar-bot-15">
                  <div className="columns">
                    <p className="form-label column is-1">
                      {locale.pricing_head}
                    </p>
                    <div className="column is-3">
                      <div className="columns aic">
                        <div className="column is-6 is-offset-1">
                          <TextInput
                            placeholder={
                              locale.product_containers
                                .product_price_input_placeholder
                            }
                            type="number"
                            value={price}
                            name="price"
                            onChange={this.saveToState}
                            onBlur={() =>
                              this.validation(["price"])
                                .then()
                                .catch(e => {})
                            }
                            errorMessage={this.state.priceError}
                          />
                        </div>

                        <div className="column is-10">
                          <p className="div-text">
                            {locale.product_containers.we_will_take_percentage1}{" "}
                            10%{" "}
                            {locale.product_containers.we_will_take_percentage2}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="column is-4" />
                    <div className="column is-4">
                      <div
                        className="columns is-multiline"
                        style={{ flexDirection: `row-reverse` }}
                      >
                        <div className="column is-8-desktop is-8-tablet is-full-mobile">
                          <TButton
                            ariaLabel="Save Product"
                            type="submit"
                            text={
                              locale.product_containers
                                .submit_button_placeholder
                            }
                            className="button grad-blue full"
                            onPress={this.saveProduct}
                            loading={is_busy}
                          />
                        </div>
                        <div
                          className="column is-4-desktop is-4-tablet is-8-mobile is-offset-2-mobile"
                          style={{
                            alignItems: `flex-end`,
                            display: `flex`,
                            justifyContent: `center`
                          }}
                        >
                          <a
                            className="t-button red outline full"
                            onPress={this.resetState}
                            href={`/${
                              this.props.match.params.lang
                            }/shop/${localStorage.getItem("shop_id")}`}
                          >
                            {locale.cancel}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <AddressPopUp
                updateAddress={this.updateAddress}
                ref={a => (this.AddressPopup = a)}
                lang={this.props.lang}
                translation={this.props.locale}
                autoSelectAddress={this.autoSelectAddress}
              />
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps,
  actions
)(withLoader(AddProduct));
