module.exports = {
  ValueOutSideRange: { msg: () => "Value outside range" },
  KeyInSchemaNotInObj: {
    msg: () => "Non optional Key present in schema but not in input object"
  },
  KeyInObjNotInSchema: {
    msg: () => "Key present in input object but not in schema"
  },
  ValueMismatch: {
    msg: (expected, received) =>
      `Value of type ${expected} expected; received ${received}`
  },
  ValueMismatch: {
    msg: (expected, received) =>
      `Values not equal; expected: ${expected}, received: ${received}`
  }
};
