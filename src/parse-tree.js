const Word = {
  Program: "Program",
  StructureDefinition: "StructureDefinition",
  StructureIdentifier: "StructureIdentifier",
  StructureBody: "StructureBody",
  PairDefinition: "PairDefinition",
  PairComponentKey: "PairComponentKey",
  PairComponentValue: "PairComponentValue",

  Transformer: {
    Str: {
      Pattern: "str-pattern"
    }
  },

  Str: "Str",
  StrChkFn: "isStr",
  Num: "Num",
  NumChkFn: "isNum",
  Bool: "Bool",
  BoolChkFn: "isBool",
  Ref: "Ref",
  RefChkFn: "isRef",
  Obj: "Obj",
  ObjChkFn: "isObj",
  Arr: "Arr",
  ArrChkFn: "isArr",
  Any: "Any",
  Fn: "Fn",
  UFn: "UFn",
  AbEq: "abEq" /* Absolute values equal */,
  ArrAbEq: "arrAbEq" /* Array absolute equality */,
  Rec: "Rec" /* Recursive */,
  Identity: "pass",
  Fail: "fail",
  TypeDef: "typedef",
  OList: "olist",
  Enum: "enum",
  EnumLookup: "enumLookup",
  EnumIterables: "enum-itrbls"
};

function sanitize(properties, children) {
  properties = properties || {};
  children = children || [];

  return { properties, children };
}

/*
 * =======================================================
 * Parse Tree exported to Lexical Parser
 * =======================================================
 */

function makeEntry(TokenType, properties, children) {
  if (!(TokenType in Word)) {
    return Error(`Unknown token type: ${TokenType}`);
  }

  ({ properties, children } = sanitize(properties, children));

  return {
    nodeType: TokenType,
    properties,
    children
  };
}

const parseTree = {};
parseTree.makeEntry = makeEntry;
parseTree.Word = Word;

module.exports = parseTree;

