import request from "../ultils/ApiCentral";
import { AR } from "../common";
import { urlQueryGenrator, isLoggedIn } from "../ultils";
import { gistLikeProduct } from "./GistService";

export function addProduct(product, images, langId, version="v1") {
  let data = new FormData();

  data.append("product", JSON.stringify(product));

  for (let property in images) {
    if (images[property]) {
      const myNewFile = new File(
        [images[property]],
        property + "." + images[property].name.split(".").pop(),
        {
          type: images[property].type
        }
      );
      data.append("images", myNewFile);
    }
  }

  return request(
    {
      url: `/product?lang_id=${langId}`,
      method: "POST",
      data
    },
    true,
    true,
    version
  );
}

export function fetchColors() {
  return request(
    {
      url: `/colour`,
      method: "GET"
    },
    true
  );
}
export function fetchSizes(subcategory_id, lang_id = AR) {
  return request(
    {
      url: `/Size/${subcategory_id}?lang_id=${lang_id}`,
      method: "GET"
    },
    true
  );
}

export function fetchMaterials(lang_id = AR) {
  return request(
    {
      url: `/material?lang_id=${lang_id}`,
      method: "GET"
    },
    true
  );
}

export function like(product_id, colour_id, lang_id) {
  return isLoggedIn()
    ? request(
        {
          url: `/product/like/${product_id}`,
          method: "POST",
          data: { colour_id }
        },
        true
      )
    : gistLikeProduct(product_id, colour_id, lang_id);
}

export function unlike(product_id, colour_id, lang_id) {
  return isLoggedIn()
    ? request(
        {
          url: `/product/unlike/${product_id}`,
          method: "POST",
          data: { colour_id }
        },
        true
      )
    : gistLikeProduct(product_id, colour_id, lang_id);
}

export function fetchProduct(id) {
  return request(
    {
      url: `/product?id=${id}`,
      method: "GET"
    },
    true
  );
}

export function editProduct(product, images, id, langId) {
  let data = new FormData();

  data.append("product", JSON.stringify(product));

  for (let property in images) {
    if (images[property]) {
      const myNewFile = new File(
        [images[property]],
        property + "." + images[property].name.split(".").pop(),
        {
          type: images[property].type
        }
      );
      data.append("images", myNewFile);
    }
  }

  return request(
    {
      url: `/product/edit/${id}?lang_id=${langId}`,
      method: "PUT",
      data
    },
    true,
    true
  );
}

export function fetchProducts(filters) {
  return request(
    {
      url: urlQueryGenrator(`/product?`, filters),
      method: "GET"
    },
    true
  );
}

export function getLikes(lang_id, page) {
  return request(
    {
      url: `/product/liked?lang_id=${lang_id}&page=${page}`,
      method: "GET"
    },
    true
  );
}

export function fetchProductsFilter(filters) {
  return request(
    {
      url: urlQueryGenrator(`/product/filters?`, filters),
      method: "GET"
    },
    true
  );
}

export function fetchSuggestions(txt, langId) {
  return request(
    {
      url: `/product/search/recommend?srchText=${txt}&lang_id=${langId}`,
      method: "GET"
    },
    true
  );
}
