import React from 'react';

export function isEmpty(value) {
  return (
    value === null ||
    value === undefined ||
    String(value).trim() === '' ||
    (Object.keys(value).length === 0 && value.constructor === Object)
  );
}

export const getPosition = (containerRef, ref, clb) => {
  let result = {top: 0, left: 0, width: 0, height: 0};
  if (ref.current && containerRef.current) {
    ref.current.measureLayout(
      containerRef.current,
      (left, top, width, height) => {
        result = {left, top, width, height};
        clb(result);
      },
    );
  } else {
    throw Error('please check your "containerRef" and "ref"');
  }
};

export const getFiersError = (fieldList = [], errInner = []) => {
  let firstErrAt = null;
  for (let field of fieldList) {
    const isError = errInner.findIndex((e: any) => e.path === field) > -1;
    if (isError) {
      firstErrAt = field;
      break;
    }
  }
  return firstErrAt;
};

export const createFormRefs = (initialValue = {}) => {
  let refs = {};
  const fieldList = Object.keys(initialValue);
  for (let index = 0; index < fieldList.length; index += 1) {
    const name = fieldList[index];
    refs[name] = React.createRef();
  }
  return refs;
};

export function isRequired(schema: any, field: string) {
  return schema.fields[field]?.exclusiveTests?.required || false;
}

export function getRequiredFields(schema: any, fields: string[]): string[] {
  if (isEmpty(schema)) {
    return [];
  }
  const requiredFields = fields.filter(
    field => isRequired(schema, field) === true,
  );
  return requiredFields;
}

export function toObject(arr = []) {
  var obj = arr.reduce(function (acc, cur, i) {
    acc[i] = cur;
    return acc;
  }, {});
  return obj;
}

export function checkHaveValidation(validationSchema: any) {
  return (
    typeof validationSchema?.isValidSync === 'function' &&
    typeof validationSchema?.validate === 'function' &&
    typeof validationSchema?.validateAt === 'function'
  );
}
