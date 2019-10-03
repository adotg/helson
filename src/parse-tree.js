const Word = {
  Program: "Program",
  StructureDefinition: "StructureDefinition",
  StructureIdentifier: "StructureIdentifier",
  StructureBody: "StructureBody",
  PairDefinition: "PairDefinition",
  PairComponentKey: "PairComponentKey",
  PairComponentValue: "PairComponentValue",

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
  Fn: "Fn",
  UFn: "UFn",
  Abs: "Abs" /* Absolute values */,
  Rec: "Rec" /* Recursive */,
  Identity: "identity",
  TypeDef: "typdef"
};

const Enum = {
  StructureType: {
    TypeDef: "Typedef",
    Enum: "Enum"
  }
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
parseTree.Enum = Enum;

module.exports = parseTree;

