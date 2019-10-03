const walker = require("./walker");
const Word = require("./parse-tree").Word;
const context = require("./context");

// TODO remove the dependency graph. Iterator takes care of it now.

const Indices = {
  Optionality: 0,
  TypeTest: 1,
  ValueTest: 2
};

function getRecursiveObjectValueStub() {
  return [Word.Fn, Word.Identity];
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

function transformer(pt /* parse tree */) {
  const ast = {};
  const depGraph = {}; // Dependency graph of recursive objects

  // Walking through the node happens in Depth First Order. The closure is created with this
  // assumption only. No explicit check is done which goes outside the assumption set.

  let structure = {
    type: null,
    id: null
  };

  let structureBody = null;
  let pairConfig = null;
  let depGraphForItem = null;
  let isOptional = null;

  walker(pt, {
    [Word.StructureDefinition]: {
      exit: () => {
        structure.type = null;
        structure.id = null;
        depGraphForItem = null;
      }
    },

    [Word.StructureIdentifier]: {
      enter: node => {
        let id;
        structure.type = node.properties.type;
        id = structure.id = node.properties.id;

        depGraphForItem = depGraph[id] = {
          card: 0, // cardinality
          noCard: 0, // non optional cardinality
          oDeps: [], // optional dependencies
          noDeps: [] // Non optional dependencies
        };
      }
    },

    [Word.StructureBody]: {
      enter: node => {
        ast[structure.id] = structureBody = {};
      },

      exit: () => {
        structureBody = null;
      }
    },

    [Word.PairDefinition]: {
      enter: node => {
        isOptional = node.properties.isOptional;
        pairConfig = {
          preProcessor: ["optionality", isOptional]
        };
        depGraphForItem.card++;
        !isOptional && depGraphForItem.noCard++;
      },
      exit: () => {
        structureBody[pairConfig.keyId] = pairConfig;
        pairConfig = null;
        isOptional = null;
      }
    },

    [Word.PairComponentKey]: {
      enter: node => {
        pairConfig.typeProcessor = [
          node.properties.type,
          node.properties.typeArgs
        ];
        pairConfig.keyId = node.properties.id;
        const typeArgs = node.properties.typeArgs || null;
        // If it's a reference
        if (node.properties.type === Word.Ref) {
          depGraphForItem[isOptional ? "oDeps" : "noDeps"].push(
            node.properties.typeArgs
          );
        }
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

          depGraphForItem[isOptional ? "oDeps" : "noDeps"].push(id);
        } else {
          let ns;
          let fn;
          let expectation;
          switch (node.properties.type) {
            case Word.Fn:
              ns = context.NS.System;
              fn = node.properties.value;
              expectation = true;
              break;
            case Word.Abs:
              ns = context.NS.System;
              fn = "isEqual";
              expectation = node.properties.value;
              break;
            case Word.UFn:
              ns = context.NS.User;
              fn = node.properties.value;
              expectation = true;
          }
          pairConfig.valueResolver = [
            node.properties.type,
            node.properties.value
          ];
        }
      }
    }
  });

  return { ast, depGraph };
}

module.exports = transformer;
