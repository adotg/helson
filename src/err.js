const premadeObjs = {
  invalidTypedefId: new Error("Not a valid typedef identifier")
};

module.exports = {
  ValueOutSideRange: { msg: () => "Value outside range" },
  KeyInSchemaNotInObj: {
    msg: () => "Non optional Key present in schema but not in input object"
  },
  KeyInObjNotInSchema: {
    msg: () => "Key present in input object but not in schema"
  },
  TypeMismatch: {
    msg: (expected, received) =>
      `Value of type ${expected} expected; received ${received}`
  },
  ValueMismatch: {
    msg: (expected, received) =>
      `Values not equal; expected: ${expected}, received: ${received}`
  },
  ValueNotPresent: {
    msg: (val, enumName) => `Value ${val} is not present in enum ${enumName}`
  },
  ArrayMembersDifferent: {
    msg: (expected, received) =>
      `Different array length in comparison; expected length: ${expected}, received length: ${received}`
  },
  ArrayDimensionMismatch: {
    msg: () => `Array of dimension mismatch`
  },
  InvalidTypedefId: {
    errInst: () => premadeObjs.invalidTypedefId
  }
};
