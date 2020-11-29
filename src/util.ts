import isObject from 'https://unpkg.com/lodash-es@4.17.15/isObject.js';

export type ENV_OBJECT = {
  [key: string]: string;
};

export type SETTINGS = {
  [key: string]: any;
};

/** 展开嵌套的对象为单层对象 */
export function flattenMap(data: SETTINGS, parents: string[] = []) {
  const result: SETTINGS = {};

  Object.keys(data).forEach((key) => {
    if (isObject(data[key]) && !Array.isArray(data[key])) {
      Object.assign(result, flattenMap(data[key], parents.concat([key])));
    } else {
      result[[...parents, key].join('.')] = data[key];
    }
  });

  return result;
}
