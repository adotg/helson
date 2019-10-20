const walker = require("./walker");
const Word = require("./parse-tree").Word;
const context = require("./context");
const { postTransformationMutator } = require("./verifier");

const Indices = {
  Optionality: 0,
  TypeTest: 1,
  ValueTest: 2
};

function getRecursiveObjectValueStub() {
  return [Word.Fn, Word.Identity, null, { ns: context.NS.System }];
}

function getRecursiveObjectMountStub(id, recObject) {
  return {
    nodeType: Word.StructureDefinition,
    properties: {},
    children: [
      {
        nodeType: Word.StructureIdentifier,
        properties: {
          type: Word.TypeDef,
          id
        },
        children: []
      },
      recObject
    ]
  };
}

function container(seed) {
  const resp = {};

  resp.push = (key, value) => {
    if (seed instanceof Array) {
      seed.push(value);
    } else {
      seed[key] = value;
    }
  };

  resp.serialize = () => seed;

  return resp;
}

function transformer(pt /* parse tree */) {
  const ast = {
    [Word.Enum]: {},
    [Word.TypeDef]: {},
    [Word.OList]: {}
  };

  // Walking through the node happens in Depth First Order. The closure is created with this
  // assumption. No explicit check is done which goes outside the assumption set.

  let structure = {
    type: null,
    id: null,
    typeArgs: null,
    subType: null
  };

  let structureBody = null;
  let pairConfig = null;
  let isOptional = null;
  let astMount = null;

  walker(
    pt,
    {
      [Word.StructureDefinition]: {
        exit: () => {
          structure.type = null;
          structure.id = null;
          structure.typeArgs = null;
          structure.subType = null;
          astMount = null;
        }
      },

      [Word.StructureIdentifier]: {
        enter: node => {
          structure.type = node.properties.type;
          structure.id = node.properties.id;
          structure.typeArgs =
            node.properties.typeArgs === undefined
              ? null
              : node.properties.typeArgs;
          structure.subType =
            node.properties.subType === undefined
              ? null
              : node.properties.subType;
          astMount = ast[structure.type];
        }
      },

      [Word.StructureBody]: {
        enter: () => {
          structureBody = container(structure.type === Word.OList ? [] : {});
        },

        exit: () => {
          astMount[structure.id] = structureBody.serialize();
          structureBody = null;
        }
      },

      [Word.PairDefinition]: {
        enter: node => {
          isOptional = node.properties.isOptional;
          if (structure.type === Word.Enum) {
            pairConfig = {};
          } else {
            pairConfig = {
              preProcessor: ["optionality", isOptional]
            };
          }
        },
        exit: () => {
          structureBody.push(pairConfig.keyId, pairConfig);
          pairConfig = null;
          isOptional = null;
        }
      },

      [Word.PairComponentKey]: {
        enter: node => {
          if (structure.type === Word.Enum) {
            pairConfig.typeProcessor = [
              structure.type,
              structure.typeArgs,
              structure.subType === undefined ? null : structure.subType
            ];
          } else {
            pairConfig.typeProcessor = [
              node.properties.type,
              node.properties.typeArgs === undefined
                ? null
                : node.properties.typeArgs,
              node.properties.subType === undefined
                ? null
                : node.properties.subType
            ];
            // For multidimensional array do
            // Arr of Arr of Arr of ... Str
            let dim;
            if (
              node.properties.type === Word.Arr &&
              (dim = node.properties.dim) > 1
            ) {
              while (dim-- - 1) {
                pairConfig.typeProcessor.unshift(Word.Arr);
              }
            }
          }
          pairConfig.keyId = node.properties.id;
        }
      },

      [Word.PairComponentValue]: {
        enter: (node, _, root) => {
          if (node.properties.type === Word.Rec) {
            let id = `@${root.children.length}`;
            // For a recursive object entry append the object right below the root and set a reference with the current
            // node
            pairConfig.typeProcessor = [Word.Ref, id];
            pairConfig.valueResolver = getRecursiveObjectValueStub();
            // Attach the recursive object to root
            root.children.push(
              getRecursiveObjectMountStub(id, node.properties.value)
            );
          } else {
            switch (node.properties.type) {
              case Word.Fn:
                ns = context.NS.System;
                fn = node.properties.value;
                expectation = true;
                break;
              case Word.UFn:
                ns = context.NS.User;
                fn = node.properties.value;
                expectation = true;
            }
            pairConfig.valueResolver = [
              node.properties.type,
              node.properties.value,
              node.properties.args === undefined ? null : node.properties.args,
              { ns }
            ];
          }
        }
      }
    },
    { walkComplete: postTransformationMutator(ast, context) }
  );

  return ast;
}

module.exports = transformer;
