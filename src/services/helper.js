var currentYear = new Date().getFullYear();

export const arrNumGen = (limit = 80) =>
  Array.from({ length: limit }, (e, i) => {
    return { title: i + 1, value: i + 1 };
  });

export const yearGen = (limit = 20) =>
  Array.from({ length: limit }, (e, i) => {
    return { title: currentYear + i, value: currentYear + i };
  });

export const monthGen = () =>
  Array.from({ length: 12 }, (e, i) => {
    return { title: i + 1, value: i + 1 };
  });

export const getQueryStringValue = (search, key) => {
  return decodeURIComponent(
    search.replace(
      new RegExp(
        "^(?:.*[&\\?]" +
          encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") +
          "(?:\\=([^&]*))?)?.*$",
        "i"
      ),
      "$1"
    )
  );
};

export const Variation = class {
  constructor(colour, sizes = []) {
    this.colour_id = colour.id;

    this.color_image = colour.image;

    this.hex_code = colour.hex_code;

    this.images = Array.from({ length: 6 }, () => {
      return { file: "", is_main: 1 };
    });

    this.sizes = sizes.map(size => {
      return { size_id: size.size_id, stock: 0, title: size.abbreviation };
    });
  }
};

export const VariationFactory = class {
  constructor() {
    this.createVariation = function(has_color, colour, sizes = []) {
      let variation;
      if (has_color) variation = new productColour(colour, sizes);
      else {
        variation = new ProductNoColour();
      }

      return variation;
    };
  }
};

const productColour = class {
  constructor(colour, sizes = []) {
    this.colour_id = colour.id;

    this.color_image = colour.image;

    this.hex_code = colour.hex_code;

    this.images = Array.from({ length: 3 }, () => {
      return { file: "", is_main: 1 };
    });

    this.sizes = sizes.map(size => {
      return { size_id: size.size_id, stock: 0, title: size.abbreviation };
    });
  }
};
const ProductNoColour = class {
  constructor(colour = {}, sizes = []) {
    this.colour_id = 14;

    this.color_image =
      "https://static.tarbeeta.com/images/colors/14/transparent.svg";

    this.hex_code = colour.hex_code;

    this.images = Array.from({ length: 3 }, () => {
      return { file: "", is_main: 1 };
    });

    this.sizes = [
      {
        size_id: 1,
        stock: 0
      }
    ];
  }
};

export function getDataUri(url, callback) {
  var image = new Image();

  image.onload = function() {
    var canvas = document.createElement("canvas");
    canvas.width = this.naturalWidth;
    canvas.height = this.naturalHeight;

    canvas.getContext("2d").drawImage(this, 0, 0);

    callback(canvas.toDataURL("image/png"));
  };

  image.src = url;
}

export function uploadPic(e, fn) {
  if (!e.target.files[0]) return;
  fn(URL.createObjectURL(e.target.files[0]), e.target.files[0]);

  // getDataUri(URL.createObjectURL(e.target.files[0]), data => fn(data));
}
