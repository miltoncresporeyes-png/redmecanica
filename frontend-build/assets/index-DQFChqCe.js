const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/ProviderDashboard-CFIgqfN6.js","assets/vendor-react-C9gK5gKp.js","assets/vendor-utils-CyilRAHM.js","assets/AccountHub-BwuZG709.js","assets/ProviderOnboarding-BfxL9iHa.js","assets/autocompleteData-BCrnspmT.js","assets/ProviderSearch-CTbKHOIP.js","assets/TriageChatbot-L-DQzbTI.js","assets/HowItWorksModal-Cj3222HZ.js","assets/AboutUs-B8hPY-4Q.js","assets/createLucideIcon-CBunf2tC.js","assets/gauge-8sug0G49.js","assets/cpu-BETWaHh0.js","assets/wrench-CBC8eTT0.js","assets/Contact-9ma6Lrp9.js","assets/FAQ-Cv8osgK8.js","assets/HelpCenter-Clqxzb_t.js","assets/PricingPlans-DfXhNMU4.js","assets/x-_bLTi_Zy.js","assets/PrivacyPolicy-CbEC1jt7.js","assets/ProviderBenefits-ND6GZecd.js","assets/ProviderLanding-CxpZkSTz.js","assets/ServiceRequestFlow-ugBxhrUO.js","assets/SuccessStories-DSo7_l9S.js","assets/Terms-BfP7PXyX.js","assets/NotFoundPage-CDPiHffD.js","assets/AdminLayout-Daw3ikOd.js","assets/users-SgEdDFfH.js","assets/shield-alert-CEr0fE5L.js","assets/activity-B-e5Nr6m.js","assets/proxy-CF9ZQatx.js","assets/search-DEs_2hEI.js","assets/AdminDashboard-D2d-zACm.js","assets/calendar-zdPyMCKp.js","assets/download-sbWWPoCo.js","assets/trending-up-k74f4ASP.js","assets/clock-CeH-R9wG.js","assets/circle-check-erEt06PR.js","assets/funnel-DJEx6TPD.js","assets/map-pin-C_-eOcPS.js","assets/chevron-right-B_LRH53P.js","assets/UserManagement-PCafZPrL.js","assets/refresh-cw-zT7vZdTa.js","assets/index-BuLliQpS.js","assets/user-check-SQLMoNFq.js","assets/ProviderReview-CPseoMVb.js","assets/circle-x-B0Fgqlk1.js","assets/AuditLogs-CIoST0W9.js","assets/database-L9gvfuOP.js","assets/Monitoring-ZcB2NIyy.js","assets/Jobs-DtsN6IDb.js","assets/Subscriptions-RUO6v8Aj.js"])))=>i.map(i=>d[i]);
import { a as requireReact, c as requireReactDom, g as getDefaultExportFromCjs, r as reactExports, d as React, N as Navigate, O as Outlet, u as useLocation, e as useNavigate, L as Link, B as BrowserRouter, f as Routes, h as Route } from './vendor-react-C9gK5gKp.js';
import { a as axios } from './vendor-utils-CyilRAHM.js';

true              &&(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
}());

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production_min = {};

/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_production_min;

function requireReactJsxRuntime_production_min () {
	if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
	hasRequiredReactJsxRuntime_production_min = 1;
var f=requireReact(),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:true,ref:true,__self:true,__source:true};
	function q(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a) void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}reactJsxRuntime_production_min.Fragment=l;reactJsxRuntime_production_min.jsx=q;reactJsxRuntime_production_min.jsxs=q;
	return reactJsxRuntime_production_min;
}

var hasRequiredJsxRuntime;

function requireJsxRuntime () {
	if (hasRequiredJsxRuntime) return jsxRuntime.exports;
	hasRequiredJsxRuntime = 1;
	{
	  jsxRuntime.exports = requireReactJsxRuntime_production_min();
	}
	return jsxRuntime.exports;
}

var jsxRuntimeExports = requireJsxRuntime();

var client = {};

var hasRequiredClient;

function requireClient () {
	if (hasRequiredClient) return client;
	hasRequiredClient = 1;
	var m = requireReactDom();
	{
	  client.createRoot = m.createRoot;
	  client.hydrateRoot = m.hydrateRoot;
	}
	return client;
}

var clientExports = requireClient();
const ReactDOM = /*@__PURE__*/getDefaultExportFromCjs(clientExports);

/* global Map:readonly, Set:readonly, ArrayBuffer:readonly */

var reactFastCompare;
var hasRequiredReactFastCompare;

function requireReactFastCompare () {
	if (hasRequiredReactFastCompare) return reactFastCompare;
	hasRequiredReactFastCompare = 1;
	var hasElementType = typeof Element !== 'undefined';
	var hasMap = typeof Map === 'function';
	var hasSet = typeof Set === 'function';
	var hasArrayBuffer = typeof ArrayBuffer === 'function' && !!ArrayBuffer.isView;

	// Note: We **don't** need `envHasBigInt64Array` in fde es6/index.js

	function equal(a, b) {
	  // START: fast-deep-equal es6/index.js 3.1.3
	  if (a === b) return true;

	  if (a && b && typeof a == 'object' && typeof b == 'object') {
	    if (a.constructor !== b.constructor) return false;

	    var length, i, keys;
	    if (Array.isArray(a)) {
	      length = a.length;
	      if (length != b.length) return false;
	      for (i = length; i-- !== 0;)
	        if (!equal(a[i], b[i])) return false;
	      return true;
	    }

	    // START: Modifications:
	    // 1. Extra `has<Type> &&` helpers in initial condition allow es6 code
	    //    to co-exist with es5.
	    // 2. Replace `for of` with es5 compliant iteration using `for`.
	    //    Basically, take:
	    //
	    //    ```js
	    //    for (i of a.entries())
	    //      if (!b.has(i[0])) return false;
	    //    ```
	    //
	    //    ... and convert to:
	    //
	    //    ```js
	    //    it = a.entries();
	    //    while (!(i = it.next()).done)
	    //      if (!b.has(i.value[0])) return false;
	    //    ```
	    //
	    //    **Note**: `i` access switches to `i.value`.
	    var it;
	    if (hasMap && (a instanceof Map) && (b instanceof Map)) {
	      if (a.size !== b.size) return false;
	      it = a.entries();
	      while (!(i = it.next()).done)
	        if (!b.has(i.value[0])) return false;
	      it = a.entries();
	      while (!(i = it.next()).done)
	        if (!equal(i.value[1], b.get(i.value[0]))) return false;
	      return true;
	    }

	    if (hasSet && (a instanceof Set) && (b instanceof Set)) {
	      if (a.size !== b.size) return false;
	      it = a.entries();
	      while (!(i = it.next()).done)
	        if (!b.has(i.value[0])) return false;
	      return true;
	    }
	    // END: Modifications

	    if (hasArrayBuffer && ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
	      length = a.length;
	      if (length != b.length) return false;
	      for (i = length; i-- !== 0;)
	        if (a[i] !== b[i]) return false;
	      return true;
	    }

	    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
	    // START: Modifications:
	    // Apply guards for `Object.create(null)` handling. See:
	    // - https://github.com/FormidableLabs/react-fast-compare/issues/64
	    // - https://github.com/epoberezkin/fast-deep-equal/issues/49
	    if (a.valueOf !== Object.prototype.valueOf && typeof a.valueOf === 'function' && typeof b.valueOf === 'function') return a.valueOf() === b.valueOf();
	    if (a.toString !== Object.prototype.toString && typeof a.toString === 'function' && typeof b.toString === 'function') return a.toString() === b.toString();
	    // END: Modifications

	    keys = Object.keys(a);
	    length = keys.length;
	    if (length !== Object.keys(b).length) return false;

	    for (i = length; i-- !== 0;)
	      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
	    // END: fast-deep-equal

	    // START: react-fast-compare
	    // custom handling for DOM elements
	    if (hasElementType && a instanceof Element) return false;

	    // custom handling for React/Preact
	    for (i = length; i-- !== 0;) {
	      if ((keys[i] === '_owner' || keys[i] === '__v' || keys[i] === '__o') && a.$$typeof) {
	        // React-specific: avoid traversing React elements' _owner
	        // Preact-specific: avoid traversing Preact elements' __v and __o
	        //    __v = $_original / $_vnode
	        //    __o = $_owner
	        // These properties contain circular references and are not needed when
	        // comparing the actual elements (and not their owners)
	        // .$$typeof and ._store on just reasonable markers of elements

	        continue;
	      }

	      // all other properties should be traversed as usual
	      if (!equal(a[keys[i]], b[keys[i]])) return false;
	    }
	    // END: react-fast-compare

	    // START: fast-deep-equal
	    return true;
	  }

	  return a !== a && b !== b;
	}
	// end fast-deep-equal

	reactFastCompare = function isEqual(a, b) {
	  try {
	    return equal(a, b);
	  } catch (error) {
	    if (((error.message || '').match(/stack|recursion/i))) {
	      // warn on circular references, don't crash
	      // browsers give this different errors name and messages:
	      // chrome/safari: "RangeError", "Maximum call stack size exceeded"
	      // firefox: "InternalError", too much recursion"
	      // edge: "Error", "Out of stack space"
	      console.warn('react-fast-compare cannot handle circular refs');
	      return false;
	    }
	    // some other error. we should definitely know about these
	    throw error;
	  }
	};
	return reactFastCompare;
}

var reactFastCompareExports = requireReactFastCompare();
const fastCompare = /*@__PURE__*/getDefaultExportFromCjs(reactFastCompareExports);

var browser;
var hasRequiredBrowser;

function requireBrowser () {
	if (hasRequiredBrowser) return browser;
	hasRequiredBrowser = 1;
	var invariant = function(condition, format, a, b, c, d, e, f) {
	  if (!condition) {
	    var error;
	    if (format === void 0) {
	      error = new Error(
	        "Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings."
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        format.replace(/%s/g, function() {
	          return args[argIndex++];
	        })
	      );
	      error.name = "Invariant Violation";
	    }
	    error.framesToPop = 1;
	    throw error;
	  }
	};
	browser = invariant;
	return browser;
}

var browserExports = requireBrowser();
const invariant = /*@__PURE__*/getDefaultExportFromCjs(browserExports);

var shallowequal;
var hasRequiredShallowequal;

function requireShallowequal () {
	if (hasRequiredShallowequal) return shallowequal;
	hasRequiredShallowequal = 1;
	//

	shallowequal = function shallowEqual(objA, objB, compare, compareContext) {
	  var ret = compare ? compare.call(compareContext, objA, objB) : void 0;

	  if (ret !== void 0) {
	    return !!ret;
	  }

	  if (objA === objB) {
	    return true;
	  }

	  if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) {
	    return false;
	  }

	  var keysA = Object.keys(objA);
	  var keysB = Object.keys(objB);

	  if (keysA.length !== keysB.length) {
	    return false;
	  }

	  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

	  // Test for A's keys different from B.
	  for (var idx = 0; idx < keysA.length; idx++) {
	    var key = keysA[idx];

	    if (!bHasOwnProperty(key)) {
	      return false;
	    }

	    var valueA = objA[key];
	    var valueB = objB[key];

	    ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;

	    if (ret === false || (ret === void 0 && valueA !== valueB)) {
	      return false;
	    }
	  }

	  return true;
	};
	return shallowequal;
}

var shallowequalExports = requireShallowequal();
const shallowEqual = /*@__PURE__*/getDefaultExportFromCjs(shallowequalExports);

// src/index.tsx

// src/constants.ts
var TAG_NAMES = /* @__PURE__ */ ((TAG_NAMES2) => {
  TAG_NAMES2["BASE"] = "base";
  TAG_NAMES2["BODY"] = "body";
  TAG_NAMES2["HEAD"] = "head";
  TAG_NAMES2["HTML"] = "html";
  TAG_NAMES2["LINK"] = "link";
  TAG_NAMES2["META"] = "meta";
  TAG_NAMES2["NOSCRIPT"] = "noscript";
  TAG_NAMES2["SCRIPT"] = "script";
  TAG_NAMES2["STYLE"] = "style";
  TAG_NAMES2["TITLE"] = "title";
  TAG_NAMES2["FRAGMENT"] = "Symbol(react.fragment)";
  return TAG_NAMES2;
})(TAG_NAMES || {});
var SEO_PRIORITY_TAGS = {
  link: { rel: ["amphtml", "canonical", "alternate"] },
  script: { type: ["application/ld+json"] },
  meta: {
    charset: "",
    name: ["generator", "robots", "description"],
    property: [
      "og:type",
      "og:title",
      "og:url",
      "og:image",
      "og:image:alt",
      "og:description",
      "twitter:url",
      "twitter:title",
      "twitter:description",
      "twitter:image",
      "twitter:image:alt",
      "twitter:card",
      "twitter:site"
    ]
  }
};
var VALID_TAG_NAMES = Object.values(TAG_NAMES);
var REACT_TAG_MAP = {
  accesskey: "accessKey",
  charset: "charSet",
  class: "className",
  contenteditable: "contentEditable",
  contextmenu: "contextMenu",
  "http-equiv": "httpEquiv",
  itemprop: "itemProp",
  tabindex: "tabIndex"
};
var HTML_TAG_MAP = Object.entries(REACT_TAG_MAP).reduce(
  (carry, [key, value]) => {
    carry[value] = key;
    return carry;
  },
  {}
);
var HELMET_ATTRIBUTE = "data-rh";

// src/utils.ts
var HELMET_PROPS = {
  DEFAULT_TITLE: "defaultTitle",
  DEFER: "defer",
  ENCODE_SPECIAL_CHARACTERS: "encodeSpecialCharacters",
  ON_CHANGE_CLIENT_STATE: "onChangeClientState",
  TITLE_TEMPLATE: "titleTemplate",
  PRIORITIZE_SEO_TAGS: "prioritizeSeoTags"
};
var getInnermostProperty = (propsList, property) => {
  for (let i = propsList.length - 1; i >= 0; i -= 1) {
    const props = propsList[i];
    if (Object.prototype.hasOwnProperty.call(props, property)) {
      return props[property];
    }
  }
  return null;
};
var getTitleFromPropsList = (propsList) => {
  let innermostTitle = getInnermostProperty(propsList, "title" /* TITLE */);
  const innermostTemplate = getInnermostProperty(propsList, HELMET_PROPS.TITLE_TEMPLATE);
  if (Array.isArray(innermostTitle)) {
    innermostTitle = innermostTitle.join("");
  }
  if (innermostTemplate && innermostTitle) {
    return innermostTemplate.replace(/%s/g, () => innermostTitle);
  }
  const innermostDefaultTitle = getInnermostProperty(propsList, HELMET_PROPS.DEFAULT_TITLE);
  return innermostTitle || innermostDefaultTitle || void 0;
};
var getOnChangeClientState = (propsList) => getInnermostProperty(propsList, HELMET_PROPS.ON_CHANGE_CLIENT_STATE) || (() => {
});
var getAttributesFromPropsList = (tagType, propsList) => propsList.filter((props) => typeof props[tagType] !== "undefined").map((props) => props[tagType]).reduce((tagAttrs, current) => ({ ...tagAttrs, ...current }), {});
var getBaseTagFromPropsList = (primaryAttributes, propsList) => propsList.filter((props) => typeof props["base" /* BASE */] !== "undefined").map((props) => props["base" /* BASE */]).reverse().reduce((innermostBaseTag, tag) => {
  if (!innermostBaseTag.length) {
    const keys = Object.keys(tag);
    for (let i = 0; i < keys.length; i += 1) {
      const attributeKey = keys[i];
      const lowerCaseAttributeKey = attributeKey.toLowerCase();
      if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && tag[lowerCaseAttributeKey]) {
        return innermostBaseTag.concat(tag);
      }
    }
  }
  return innermostBaseTag;
}, []);
var warn = (msg) => console && typeof console.warn === "function" && console.warn(msg);
var getTagsFromPropsList = (tagName, primaryAttributes, propsList) => {
  const approvedSeenTags = {};
  return propsList.filter((props) => {
    if (Array.isArray(props[tagName])) {
      return true;
    }
    if (typeof props[tagName] !== "undefined") {
      warn(
        `Helmet: ${tagName} should be of type "Array". Instead found type "${typeof props[tagName]}"`
      );
    }
    return false;
  }).map((props) => props[tagName]).reverse().reduce((approvedTags, instanceTags) => {
    const instanceSeenTags = {};
    instanceTags.filter((tag) => {
      let primaryAttributeKey;
      const keys2 = Object.keys(tag);
      for (let i = 0; i < keys2.length; i += 1) {
        const attributeKey = keys2[i];
        const lowerCaseAttributeKey = attributeKey.toLowerCase();
        if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && !(primaryAttributeKey === "rel" /* REL */ && tag[primaryAttributeKey].toLowerCase() === "canonical") && !(lowerCaseAttributeKey === "rel" /* REL */ && tag[lowerCaseAttributeKey].toLowerCase() === "stylesheet")) {
          primaryAttributeKey = lowerCaseAttributeKey;
        }
        if (primaryAttributes.indexOf(attributeKey) !== -1 && (attributeKey === "innerHTML" /* INNER_HTML */ || attributeKey === "cssText" /* CSS_TEXT */ || attributeKey === "itemprop" /* ITEM_PROP */)) {
          primaryAttributeKey = attributeKey;
        }
      }
      if (!primaryAttributeKey || !tag[primaryAttributeKey]) {
        return false;
      }
      const value = tag[primaryAttributeKey].toLowerCase();
      if (!approvedSeenTags[primaryAttributeKey]) {
        approvedSeenTags[primaryAttributeKey] = {};
      }
      if (!instanceSeenTags[primaryAttributeKey]) {
        instanceSeenTags[primaryAttributeKey] = {};
      }
      if (!approvedSeenTags[primaryAttributeKey][value]) {
        instanceSeenTags[primaryAttributeKey][value] = true;
        return true;
      }
      return false;
    }).reverse().forEach((tag) => approvedTags.push(tag));
    const keys = Object.keys(instanceSeenTags);
    for (let i = 0; i < keys.length; i += 1) {
      const attributeKey = keys[i];
      const tagUnion = {
        ...approvedSeenTags[attributeKey],
        ...instanceSeenTags[attributeKey]
      };
      approvedSeenTags[attributeKey] = tagUnion;
    }
    return approvedTags;
  }, []).reverse();
};
var getAnyTrueFromPropsList = (propsList, checkedTag) => {
  if (Array.isArray(propsList) && propsList.length) {
    for (let index = 0; index < propsList.length; index += 1) {
      const prop = propsList[index];
      if (prop[checkedTag]) {
        return true;
      }
    }
  }
  return false;
};
var reducePropsToState = (propsList) => ({
  baseTag: getBaseTagFromPropsList(["href" /* HREF */], propsList),
  bodyAttributes: getAttributesFromPropsList("bodyAttributes" /* BODY */, propsList),
  defer: getInnermostProperty(propsList, HELMET_PROPS.DEFER),
  encode: getInnermostProperty(propsList, HELMET_PROPS.ENCODE_SPECIAL_CHARACTERS),
  htmlAttributes: getAttributesFromPropsList("htmlAttributes" /* HTML */, propsList),
  linkTags: getTagsFromPropsList(
    "link" /* LINK */,
    ["rel" /* REL */, "href" /* HREF */],
    propsList
  ),
  metaTags: getTagsFromPropsList(
    "meta" /* META */,
    [
      "name" /* NAME */,
      "charset" /* CHARSET */,
      "http-equiv" /* HTTPEQUIV */,
      "property" /* PROPERTY */,
      "itemprop" /* ITEM_PROP */
    ],
    propsList
  ),
  noscriptTags: getTagsFromPropsList("noscript" /* NOSCRIPT */, ["innerHTML" /* INNER_HTML */], propsList),
  onChangeClientState: getOnChangeClientState(propsList),
  scriptTags: getTagsFromPropsList(
    "script" /* SCRIPT */,
    ["src" /* SRC */, "innerHTML" /* INNER_HTML */],
    propsList
  ),
  styleTags: getTagsFromPropsList("style" /* STYLE */, ["cssText" /* CSS_TEXT */], propsList),
  title: getTitleFromPropsList(propsList),
  titleAttributes: getAttributesFromPropsList("titleAttributes" /* TITLE */, propsList),
  prioritizeSeoTags: getAnyTrueFromPropsList(propsList, HELMET_PROPS.PRIORITIZE_SEO_TAGS)
});
var flattenArray = (possibleArray) => Array.isArray(possibleArray) ? possibleArray.join("") : possibleArray;
var checkIfPropsMatch = (props, toMatch) => {
  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; i += 1) {
    if (toMatch[keys[i]] && toMatch[keys[i]].includes(props[keys[i]])) {
      return true;
    }
  }
  return false;
};
var prioritizer = (elementsList, propsToMatch) => {
  if (Array.isArray(elementsList)) {
    return elementsList.reduce(
      (acc, elementAttrs) => {
        if (checkIfPropsMatch(elementAttrs, propsToMatch)) {
          acc.priority.push(elementAttrs);
        } else {
          acc.default.push(elementAttrs);
        }
        return acc;
      },
      { priority: [], default: [] }
    );
  }
  return { default: elementsList, priority: [] };
};
var without = (obj, key) => {
  return {
    ...obj,
    [key]: void 0
  };
};

// src/server.ts
var SELF_CLOSING_TAGS = ["noscript" /* NOSCRIPT */, "script" /* SCRIPT */, "style" /* STYLE */];
var encodeSpecialCharacters = (str, encode = true) => {
  if (encode === false) {
    return String(str);
  }
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
};
var generateElementAttributesAsString = (attributes) => Object.keys(attributes).reduce((str, key) => {
  const attr = typeof attributes[key] !== "undefined" ? `${key}="${attributes[key]}"` : `${key}`;
  return str ? `${str} ${attr}` : attr;
}, "");
var generateTitleAsString = (type, title, attributes, encode) => {
  const attributeString = generateElementAttributesAsString(attributes);
  const flattenedTitle = flattenArray(title);
  return attributeString ? `<${type} ${HELMET_ATTRIBUTE}="true" ${attributeString}>${encodeSpecialCharacters(
    flattenedTitle,
    encode
  )}</${type}>` : `<${type} ${HELMET_ATTRIBUTE}="true">${encodeSpecialCharacters(
    flattenedTitle,
    encode
  )}</${type}>`;
};
var generateTagsAsString = (type, tags, encode = true) => tags.reduce((str, t) => {
  const tag = t;
  const attributeHtml = Object.keys(tag).filter(
    (attribute) => !(attribute === "innerHTML" /* INNER_HTML */ || attribute === "cssText" /* CSS_TEXT */)
  ).reduce((string, attribute) => {
    const attr = typeof tag[attribute] === "undefined" ? attribute : `${attribute}="${encodeSpecialCharacters(tag[attribute], encode)}"`;
    return string ? `${string} ${attr}` : attr;
  }, "");
  const tagContent = tag.innerHTML || tag.cssText || "";
  const isSelfClosing = SELF_CLOSING_TAGS.indexOf(type) === -1;
  return `${str}<${type} ${HELMET_ATTRIBUTE}="true" ${attributeHtml}${isSelfClosing ? `/>` : `>${tagContent}</${type}>`}`;
}, "");
var convertElementAttributesToReactProps = (attributes, initProps = {}) => Object.keys(attributes).reduce((obj, key) => {
  const mapped = REACT_TAG_MAP[key];
  obj[mapped || key] = attributes[key];
  return obj;
}, initProps);
var generateTitleAsReactComponent = (_type, title, attributes) => {
  const initProps = {
    key: title,
    [HELMET_ATTRIBUTE]: true
  };
  const props = convertElementAttributesToReactProps(attributes, initProps);
  return [React.createElement("title" /* TITLE */, props, title)];
};
var generateTagsAsReactComponent = (type, tags) => tags.map((tag, i) => {
  const mappedTag = {
    key: i,
    [HELMET_ATTRIBUTE]: true
  };
  Object.keys(tag).forEach((attribute) => {
    const mapped = REACT_TAG_MAP[attribute];
    const mappedAttribute = mapped || attribute;
    if (mappedAttribute === "innerHTML" /* INNER_HTML */ || mappedAttribute === "cssText" /* CSS_TEXT */) {
      const content = tag.innerHTML || tag.cssText;
      mappedTag.dangerouslySetInnerHTML = { __html: content };
    } else {
      mappedTag[mappedAttribute] = tag[attribute];
    }
  });
  return React.createElement(type, mappedTag);
});
var getMethodsForTag = (type, tags, encode = true) => {
  switch (type) {
    case "title" /* TITLE */:
      return {
        toComponent: () => generateTitleAsReactComponent(type, tags.title, tags.titleAttributes),
        toString: () => generateTitleAsString(type, tags.title, tags.titleAttributes, encode)
      };
    case "bodyAttributes" /* BODY */:
    case "htmlAttributes" /* HTML */:
      return {
        toComponent: () => convertElementAttributesToReactProps(tags),
        toString: () => generateElementAttributesAsString(tags)
      };
    default:
      return {
        toComponent: () => generateTagsAsReactComponent(type, tags),
        toString: () => generateTagsAsString(type, tags, encode)
      };
  }
};
var getPriorityMethods = ({ metaTags, linkTags, scriptTags, encode }) => {
  const meta = prioritizer(metaTags, SEO_PRIORITY_TAGS.meta);
  const link = prioritizer(linkTags, SEO_PRIORITY_TAGS.link);
  const script = prioritizer(scriptTags, SEO_PRIORITY_TAGS.script);
  const priorityMethods = {
    toComponent: () => [
      ...generateTagsAsReactComponent("meta" /* META */, meta.priority),
      ...generateTagsAsReactComponent("link" /* LINK */, link.priority),
      ...generateTagsAsReactComponent("script" /* SCRIPT */, script.priority)
    ],
    toString: () => (
      // generate all the tags as strings and concatenate them
      `${getMethodsForTag("meta" /* META */, meta.priority, encode)} ${getMethodsForTag(
        "link" /* LINK */,
        link.priority,
        encode
      )} ${getMethodsForTag("script" /* SCRIPT */, script.priority, encode)}`
    )
  };
  return {
    priorityMethods,
    metaTags: meta.default,
    linkTags: link.default,
    scriptTags: script.default
  };
};
var mapStateOnServer = (props) => {
  const {
    baseTag,
    bodyAttributes,
    encode = true,
    htmlAttributes,
    noscriptTags,
    styleTags,
    title = "",
    titleAttributes,
    prioritizeSeoTags
  } = props;
  let { linkTags, metaTags, scriptTags } = props;
  let priorityMethods = {
    toComponent: () => {
    },
    toString: () => ""
  };
  if (prioritizeSeoTags) {
    ({ priorityMethods, linkTags, metaTags, scriptTags } = getPriorityMethods(props));
  }
  return {
    priority: priorityMethods,
    base: getMethodsForTag("base" /* BASE */, baseTag, encode),
    bodyAttributes: getMethodsForTag("bodyAttributes" /* BODY */, bodyAttributes, encode),
    htmlAttributes: getMethodsForTag("htmlAttributes" /* HTML */, htmlAttributes, encode),
    link: getMethodsForTag("link" /* LINK */, linkTags, encode),
    meta: getMethodsForTag("meta" /* META */, metaTags, encode),
    noscript: getMethodsForTag("noscript" /* NOSCRIPT */, noscriptTags, encode),
    script: getMethodsForTag("script" /* SCRIPT */, scriptTags, encode),
    style: getMethodsForTag("style" /* STYLE */, styleTags, encode),
    title: getMethodsForTag("title" /* TITLE */, { title, titleAttributes }, encode)
  };
};
var server_default = mapStateOnServer;

// src/HelmetData.ts
var instances = [];
var isDocument = !!(typeof window !== "undefined" && window.document && window.document.createElement);
var HelmetData = class {
  instances = [];
  canUseDOM = isDocument;
  context;
  value = {
    setHelmet: (serverState) => {
      this.context.helmet = serverState;
    },
    helmetInstances: {
      get: () => this.canUseDOM ? instances : this.instances,
      add: (instance) => {
        (this.canUseDOM ? instances : this.instances).push(instance);
      },
      remove: (instance) => {
        const index = (this.canUseDOM ? instances : this.instances).indexOf(instance);
        (this.canUseDOM ? instances : this.instances).splice(index, 1);
      }
    }
  };
  constructor(context, canUseDOM) {
    this.context = context;
    this.canUseDOM = canUseDOM || false;
    if (!canUseDOM) {
      context.helmet = server_default({
        baseTag: [],
        bodyAttributes: {},
        htmlAttributes: {},
        linkTags: [],
        metaTags: [],
        noscriptTags: [],
        scriptTags: [],
        styleTags: [],
        title: "",
        titleAttributes: {}
      });
    }
  }
};

// src/Provider.tsx
var defaultValue = {};
var Context = React.createContext(defaultValue);
var HelmetProvider = class _HelmetProvider extends reactExports.Component {
  static canUseDOM = isDocument;
  helmetData;
  constructor(props) {
    super(props);
    this.helmetData = new HelmetData(this.props.context || {}, _HelmetProvider.canUseDOM);
  }
  render() {
    return /* @__PURE__ */ React.createElement(Context.Provider, { value: this.helmetData.value }, this.props.children);
  }
};

// src/client.ts
var updateTags = (type, tags) => {
  const headElement = document.head || document.querySelector("head" /* HEAD */);
  const tagNodes = headElement.querySelectorAll(`${type}[${HELMET_ATTRIBUTE}]`);
  const oldTags = [].slice.call(tagNodes);
  const newTags = [];
  let indexToDelete;
  if (tags && tags.length) {
    tags.forEach((tag) => {
      const newElement = document.createElement(type);
      for (const attribute in tag) {
        if (Object.prototype.hasOwnProperty.call(tag, attribute)) {
          if (attribute === "innerHTML" /* INNER_HTML */) {
            newElement.innerHTML = tag.innerHTML;
          } else if (attribute === "cssText" /* CSS_TEXT */) {
            if (newElement.styleSheet) {
              newElement.styleSheet.cssText = tag.cssText;
            } else {
              newElement.appendChild(document.createTextNode(tag.cssText));
            }
          } else {
            const attr = attribute;
            const value = typeof tag[attr] === "undefined" ? "" : tag[attr];
            newElement.setAttribute(attribute, value);
          }
        }
      }
      newElement.setAttribute(HELMET_ATTRIBUTE, "true");
      if (oldTags.some((existingTag, index) => {
        indexToDelete = index;
        return newElement.isEqualNode(existingTag);
      })) {
        oldTags.splice(indexToDelete, 1);
      } else {
        newTags.push(newElement);
      }
    });
  }
  oldTags.forEach((tag) => tag.parentNode?.removeChild(tag));
  newTags.forEach((tag) => headElement.appendChild(tag));
  return {
    oldTags,
    newTags
  };
};
var updateAttributes = (tagName, attributes) => {
  const elementTag = document.getElementsByTagName(tagName)[0];
  if (!elementTag) {
    return;
  }
  const helmetAttributeString = elementTag.getAttribute(HELMET_ATTRIBUTE);
  const helmetAttributes = helmetAttributeString ? helmetAttributeString.split(",") : [];
  const attributesToRemove = [...helmetAttributes];
  const attributeKeys = Object.keys(attributes);
  for (const attribute of attributeKeys) {
    const value = attributes[attribute] || "";
    if (elementTag.getAttribute(attribute) !== value) {
      elementTag.setAttribute(attribute, value);
    }
    if (helmetAttributes.indexOf(attribute) === -1) {
      helmetAttributes.push(attribute);
    }
    const indexToSave = attributesToRemove.indexOf(attribute);
    if (indexToSave !== -1) {
      attributesToRemove.splice(indexToSave, 1);
    }
  }
  for (let i = attributesToRemove.length - 1; i >= 0; i -= 1) {
    elementTag.removeAttribute(attributesToRemove[i]);
  }
  if (helmetAttributes.length === attributesToRemove.length) {
    elementTag.removeAttribute(HELMET_ATTRIBUTE);
  } else if (elementTag.getAttribute(HELMET_ATTRIBUTE) !== attributeKeys.join(",")) {
    elementTag.setAttribute(HELMET_ATTRIBUTE, attributeKeys.join(","));
  }
};
var updateTitle = (title, attributes) => {
  if (typeof title !== "undefined" && document.title !== title) {
    document.title = flattenArray(title);
  }
  updateAttributes("title" /* TITLE */, attributes);
};
var commitTagChanges = (newState, cb) => {
  const {
    baseTag,
    bodyAttributes,
    htmlAttributes,
    linkTags,
    metaTags,
    noscriptTags,
    onChangeClientState,
    scriptTags,
    styleTags,
    title,
    titleAttributes
  } = newState;
  updateAttributes("body" /* BODY */, bodyAttributes);
  updateAttributes("html" /* HTML */, htmlAttributes);
  updateTitle(title, titleAttributes);
  const tagUpdates = {
    baseTag: updateTags("base" /* BASE */, baseTag),
    linkTags: updateTags("link" /* LINK */, linkTags),
    metaTags: updateTags("meta" /* META */, metaTags),
    noscriptTags: updateTags("noscript" /* NOSCRIPT */, noscriptTags),
    scriptTags: updateTags("script" /* SCRIPT */, scriptTags),
    styleTags: updateTags("style" /* STYLE */, styleTags)
  };
  const addedTags = {};
  const removedTags = {};
  Object.keys(tagUpdates).forEach((tagType) => {
    const { newTags, oldTags } = tagUpdates[tagType];
    if (newTags.length) {
      addedTags[tagType] = newTags;
    }
    if (oldTags.length) {
      removedTags[tagType] = tagUpdates[tagType].oldTags;
    }
  });
  if (cb) {
    cb();
  }
  onChangeClientState(newState, addedTags, removedTags);
};
var _helmetCallback = null;
var handleStateChangeOnClient = (newState) => {
  if (_helmetCallback) {
    cancelAnimationFrame(_helmetCallback);
  }
  if (newState.defer) {
    _helmetCallback = requestAnimationFrame(() => {
      commitTagChanges(newState, () => {
        _helmetCallback = null;
      });
    });
  } else {
    commitTagChanges(newState);
    _helmetCallback = null;
  }
};
var client_default = handleStateChangeOnClient;

// src/Dispatcher.tsx
var HelmetDispatcher = class extends reactExports.Component {
  rendered = false;
  shouldComponentUpdate(nextProps) {
    return !shallowEqual(nextProps, this.props);
  }
  componentDidUpdate() {
    this.emitChange();
  }
  componentWillUnmount() {
    const { helmetInstances } = this.props.context;
    helmetInstances.remove(this);
    this.emitChange();
  }
  emitChange() {
    const { helmetInstances, setHelmet } = this.props.context;
    let serverState = null;
    const state = reducePropsToState(
      helmetInstances.get().map((instance) => {
        const props = { ...instance.props };
        delete props.context;
        return props;
      })
    );
    if (HelmetProvider.canUseDOM) {
      client_default(state);
    } else if (server_default) {
      serverState = server_default(state);
    }
    setHelmet(serverState);
  }
  // componentWillMount will be deprecated
  // for SSR, initialize on first render
  // constructor is also unsafe in StrictMode
  init() {
    if (this.rendered) {
      return;
    }
    this.rendered = true;
    const { helmetInstances } = this.props.context;
    helmetInstances.add(this);
    this.emitChange();
  }
  render() {
    this.init();
    return null;
  }
};

// src/index.tsx
var Helmet = class extends reactExports.Component {
  static defaultProps = {
    defer: true,
    encodeSpecialCharacters: true,
    prioritizeSeoTags: false
  };
  shouldComponentUpdate(nextProps) {
    return !fastCompare(without(this.props, "helmetData"), without(nextProps, "helmetData"));
  }
  mapNestedChildrenToProps(child, nestedChildren) {
    if (!nestedChildren) {
      return null;
    }
    switch (child.type) {
      case "script" /* SCRIPT */:
      case "noscript" /* NOSCRIPT */:
        return {
          innerHTML: nestedChildren
        };
      case "style" /* STYLE */:
        return {
          cssText: nestedChildren
        };
      default:
        throw new Error(
          `<${child.type} /> elements are self-closing and can not contain children. Refer to our API for more information.`
        );
    }
  }
  flattenArrayTypeChildren(child, arrayTypeChildren, newChildProps, nestedChildren) {
    return {
      ...arrayTypeChildren,
      [child.type]: [
        ...arrayTypeChildren[child.type] || [],
        {
          ...newChildProps,
          ...this.mapNestedChildrenToProps(child, nestedChildren)
        }
      ]
    };
  }
  mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren) {
    switch (child.type) {
      case "title" /* TITLE */:
        return {
          ...newProps,
          [child.type]: nestedChildren,
          titleAttributes: { ...newChildProps }
        };
      case "body" /* BODY */:
        return {
          ...newProps,
          bodyAttributes: { ...newChildProps }
        };
      case "html" /* HTML */:
        return {
          ...newProps,
          htmlAttributes: { ...newChildProps }
        };
      default:
        return {
          ...newProps,
          [child.type]: { ...newChildProps }
        };
    }
  }
  mapArrayTypeChildrenToProps(arrayTypeChildren, newProps) {
    let newFlattenedProps = { ...newProps };
    Object.keys(arrayTypeChildren).forEach((arrayChildName) => {
      newFlattenedProps = {
        ...newFlattenedProps,
        [arrayChildName]: arrayTypeChildren[arrayChildName]
      };
    });
    return newFlattenedProps;
  }
  warnOnInvalidChildren(child, nestedChildren) {
    invariant(
      VALID_TAG_NAMES.some((name) => child.type === name),
      typeof child.type === "function" ? `You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.` : `Only elements types ${VALID_TAG_NAMES.join(
        ", "
      )} are allowed. Helmet does not support rendering <${child.type}> elements. Refer to our API for more information.`
    );
    invariant(
      !nestedChildren || typeof nestedChildren === "string" || Array.isArray(nestedChildren) && !nestedChildren.some((nestedChild) => typeof nestedChild !== "string"),
      `Helmet expects a string as a child of <${child.type}>. Did you forget to wrap your children in braces? ( <${child.type}>{\`\`}</${child.type}> ) Refer to our API for more information.`
    );
    return true;
  }
  mapChildrenToProps(children, newProps) {
    let arrayTypeChildren = {};
    React.Children.forEach(children, (child) => {
      if (!child || !child.props) {
        return;
      }
      const { children: nestedChildren, ...childProps } = child.props;
      const newChildProps = Object.keys(childProps).reduce((obj, key) => {
        obj[HTML_TAG_MAP[key] || key] = childProps[key];
        return obj;
      }, {});
      let { type } = child;
      if (typeof type === "symbol") {
        type = type.toString();
      } else {
        this.warnOnInvalidChildren(child, nestedChildren);
      }
      switch (type) {
        case "Symbol(react.fragment)" /* FRAGMENT */:
          newProps = this.mapChildrenToProps(nestedChildren, newProps);
          break;
        case "link" /* LINK */:
        case "meta" /* META */:
        case "noscript" /* NOSCRIPT */:
        case "script" /* SCRIPT */:
        case "style" /* STYLE */:
          arrayTypeChildren = this.flattenArrayTypeChildren(
            child,
            arrayTypeChildren,
            newChildProps,
            nestedChildren
          );
          break;
        default:
          newProps = this.mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren);
          break;
      }
    });
    return this.mapArrayTypeChildrenToProps(arrayTypeChildren, newProps);
  }
  render() {
    const { children, ...props } = this.props;
    let newProps = { ...props };
    let { helmetData } = props;
    if (children) {
      newProps = this.mapChildrenToProps(children, newProps);
    }
    if (helmetData && !(helmetData instanceof HelmetData)) {
      const data = helmetData;
      helmetData = new HelmetData(data.context, true);
      delete newProps.helmetData;
    }
    return helmetData ? /* @__PURE__ */ React.createElement(HelmetDispatcher, { ...newProps, context: helmetData.value }) : /* @__PURE__ */ React.createElement(Context.Consumer, null, (context) => /* @__PURE__ */ React.createElement(HelmetDispatcher, { ...newProps, context }));
  }
};

const scriptRel = 'modulepreload';const assetsURL = function(dep) { return "/"+dep };const seen = {};const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (true               && deps && deps.length > 0) {
    let allSettled2 = function(promises) {
      return Promise.all(
        promises.map(
          (p) => Promise.resolve(p).then(
            (value) => ({ status: "fulfilled", value }),
            (reason) => ({ status: "rejected", reason })
          )
        )
      );
    };
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = allSettled2(
      deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};

const TOKEN_KEY = "auth_token";
let accessToken = localStorage.getItem(TOKEN_KEY);
const resolveApiUrl$1 = () => {
  const envApiUrl = "https://backend-production-f294e.up.railway.app/api".trim();
  if (typeof window !== "undefined" && window.location.hostname.endsWith("redmecanica.cl")) {
    return "/api";
  }
  return envApiUrl || "/api";
};
const setAuthToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};
const api$1 = axios.create({
  baseURL: resolveApiUrl$1().replace(/\/$/, ""),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});
api$1.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
api$1.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest.url?.includes("/auth/");
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        const { data } = await api$1.post("/auth/refresh");
        setAuthToken(data.token);
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api$1(originalRequest);
      } catch (refreshError) {
        setAuthToken(null);
        window.dispatchEvent(new CustomEvent("session-expired"));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

const AuthContext = reactExports.createContext(void 0);
const AuthProvider = ({ children }) => {
  const [user, setUser] = reactExports.useState(null);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      setAuthToken(null);
    };
    window.addEventListener("session-expired", handleSessionExpired);
    checkAuth();
    return () => window.removeEventListener("session-expired", handleSessionExpired);
  }, []);
  const checkAuth = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const { data } = await api$1.get("/auth/me");
      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  const login = async (credentials) => {
    const { data } = await api$1.post("/auth/login", credentials);
    setAuthToken(data.token);
    setUser(data.user);
  };
  const register = async (dto) => {
    const { data } = await api$1.post("/auth/register", dto);
    setAuthToken(data.token);
    setUser(data.user);
  };
  const logout = async () => {
    try {
      await api$1.post("/auth/logout");
    } finally {
      setAuthToken(null);
      setUser(null);
      window.location.href = "/";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value: { user, isAuthenticated: !!user, isLoading, login, register, logout, updateUser: setUser }, children });
};
const useAuth = () => {
  const context = reactExports.useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const RequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Loading..." });
  if (!isAuthenticated) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login", replace: true });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
};
const RequireRole = ({ roles }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Loading..." });
  if (!user || !roles.includes(user.role)) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/unauthorized", replace: true });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
};

const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";
const initGA = () => {
  if (typeof window === "undefined") return;
  if (window.gtag) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(...args) {
    window.dataLayer.push(args);
  };
  window.gtag("js", /* @__PURE__ */ new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    // We'll handle page views manually
    cookie_flags: "SameSite=None;Secure",
    cookie_domain: "auto"
  });
};
const usePageTracking = () => {
  const location = useLocation();
  reactExports.useEffect(() => {
    if (typeof window === "undefined" || !window.gtag) return;
    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
      page_title: document.title
    });
  }, [location]);
};

const AnalyticsProvider = ({ children }) => {
  reactExports.useEffect(() => {
    initGA();
  }, []);
  usePageTracking();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
};

const ToastContext = reactExports.createContext(void 0);
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = reactExports.useState([]);
  const addToast = reactExports.useCallback((message, type, duration = 5e3) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type, duration };
    setToasts((prev) => [...prev, newToast]);
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);
  const removeToast = reactExports.useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ToastContext.Provider, { value: { toasts, addToast, removeToast }, children: [
    children,
    /* @__PURE__ */ jsxRuntimeExports.jsx(ToastContainer, { toasts, removeToast })
  ] });
};
const useToast = () => {
  const context = reactExports.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
const ToastContainer = ({ toasts, removeToast }) => {
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6 text-green-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) });
      case "error":
        return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6 text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) });
      case "warning":
        return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6 text-yellow-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) });
      case "info":
        return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) });
    }
  };
  const getStyles = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed top-4 right-4 z-50 space-y-3 w-full max-w-sm", children: toasts.map((toast, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `
            ${getStyles(toast.type)}
            border rounded-xl shadow-lg p-4 flex items-start gap-3
            transform transition-all duration-300 ease-out
            animate-in slide-in-from-right fade-in
          `,
      style: {
        animationDelay: `${index * 100}ms`
      },
      role: "alert",
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: getIcon(toast.type) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: toast.message }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => removeToast(toast.id),
            className: "flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors",
            "aria-label": "Cerrar notificación",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
          }
        )
      ]
    },
    toast.id
  )) });
};
const useSuccessToast = () => {
  const { addToast } = useToast();
  return reactExports.useCallback((message, duration) => {
    addToast(message, "success", duration);
  }, [addToast]);
};
const useErrorToast = () => {
  const { addToast } = useToast();
  return reactExports.useCallback((message, duration) => {
    addToast(message, "error", duration);
  }, [addToast]);
};
const useInfoToast = () => {
  const { addToast } = useToast();
  return reactExports.useCallback((message, duration) => {
    addToast(message, "info", duration);
  }, [addToast]);
};

const ConfirmContext = reactExports.createContext(void 0);
const ConfirmProvider = ({ children }) => {
  const [state, setState] = reactExports.useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    confirmVariant: "primary",
    icon: "info",
    resolve: null
  });
  const confirm = reactExports.useCallback((options) => {
    return new Promise((resolve) => {
      setState({
        ...options,
        isOpen: true,
        resolve
      });
    });
  }, []);
  const close = reactExports.useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false
    }));
    setTimeout(() => {
      state.resolve?.(false);
      setState((prev) => ({ ...prev, resolve: null }));
    }, 200);
  }, [state.resolve]);
  const handleConfirm = reactExports.useCallback(() => {
    state.resolve?.(true);
    setState((prev) => ({
      ...prev,
      isOpen: false,
      resolve: null
    }));
  }, [state.resolve]);
  const handleCancel = reactExports.useCallback(() => {
    state.resolve?.(false);
    setState((prev) => ({
      ...prev,
      isOpen: false,
      resolve: null
    }));
  }, [state.resolve]);
  const getIcon = () => {
    switch (state.icon) {
      case "warning":
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6 text-yellow-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) });
      case "delete":
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-red-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) });
    }
  };
  const getConfirmButtonStyles = () => {
    switch (state.confirmVariant) {
      case "danger":
        return "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500";
      case "secondary":
        return "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500";
      default:
        return "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ConfirmContext.Provider, { value: { confirm, close }, children: [
    children,
    state.isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-in fade-in",
          onClick: handleCancel
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-full items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 fade-in",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": "confirm-title",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: getIcon() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h3",
              {
                id: "confirm-title",
                className: "text-xl font-bold text-gray-900 mb-2",
                children: state.title
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 mb-6", children: state.message }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleCancel,
                  className: "flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
                  children: state.cancelText
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleConfirm,
                  className: `flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${getConfirmButtonStyles()}`,
                  autoFocus: true,
                  children: state.confirmText
                }
              )
            ] })
          ] })
        }
      ) })
    ] })
  ] });
};
const useConfirm = () => {
  const context = reactExports.useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context.confirm;
};

class ErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.handleReload = () => {
      window.location.reload();
    };
    this.handleGoHome = () => {
      window.location.href = "/";
    };
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
    this.props.onError?.(error, errorInfo);
    if (window.gtag) {
      window.gtag("event", "exception", {
        description: `${error.name}: ${error.message}`,
        fatal: true
      });
    }
  }
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl", children: "😅" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-3", children: "¡Ups! Algo salió mal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 mb-6", children: "Lo sentimos, ha ocurrido un error inesperado. Nuestro equipo ha sido notificado." }),
        false,
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: this.handleReload,
              className: "w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }),
                "Recargar página"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: this.handleGoHome,
              className: "w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors",
              children: "Volver al inicio"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 pt-6 border-t border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-400", children: [
          "¿Necesitas ayuda? ",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:soporte@redmecanica.cl", className: "text-blue-600 hover:underline", children: "Contacta soporte" })
        ] }) })
      ] }) });
    }
    return this.props.children;
  }
}

const ScrollToTop = () => {
  const { pathname } = useLocation();
  reactExports.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, [pathname]);
  return null;
};

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [isRegistering, setIsRegistering] = reactExports.useState(false);
  const [role, setRole] = reactExports.useState("client");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  if (!isOpen) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const endpoint = isRegistering ? "register" : "login";
      const body = { email, password };
      if (isRegistering) {
        body.name = name;
        body.role = role;
      }
      const { data } = await api$1.post(`/auth/${endpoint}`, body);
      setAuthToken(data.token);
      onLoginSuccess(data.user);
      onClose();
      setEmail("");
      setPassword("");
      setName("");
      setIsRegistering(false);
    } catch (err) {
      const errorMessage = err.response?.data?.error || `Error al ${isRegistering ? "registrar" : "iniciar sesión"}`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[200] p-4 animate-fadeIn", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative border border-slate-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-indigo-700 -z-10 opacity-10 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-100 p-1.5 rounded-2xl flex mb-8 animate-fadeIn", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setRole("client");
                setError("");
              },
              className: `flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${role === "client" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "👤" }),
                "Usuario"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setRole("provider");
                setError("");
              },
              className: `flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${role === "provider" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "🔧" }),
                "Portal Prestadores"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black text-slate-800 tracking-tight", children: isRegistering ? "Crear Cuenta" : "Bienvenido" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 font-medium", children: role === "provider" ? isRegistering ? "Regístrate como Cliente (Taller/Mecánico)" : "Ingresa a tu cuenta de Prestador" : isRegistering ? "Únete como Usuario" : "Ingresa a tu cuenta de Usuario" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: onClose,
              className: "w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all border border-slate-100",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "×" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
          isRegistering && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 animate-fadeIn", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-slate-400 uppercase tracking-widest ml-1", children: "Nombre Completo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors", children: "👤" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  required: isRegistering,
                  value: name,
                  onChange: (e) => setName(e.target.value),
                  className: "w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-700",
                  placeholder: "Juan Pérez"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-slate-400 uppercase tracking-widest ml-1", children: "Correo Electrónico" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors", children: "📧" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "email",
                  required: true,
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  className: "w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-700",
                  placeholder: "ejemplo@correo.com"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-slate-400 uppercase tracking-widest ml-1", children: "Contraseña" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors", children: "🔒" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "password",
                  required: true,
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  className: "w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-700",
                  placeholder: "••••••••"
                }
              )
            ] })
          ] }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-shake", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚠️" }),
            " ",
            error
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: loading,
              className: `w-full text-white py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${isRegistering && role === "provider" ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-200" : "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-200"}`,
              children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : isRegistering ? "Crear Cuenta" : "Iniciar Sesión"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 pt-8 border-t border-slate-50 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-500 text-sm font-medium", children: [
          isRegistering ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setIsRegistering(!isRegistering);
                setError("");
              },
              className: "text-blue-600 font-bold hover:underline mt-2",
              children: isRegistering ? "Inicia sesión aquí" : "Regístrate gratis"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-300 font-bold uppercase tracking-widest italic", children: "Sugerencia: usa admin123 para el seed" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { dangerouslySetInnerHTML: { __html: `
        @keyframes fadeIn { from { opacity: 0; backdrop-filter: blur(0); } to { opacity: 1; backdrop-filter: blur(12px); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      ` } })
  ] });
};

const SkipToContent = () => {
  const handleClick = (e) => {
    e.preventDefault();
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: "smooth" });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "a",
    {
      href: "#main-content",
      onClick: handleClick,
      className: "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 \n                 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 \n                 focus:outline-none focus:ring-2 focus:ring-blue-400",
      children: "Saltar al contenido principal"
    }
  );
};

const Header = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = reactExports.useState(false);
  const handleAccountClick = () => {
    if (user) {
      if (user.role === "MECHANIC" || user.role === "WORKSHOP" || user.role === "TOWING") {
        navigate("/provider-dashboard");
      } else if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } else {
      setIsLoginModalOpen(true);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SkipToContent, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-white shadow-md", role: "banner", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "container mx-auto px-4 py-4 flex justify-between items-center", "aria-label": "Navegación principal", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/",
          className: "flex items-center space-x-2 cursor-pointer",
          "aria-label": "RedMecánica - Inicio",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-8 h-8 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m12 0a2 2 0 100-4m0 4a2 2 0 110-4M6 12a2 2 0 100-4m0 4a2 2 0 110-4m12 0a2 2 0 100-4m0 4a2 2 0 110-4M12 18v-2m0 2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6a2 2 0 100-4m0 4a2 2 0 110-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-gray-800", children: [
              "Red",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-600", children: "Mecánica" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
        user?.role === "ADMIN" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/admin",
            className: "hidden md:inline-block px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors",
            children: "🛡️ Admin"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/about",
            className: "hidden md:inline-block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors",
            children: "Quiénes somos"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/how-it-works",
            className: "hidden md:inline-block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors",
            children: "¿Cómo funciona?"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/pricing",
            className: "hidden md:inline-block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors",
            children: "Planes y precios"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/onboarding",
            className: "hidden lg:inline-block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors",
            children: "Registra tu negocio"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleAccountClick,
              className: `hidden md:inline-block px-4 py-2 text-sm font-medium rounded-lg transition-all ${user ? "text-blue-700 bg-blue-50 border border-blue-100 font-bold" : "text-blue-600 border border-blue-600 hover:bg-blue-50"}`,
              children: user ? `👋 Hola, ${user.name.split(" ")[0]}` : "Mi Cuenta"
            }
          ),
          user && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: logout,
              className: "p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all",
              title: "Cerrar Sesión",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }) })
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      LoginModal,
      {
        isOpen: isLoginModalOpen,
        onClose: () => setIsLoginModalOpen(false),
        onLoginSuccess: (u) => {
          updateUser(u);
          setIsLoginModalOpen(false);
        }
      }
    )
  ] });
};

const Footer = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-gray-900 text-gray-300 mt-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-bold text-lg mb-4", children: "RedMecánica" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 mb-4", children: "La plataforma líder en Chile para conectar conductores con los mejores servicios automotrices. Encuentra mecánicos, talleres y grúas de confianza cerca de ti." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "text-gray-400 hover:text-white transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "text-gray-400 hover:text-white transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "text-gray-400 hover:text-white transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-bold text-lg mb-4", children: "Servicios" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/how-it-works", className: "text-sm hover:text-white transition-colors", children: "¿Cómo funciona?" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/search?type=MECHANIC", className: "text-sm hover:text-white transition-colors", children: "Buscar mecánicos" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/search?type=WORKSHOP", className: "text-sm hover:text-white transition-colors", children: "Talleres certificados" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/search?type=TOWING", className: "text-sm hover:text-white transition-colors", children: "Servicios de grúa" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/search?emergency=true", className: "text-sm hover:text-white transition-colors", children: "Emergencias 24/7" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-bold text-lg mb-4", children: "Para Prestadores" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/onboarding", className: "text-sm hover:text-white transition-colors", children: "Registra tu negocio" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/unete", className: "text-sm hover:text-white transition-colors", children: "Conviértete en prestador" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pricing", className: "text-sm hover:text-white transition-colors", children: "Planes y precios" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/benefits", className: "text-sm hover:text-white transition-colors", children: "Beneficios" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/stories", className: "text-sm hover:text-white transition-colors", children: "Historias de éxito" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/help", className: "text-sm hover:text-white transition-colors", children: "Centro de ayuda" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-bold text-lg mb-4", children: "Legal y Soporte" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/about", className: "text-sm hover:text-white transition-colors", children: "Acerca de nosotros" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/terms", className: "text-sm hover:text-white transition-colors", children: "Términos y condiciones" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacy", className: "text-sm hover:text-white transition-colors", children: "Política de privacidad" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/faq", className: "text-sm hover:text-white transition-colors", children: "Preguntas frecuentes" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "text-sm hover:text-white transition-colors", children: "Contacto" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "mailto:contacto@redmecanica.cl", className: "text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📧" }),
            " contacto@redmecanica.cl"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://wa.me/56983414730", target: "_blank", rel: "noopener noreferrer", className: "text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "💬" }),
            " +56 9 83414730"
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-gray-800 mt-8 pt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col md:flex-row justify-between items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500 mb-4 md:mb-0", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " RedMecánica. Todos los derechos reservados."
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-green-500", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fillRule: "evenodd", d: "M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: "Plataforma verificada y segura" })
    ] }) })
  ] }) });
};

const SEO = ({
  title = "RedMecánica - Mecánicos a Domicilio en Chile",
  description = "Conectamos conductores con mecánicos certificados, talleres y grúas. Servicios automotrices a domicilio en Chile.",
  keywords = "mecánico a domicilio, taller mecánico Chile, servicios automotrices",
  ogImage = "https://redmecanica.cl/og-image.jpg",
  ogUrl,
  canonicalUrl,
  noIndex = false,
  schema
}) => {
  const fullTitle = title.includes("RedMecánica") ? title : `${title} | RedMecánica`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Helmet, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: fullTitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "description", content: description }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "keywords", content: keywords }),
    noIndex ? /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "robots", content: "noindex, nofollow" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "robots", content: "index, follow" }),
    canonicalUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "canonical", href: canonicalUrl }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:type", content: "website" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:title", content: fullTitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:description", content: description }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:image", content: ogImage }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:locale", content: "es_CL" }),
    ogUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:url", content: ogUrl }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "twitter:title", content: fullTitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "twitter:description", content: description }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "twitter:image", content: ogImage }),
    schema && /* @__PURE__ */ jsxRuntimeExports.jsx("script", { type: "application/ld+json", children: JSON.stringify(schema) })
  ] });
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  name: "RedMecánica",
  image: "https://redmecanica.cl/og-image.jpg",
  url: "https://redmecanica.cl",
  telephone: "+56-9-XXXX-XXXX",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressCountry: "CL",
    addressRegion: "RM",
    addressLocality: "Santiago"
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -33.4489,
    longitude: -70.6693
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "20:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "09:00",
      closes: "18:00"
    }
  ],
  areaServed: {
    "@type": "Country",
    name: "Chile"
  }
};
const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "RedMecánica",
  url: "https://redmecanica.cl",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://redmecanica.cl/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

const Hero = () => {
  const navigate = useNavigate();
  const [serviceQuery, setServiceQuery] = reactExports.useState("");
  const [locationQuery, setLocationQuery] = reactExports.useState("");
  const [showServiceSuggestions, setShowServiceSuggestions] = reactExports.useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = reactExports.useState(false);
  const searchContainerRef = reactExports.useRef(null);
  const predefinedServices = [
    { category: "Emergencias", items: [
      "🚨 Emergencia - Servicio de Grúa",
      "🔋 Batería Descargada",
      "🛞 Pinchazo de Neumático",
      "🔥 Sobrecalentamiento del Motor"
    ] },
    { category: "Mantención", items: [
      "🛢️ Cambio de Aceite y Filtros",
      "🔧 Revisión Técnica",
      "⚙️ Afinamiento de Motor",
      "🛞 Rotación y Balanceo de Neumáticos",
      "🔩 Cambio de Pastillas de Freno",
      "💨 Recarga de Aire Acondicionado"
    ] },
    { category: "Reparaciones", items: [
      "🔧 Reparación de Motor",
      "⚙️ Reparación de Transmisión",
      "🔩 Cambio de Embrague",
      "🛡️ Reparación de Suspensión",
      "💡 Sistema Eléctrico",
      "🔊 Escape y Silenciador"
    ] },
    { category: "Diagnóstico", items: [
      "📊 Escaneo de Computadora (OBD2)",
      "🔍 Diagnóstico General",
      "⚠️ Revisión de Luz Check Engine",
      "🔧 Inspección Pre-compra"
    ] },
    { category: "Talleres", items: [
      "🏭 Taller Mecánico General",
      "🔧 Taller de Frenos",
      "🛞 Vulcanización",
      "🎨 Hojalatería y Pintura",
      "💨 Taller de Aire Acondicionado"
    ] }
  ];
  const filteredServices = serviceQuery.length > 0 ? predefinedServices.map((category) => ({
    category: category.category,
    items: category.items.filter(
      (item) => item.toLowerCase().includes(serviceQuery.toLowerCase())
    )
  })).filter((category) => category.items.length > 0) : predefinedServices;
  const comunas = [
    // Región Metropolitana
    "Santiago",
    "Providencia",
    "Las Condes",
    "Ñuñoa",
    "La Florida",
    "Maipú",
    "Puente Alto",
    "Vitacura",
    "Lo Barnechea",
    "Macul",
    "Peñalolén",
    "San Joaquín",
    "La Reina",
    "Quinta Normal",
    "Recoleta",
    "Independencia",
    "Estación Central",
    "Pudahuel",
    "Quilicura",
    "Renca",
    "Cerro Navia",
    "Lo Prado",
    "Cerrillos",
    "Pedro Aguirre Cerda",
    "San Miguel",
    "Lo Espejo",
    "San Ramón",
    "La Cisterna",
    "La Granja",
    "San Bernardo",
    "El Bosque",
    "Padre Hurtado",
    "Peñaflor",
    "Talagante",
    "Melipilla",
    "Colina",
    "Lampa",
    "Quilicura",
    "Paine",
    "Buin",
    // Valparaíso y alrededores
    "Viña del Mar",
    "Valparaíso",
    "Quilpué",
    "Villa Alemana",
    "Concón",
    "San Antonio",
    "Quillota",
    "San Felipe",
    "Los Andes",
    "Limache",
    // Norte
    "Arica",
    "Iquique",
    "Antofagasta",
    "Calama",
    "Copiapó",
    "La Serena",
    "Coquimbo",
    // Centro Sur
    "Rancagua",
    "Talca",
    "Curicó",
    "Chillán",
    "Concepción",
    "Talcahuano",
    "Chiguayante",
    "San Pedro de la Paz",
    "Los Ángeles",
    "Temuco",
    "Valdivia",
    "Osorno",
    "Puerto Montt",
    "Coyhaique",
    "Punta Arenas"
  ];
  const filteredLocations = locationQuery.length > 0 ? comunas.filter((c) => c.toLowerCase().includes(locationQuery.toLowerCase())) : comunas;
  reactExports.useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowServiceSuggestions(false);
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSelectService = (service) => {
    setServiceQuery(service);
    setShowServiceSuggestions(false);
  };
  const handleSelectLocation = (location) => {
    setLocationQuery(location);
    setShowLocationSuggestions(false);
  };
  const handleSearchClick = () => {
    const type = serviceQuery.toLowerCase().includes("grúa") ? "TOWING" : void 0;
    let url = `/search?query=${encodeURIComponent(serviceQuery)}&commune=${encodeURIComponent(locationQuery)}`;
    if (type) url += `&type=${type}`;
    navigate(url);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SEO,
      {
        title: "RedMecánica - Mecánicos a Domicilio en Chile | Servicios Automotrices",
        description: "Conectamos conductores con mecánicos certificados, talleres y grúas. Servicios automotrices a domicilio en Chile. Cotiza gratis y paga seguro con escrow.",
        keywords: "mecánico a domicilio, taller mecánico Chile, servicios automotrices, grúa 24 horas, reparación de autos, diagnóstico vehicular",
        canonicalUrl: "https://redmecanica.cl/",
        schema: [localBusinessSchema, webSiteSchema]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-12 group/hero", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl isolate", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 -z-20 bg-cover bg-center opacity-40 mix-blend-overlay transition-transform duration-700 group-hover/hero:scale-105",
              style: {
                backgroundImage: "url('https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1974&auto=format&fit=crop')"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 -z-10 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-slate-900/95" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[120px] -z-10 animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px] -z-10 animate-pulse-slow" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-20 max-w-4xl mx-auto text-center py-24 px-4 text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-lg", children: [
            "Asistencia Mecánica ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500", children: "Inteligente" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl md:text-2xl mb-12 text-blue-50 font-medium leading-[1.8] drop-shadow-md max-w-2xl mx-auto", children: [
            "Conectamos conductores con los mejores ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold", children: "mecánicos, talleres y grúas" }),
            " de Chile.",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", { className: "hidden md:block" }),
            "Servicio rápido, confiable y con precios transparentes."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: searchContainerRef, className: "relative max-w-4xl mx-auto mb-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-full p-2 flex flex-col md:flex-row items-center shadow-2xl transition-all hover:shadow-blue-900/20 border border-gray-100 divide-y md:divide-y-0 md:divide-x divide-gray-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 w-full px-6 py-3 cursor-text hover:bg-gray-50 rounded-full transition-colors group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5 group-hover:text-blue-600", children: "¿Qué necesitas?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: serviceQuery,
                  onChange: (e) => {
                    setServiceQuery(e.target.value);
                    setShowServiceSuggestions(true);
                  },
                  onFocus: () => setShowServiceSuggestions(true),
                  placeholder: "Ej: Mecánico, Grúa, Batería...",
                  className: "w-full text-gray-800 text-lg font-semibold outline-none bg-transparent placeholder-gray-300"
                }
              ),
              showServiceSuggestions && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-full left-0 mt-4 w-full md:w-[350px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/5 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 border border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[300px] overflow-y-auto", children: filteredServices.map((category, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-gray-50 last:border-b-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-2 bg-gray-50/50 font-bold text-xs text-gray-400 uppercase tracking-wider sticky top-0 backdrop-blur-sm", children: category.category }),
                category.items.map((service, serviceIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => handleSelectService(service),
                    className: "w-full text-left px-5 py-3 hover:bg-blue-50/80 transition-colors text-gray-700 hover:text-blue-900 font-semibold flex items-center group/item text-sm active:bg-blue-100",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-0 group-hover/item:opacity-100 -ml-3 mr-2 text-blue-600 transition-all duration-300", children: "➜" }),
                      service.replace(/^[^\s]+\s/, ""),
                      " "
                    ]
                  },
                  serviceIdx
                ))
              ] }, idx)) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 w-full px-6 py-3 cursor-text hover:bg-gray-50 rounded-full transition-colors group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5 group-hover:text-blue-600", children: "¿Dónde estás?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: locationQuery,
                  onChange: (e) => {
                    setLocationQuery(e.target.value);
                    setShowLocationSuggestions(true);
                  },
                  onFocus: () => setShowLocationSuggestions(true),
                  placeholder: "Comuna o Región",
                  className: "w-full text-gray-800 text-lg font-semibold outline-none bg-transparent placeholder-gray-300"
                }
              ),
              showLocationSuggestions && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-full left-0 mt-4 w-full md:w-[300px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/5 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 border border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[300px] overflow-y-auto p-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider", children: "Sugerencias" }),
                filteredLocations.map((loc, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => handleSelectLocation(loc),
                    className: "w-full text-left px-4 py-3 hover:bg-blue-50/80 rounded-xl transition-colors text-gray-700 hover:text-blue-900 font-semibold flex items-center gap-3 active:bg-blue-100",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400 w-5 h-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" })
                      ] }) }),
                      loc
                    ]
                  },
                  idx
                ))
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 w-full md:w-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: handleSearchClick,
                className: "w-full md:w-auto bg-blue-600 text-white p-4 md:px-8 md:py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/30 flex items-center justify-center gap-2 group active:scale-95",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2, stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" }) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "md:hidden", children: "Buscar" })
                ]
              }
            ) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => navigate("/triage"),
                className: "group bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 px-8 py-3 rounded-full text-lg font-bold hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg hover:shadow-yellow-400/30 flex items-center hover:-translate-y-0.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2 text-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2, stroke: "currentColor", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 18v-1.947a2.42 2.42 0 0 1 .783-1.786l2.71-2.684a2.25 2.25 0 0 0 0-3.136l-2.713-2.686A2.42 2.42 0 0 1 12 3.864V2M12 2v1.947a2.42 2.42 0 0 0-.783 1.786l-2.71 2.684a2.25 2.25 0 0 1 0 3.136l2.713 2.686A2.42 2.42 0 0 0 12 16.053V18" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 21h6" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 4.5h3" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "¿No sabes qué tiene tu auto? ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "underline decoration-blue-900/30 underline-offset-2", children: "Auto-Diagnóstico" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300", children: "➜" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => navigate("/how-it-works"),
                className: "text-blue-200 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 hover:underline underline-offset-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
                  "Entiende cómo funciona RedMecánica"
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-16 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto", children: [
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-10 h-10", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" }) }),
          title: "Mecánicos Certificados",
          desc: "Profesionales verificados a tu ubicación"
        },
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-10 h-10", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" }) }),
          title: "Respuesta Rápida",
          desc: "Atención en menos de 15 minutos"
        },
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-10 h-10", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" }) }),
          title: "Precios Justos",
          desc: "Sin sorpresas, cotización previa"
        },
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-10 h-10", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" }) }),
          title: "100% Seguro",
          desc: "Prestadores con seguro y garantía"
        }
      ].map((f, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => navigate("/search"),
          className: "text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1 block w-full group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-blue-600 mb-4 flex justify-center group-hover:scale-110 transition-transform", children: f.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg mb-2 text-gray-800", children: f.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 text-sm", children: f.desc })
          ]
        },
        idx
      )) })
    ] })
  ] });
};

const Card = ({ children, className = "", ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `bg-white rounded-xl shadow-lg overflow-hidden ${className}`, ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 md:p-8", children }) });
};

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "María González",
      role: "Conductora",
      content: "Excelente servicio. El mecánico llegó en 15 minutos y solucionó mi problema de batería al instante. 100% recomendado.",
      rating: 5,
      avatar: "👩"
    },
    {
      id: 2,
      name: "Carlos Pérez",
      role: "Conductor de Uber",
      content: "Como conductor, necesito soluciones rápidas. RedMecánica me ha salvado varias veces. ¡Servicio de primera!",
      rating: 5,
      avatar: "👨"
    },
    {
      id: 3,
      name: "Andrea Silva",
      role: "Dueña de flota",
      content: "Manejo una flota de 10 vehículos. Con RedMecánica encontré talleres certificados y precios justos. Muy profesional.",
      rating: 5,
      avatar: "👩‍💼"
    }
  ];
  const renderStars = (rating) => {
    return Array(rating).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-yellow-500", children: "★" }, i));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold text-gray-800 mb-3", children: "Lo que dicen nuestros usuarios" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", children: "Miles de conductores confían en RedMecánica cada día" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: testimonials.map((testimonial) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 hover:shadow-lg transition-shadow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mr-3", children: testimonial.avatar }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-800", children: testimonial.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: testimonial.role })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 text-lg", children: renderStars(testimonial.rating) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-600 italic", children: [
        '"',
        testimonial.content,
        '"'
      ] })
    ] }, testimonial.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center space-x-8 text-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-blue-600", children: "15,000+" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Servicios Realizados" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-px bg-gray-300" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-blue-600", children: "4.8/5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Calificación Promedio" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-px bg-gray-300" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-blue-600", children: "98%" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Clientes Satisfechos" })
      ] })
    ] }) })
  ] }) });
};

const LoadingSpinner = ({
  fullScreen = false,
  size = "medium",
  text = "Cargando..."
}) => {
  const sizeClasses = {
    small: "w-6 h-6 border-2",
    medium: "w-10 h-10 border-3",
    large: "w-16 h-16 border-4"
  };
  const spinner = /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${sizeClasses[size]} border-blue-200 border-t-blue-600 rounded-full animate-spin` });
  if (fullScreen) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[50vh] flex flex-col items-center justify-center", children: [
      spinner,
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-gray-500 font-medium", children: text })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-8", children: [
    spinner,
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-gray-500 text-sm", children: text })
  ] });
};

const resolveApiUrl = () => {
  const envApiUrl = "https://backend-production-f294e.up.railway.app/api".trim();
  if (envApiUrl) {
    return envApiUrl;
  }
  return "/api";
};
const API_URL = resolveApiUrl().replace(/\/$/, "");
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
const getServices = async () => {
  const response = await api.get("/services");
  return response.data;
};
const registerProvider = async (providerData) => {
  const response = await api.post("/providers", providerData);
  return response.data;
};
const getProviders = async (params = {}) => {
  const response = await api.get("/providers/search", { params });
  return response.data;
};
const createJob = async (jobData) => {
  const response = await api.post("/jobs", jobData);
  return response.data;
};
const createQuote = async (quoteData) => {
  const response = await api.post("/quotes", quoteData);
  return response.data;
};
const createPayment = async (paymentData) => {
  const response = await api.post("/payments/create", paymentData);
  return response.data;
};
const getPaymentMethods = async () => {
  const response = await api.get("/payments/methods");
  return response.data.methods || response.data;
};
const searchNearbyProviders = async (params) => {
  const response = await api.get("/geo/search", { params });
  return response.data;
};
const geocodeAddress = async (address) => {
  const response = await api.get("/maps/geocode", { params: { address } });
  return response.data;
};
const sendContactMessage = async (data) => {
  const response = await api.post("/contact/message", data);
  return response.data;
};
const registerLaunchLead = async (email) => {
  const response = await api.post("/contact/launch-lead", { email });
  return response.data;
};

const LaunchBanner = () => {
  const [isVisible, setIsVisible] = reactExports.useState(true);
  const [email, setEmail] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [isRegistered, setIsRegistered] = reactExports.useState(false);
  const [registeredEmail, setRegisteredEmail] = reactExports.useState("");
  const [targetDate, setTargetDate] = reactExports.useState(null);
  const showSuccess = useSuccessToast();
  const showError = useErrorToast();
  const LEAD_STORAGE_KEY = "launch_lead_registered_email";
  const CAMPAIGN_START_DATE = new Date(2026, 2, 7, 0, 0, 0, 0);
  const CAMPAIGN_DURATION_DAYS = 3;
  const [timeLeft, setTimeLeft] = reactExports.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  reactExports.useEffect(() => {
    const campaignEndsAt = CAMPAIGN_START_DATE.getTime() + CAMPAIGN_DURATION_DAYS * 24 * 60 * 60 * 1e3;
    setTargetDate(campaignEndsAt);
  }, []);
  reactExports.useEffect(() => {
    if (!targetDate) return;
    const timer = setInterval(() => {
      const now = (/* @__PURE__ */ new Date()).getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        setIsVisible(false);
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1e3 * 60 * 60 * 24)),
        hours: Math.floor(distance % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60)),
        minutes: Math.floor(distance % (1e3 * 60 * 60) / (1e3 * 60)),
        seconds: Math.floor(distance % (1e3 * 60) / 1e3)
      });
    }, 1e3);
    return () => clearInterval(timer);
  }, [targetDate]);
  reactExports.useEffect(() => {
    const storedEmail = localStorage.getItem(LEAD_STORAGE_KEY);
    if (storedEmail) {
      setIsRegistered(true);
      setRegisteredEmail(storedEmail);
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const result = await registerLaunchLead(email);
      showSuccess(result.message || "¡Excelente! Te avisaremos apenas estemos operativos. ¡Bienvenido a la comunidad!");
      localStorage.setItem(LEAD_STORAGE_KEY, email);
      setRegisteredEmail(email);
      setIsRegistered(true);
      setEmail("");
    } catch (err) {
      console.error("Error al registrar lead:", err);
      if (err.message && err.message.includes("Network Error")) {
        showError("No se pudo conectar con el servidor. ¿El backend está levantado o tu configuración de VITE_API_URL es correcta?");
      } else {
        const serverMsg = err?.response?.data?.error;
        showError(serverMsg || "Hubo un problema al registrar tu correo. Por favor intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };
  if (!isVisible) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-6 left-6 right-6 z-[100] animate-in slide-in-from-bottom-10 duration-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white text-center md:w-1/3 flex flex-col justify-center min-h-[180px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-80", children: "Oferta válida en" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-black", children: timeLeft.days }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-bold opacity-60", children: "Días" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-light opacity-30 mt-[-4px]", children: ":" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-black", children: timeLeft.hours.toString().padStart(2, "0") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-bold opacity-60", children: "Hrs" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-light opacity-30 mt-[-4px]", children: ":" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-black", children: timeLeft.minutes.toString().padStart(2, "0") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-bold opacity-60", children: "Min" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-light opacity-30 mt-[-4px]", children: ":" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-black", children: timeLeft.seconds.toString().padStart(2, "0") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-bold opacity-60", children: "Seg" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 flex-1 relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setIsVisible(false),
          className: "absolute top-4 right-4 text-slate-500 hover:text-white transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white mb-2 leading-tight", children: "¡Últimos 3 días! 🇨🇱" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-400 text-sm leading-relaxed", children: [
          "¡No te quedes fuera!",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-400 font-bold ml-1", children: "Regístrate ahora" }),
          " y obtén un ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold", children: "40% de descuento" }),
          " en tu primer servicio garantizado."
        ] })
      ] }),
      isRegistered ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-emerald-300 font-bold", children: "Listo, ya quedaste registrado." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-emerald-100/80 text-sm mt-1", children: [
          "Te contactaremos a ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: registeredEmail }),
          " cuando lancemos."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              localStorage.removeItem(LEAD_STORAGE_KEY);
              setRegisteredEmail("");
              setIsRegistered(false);
            },
            className: "mt-3 text-xs font-semibold text-emerald-200 hover:text-white underline underline-offset-4",
            children: "Cambiar correo"
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "email",
            placeholder: "Ingresa tu correo aquí...",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true,
            className: "flex-1 bg-slate-800/50 border border-slate-700 text-white px-5 py-3 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600 font-medium"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-lg shadow-blue-900/40 active:scale-95 disabled:opacity-50 whitespace-nowrap",
            children: loading ? "Procesando..." : "¡Quiero mi descuento!"
          }
        )
      ] })
    ] })
  ] }) }) });
};

const ProviderDashboard = React.lazy(() => __vitePreload(() => import('./ProviderDashboard-CFIgqfN6.js'),true              ?__vite__mapDeps([0,1,2]):void 0));
const AccountHub = React.lazy(() => __vitePreload(() => import('./AccountHub-BwuZG709.js'),true              ?__vite__mapDeps([3,1,2]):void 0));
const ProviderOnboarding = React.lazy(() => __vitePreload(() => import('./ProviderOnboarding-BfxL9iHa.js'),true              ?__vite__mapDeps([4,1,5,2]):void 0));
const ProviderSearch = React.lazy(() => __vitePreload(() => import('./ProviderSearch-CTbKHOIP.js'),true              ?__vite__mapDeps([6,1,5,2]):void 0));
const TriageChatbot = React.lazy(() => __vitePreload(() => import('./TriageChatbot-L-DQzbTI.js'),true              ?__vite__mapDeps([7,1,2]):void 0));
const HowItWorksModal = React.lazy(() => __vitePreload(() => import('./HowItWorksModal-Cj3222HZ.js'),true              ?__vite__mapDeps([8,1,2]):void 0));
const AboutUs = React.lazy(() => __vitePreload(() => import('./AboutUs-B8hPY-4Q.js'),true              ?__vite__mapDeps([9,10,1,11,12,13,2]):void 0));
const Contact = React.lazy(() => __vitePreload(() => import('./Contact-9ma6Lrp9.js'),true              ?__vite__mapDeps([14,1,2]):void 0));
const FAQ = React.lazy(() => __vitePreload(() => import('./FAQ-Cv8osgK8.js'),true              ?__vite__mapDeps([15,1,2]):void 0));
const HelpCenter = React.lazy(() => __vitePreload(() => import('./HelpCenter-Clqxzb_t.js'),true              ?__vite__mapDeps([16,1,2]):void 0));
const PricingPlans = React.lazy(() => __vitePreload(() => import('./PricingPlans-DfXhNMU4.js'),true              ?__vite__mapDeps([17,1,11,10,18,13,2]):void 0));
const PrivacyPolicy = React.lazy(() => __vitePreload(() => import('./PrivacyPolicy-CbEC1jt7.js'),true              ?__vite__mapDeps([19,1,2]):void 0));
const ProviderBenefits = React.lazy(() => __vitePreload(() => import('./ProviderBenefits-ND6GZecd.js'),true              ?__vite__mapDeps([20,1,2]):void 0));
const ProviderLanding = React.lazy(() => __vitePreload(() => import('./ProviderLanding-CxpZkSTz.js'),true              ?__vite__mapDeps([21,1,2]):void 0));
const ServiceRequestFlow = React.lazy(() => __vitePreload(() => import('./ServiceRequestFlow-ugBxhrUO.js'),true              ?__vite__mapDeps([22,1,2]):void 0));
const SuccessStories = React.lazy(() => __vitePreload(() => import('./SuccessStories-DSo7_l9S.js'),true              ?__vite__mapDeps([23,1,2]):void 0));
const Terms = React.lazy(() => __vitePreload(() => import('./Terms-BfP7PXyX.js'),true              ?__vite__mapDeps([24,1,2]):void 0));
const NotFoundPage = React.lazy(() => __vitePreload(() => import('./NotFoundPage-CDPiHffD.js'),true              ?__vite__mapDeps([25,1,2]):void 0));
const AdminLayout = React.lazy(() => __vitePreload(() => import('./AdminLayout-Daw3ikOd.js'),true              ?__vite__mapDeps([26,1,2,18,10,27,13,28,29,30,31]):void 0));
const AdminDashboardPage = React.lazy(() => __vitePreload(() => import('./AdminDashboard-D2d-zACm.js'),true              ?__vite__mapDeps([32,1,33,10,34,27,35,36,37,30,38,2,39,40]):void 0));
const UserManagement = React.lazy(() => __vitePreload(() => import('./UserManagement-PCafZPrL.js'),true              ?__vite__mapDeps([41,1,42,10,34,31,38,43,30,36,44,2]):void 0));
const ProviderReview = React.lazy(() => __vitePreload(() => import('./ProviderReview-CPseoMVb.js'),true              ?__vite__mapDeps([45,1,42,10,38,31,44,30,43,18,46,37,2]):void 0));
const AuditLogs = React.lazy(() => __vitePreload(() => import('./AuditLogs-CIoST0W9.js'),true              ?__vite__mapDeps([47,1,42,10,31,38,33,43,30,28,48,40,2]):void 0));
const Monitoring = React.lazy(() => __vitePreload(() => import('./Monitoring-ZcB2NIyy.js'),true              ?__vite__mapDeps([49,1,42,10,48,12,2,29,30]):void 0));
const Jobs = React.lazy(() => __vitePreload(() => import('./Jobs-DtsN6IDb.js'),true              ?__vite__mapDeps([50,1,42,10,31,38,43,30,13,40,18,39,36,29,46,37,2]):void 0));
const SubscriptionsAdmin = React.lazy(() => __vitePreload(() => import('./Subscriptions-RUO6v8Aj.js'),true              ?__vite__mapDeps([51,1,42,10,30,37,35,33,46,2]):void 0));
const HowItWorksPage = () => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(HowItWorksModal, { onClose: () => navigate("/") }) });
};
const LazyRoute = ({ children }) => /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { fullScreen: true }), children });
const MainLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { id: "main-content", className: "flex-1 container mx-auto px-4 py-8", tabIndex: -1, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Testimonials, {})
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/onboarding", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LazyRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderOnboarding, { onComplete: () => navigate("/provider-dashboard"), onCancel: () => navigate("/") }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/search", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LazyRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderSearch, {}) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/triage", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LazyRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriageChatbot, {}) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/how-it-works", element: /* @__PURE__ */ jsxRuntimeExports.jsx(HowItWorksPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/about", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LazyRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AboutUs, { onClose: () => navigate("/"), onNavigateToOnboarding: () => navigate("/onboarding") }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/contact", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LazyRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Contact, { onClose: () => navigate("/") }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/faq", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LazyRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(FAQ, { onClose: () => navigate("/") }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/help", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LazyRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HelpCenter, { onClose: () => navigate("/") }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/pricing", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LazyRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PricingPlans, { onClose: () => navigate("/"), onNavigateToOnboarding: () => navigate("/onboarding") }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/privacy", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LazyRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PrivacyPolicy, { onClose: () => navigate("/") }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/benefits", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LazyRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderBenefits, { onClose: () => navigate("/"), onNavigateToPricing: () => navigate("/pricing"), onNavigateToOnboarding: () => navigate("/onboarding") }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/unete", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LazyRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderLanding, {}) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/solicitar", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LazyRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ServiceRequestFlow, {}) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/servicio", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LazyRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ServiceRequestFlow, {}) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/stories", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LazyRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SuccessStories, { onClose: () => navigate("/") }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/terms", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LazyRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Terms, { onClose: () => navigate("/") }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LazyRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(NotFoundPage, {}) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/profile", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LazyRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccountHub, { currentUser: user, onClose: () => navigate("/") }) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireRole, { roles: ["MECHANIC", "WORKSHOP", "TOWING"] }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/provider-dashboard", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LazyRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderDashboard, { onClose: () => navigate("/") }) }) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LaunchBanner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
};
const App = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ToastProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BrowserRouter, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollToTop, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnalyticsProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/admin", element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireRole, { roles: ["ADMIN", "SUPER_ADMIN"] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Route, { element: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { fullScreen: true }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, {}) }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { index: true, element: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminDashboardPage, {}) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "users", element: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserManagement, {}) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "providers", element: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderReview, {}) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "jobs", element: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Jobs, {}) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "audit", element: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuditLogs, {}) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "monitoring", element: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Monitoring, {}) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "subscriptions", element: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SubscriptionsAdmin, {}) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "stats", element: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminDashboardPage, {}) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(MainLayout, {}) })
    ] }) })
  ] }) }) }) }) });
};

function registerSW() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        console.log("[SW] Service Worker registered:", registration.scope);
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                console.log("[SW] New content available, please refresh.");
                showUpdateNotification();
              }
            });
          }
        });
      }).catch((error) => {
        console.error("[SW] Service Worker registration failed:", error);
      });
    });
  }
}
function showUpdateNotification() {
  const updateEvent = new CustomEvent("sw-update-available");
  window.dispatchEvent(updateEvent);
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);
root.render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HelmetProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }) })
);
registerSW();

export { Card as C, SEO as S, api$1 as a, getServices as b, sendContactMessage as c, useErrorToast as d, useInfoToast as e, useConfirm as f, geocodeAddress as g, getPaymentMethods as h, createJob as i, jsxRuntimeExports as j, createPayment as k, getProviders as l, createQuote as m, useAuth as n, registerProvider as r, searchNearbyProviders as s, useSuccessToast as u };
