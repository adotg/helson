const expect = require("chai").expect;
const parser = require("../src/helson").parser; // temporary location before the build
const { Word } = require("../src/parse-tree"); // temporary location before the build

describe("L=1 Object", () => {
  describe("Primitive Type", () => {
    it(`should construct parse tree for a schema with keys=2;
      Checks [typdef, str with pass, optnl, num with rangeFn]`, () => {
      const schema = `
        typdef Person {
          str "name": pass,
          optnl num "age": [, 100]
        }
      `;
      const pt = parser.parse(schema); // parse tree
      expect(pt).to.deep.equal({
        nodeType: Word.Program,
        properties: {},
        children: [
          {
            nodeType: Word.StructureDefinition,
            properties: {},
            children: [
              {
                nodeType: Word.StructureIdentifier,
                properties: {
                  type: Word.TypeDef,
                  id: "Person"
                },
                children: []
              },
              {
                nodeType: Word.StructureBody,
                properties: {},
                children: [
                  {
                    nodeType: Word.PairDefinition,
                    properties: {
                      isOptional: false
                    },
                    children: [
                      {
                        nodeType: Word.PairComponentKey,
                        properties: {
                          type: Word.Str,
                          id: "name"
                        },
                        children: []
                      },
                      {
                        nodeType: Word.PairComponentValue,
                        properties: {
                          type: Word.Fn,
                          value: Word.Identity
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    nodeType: Word.PairDefinition,
                    properties: {
                      isOptional: true
                    },
                    children: [
                      {
                        nodeType: Word.PairComponentKey,
                        properties: {
                          type: Word.Num,
                          id: "age"
                        },
                        children: []
                      },
                      {
                        nodeType: Word.PairComponentValue,
                        properties: {
                          type: Word.Fn,
                          value: "lcrcRange,null,100"
                        },
                        children: []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      });
    });

    it(`should construct parse tree of a simple object with different types of keys;
      Checks [str with fail, str with regexp, num with decimal, bool]`, () => {
      const schema = `
        typdef Alien {
          str "name": pass,
          optnl str "id": fail,
          str "power": /pow\-\d/,
          num "speed": 10.01,
          bool "isOP": false
        }
      `;
      const pt = parser.parse(schema); // parse tree
      expect(pt).to.deep.equal({
        nodeType: Word.Program,
        properties: {},
        children: [
          {
            nodeType: Word.StructureDefinition,
            properties: {},
            children: [
              {
                nodeType: Word.StructureIdentifier,
                properties: {
                  type: Word.TypeDef,
                  id: "Alien"
                },
                children: []
              },
              {
                nodeType: Word.StructureBody,
                properties: {},
                children: [
                  {
                    nodeType: Word.PairDefinition,
                    properties: {
                      isOptional: false
                    },
                    children: [
                      {
                        nodeType: Word.PairComponentKey,
                        properties: {
                          type: Word.Str,
                          id: "name"
                        },
                        children: []
                      },
                      {
                        nodeType: Word.PairComponentValue,
                        properties: {
                          type: Word.Fn,
                          value: Word.Identity
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    nodeType: Word.PairDefinition,
                    properties: {
                      isOptional: true
                    },
                    children: [
                      {
                        nodeType: Word.PairComponentKey,
                        properties: {
                          type: Word.Str,
                          id: "id"
                        },
                        children: []
                      },
                      {
                        nodeType: Word.PairComponentValue,
                        properties: {
                          type: Word.Fn,
                          value: Word.Fail
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    nodeType: Word.PairDefinition,
                    properties: {
                      isOptional: false
                    },
                    children: [
                      {
                        nodeType: Word.PairComponentKey,
                        properties: {
                          type: Word.Str,
                          id: "power"
                        },
                        children: []
                      },
                      {
                        nodeType: Word.PairComponentValue,
                        properties: {
                          type: Word.Fn,
                          args: ["/pow-d/", Word.Transformer.Str.Pattern],
                          value: Word.AbEq
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    nodeType: Word.PairDefinition,
                    properties: {
                      isOptional: false
                    },
                    children: [
                      {
                        nodeType: Word.PairComponentKey,
                        properties: {
                          type: Word.Num,
                          id: "speed"
                        },
                        children: []
                      },
                      {
                        nodeType: Word.PairComponentValue,
                        properties: {
                          type: Word.Fn,
                          args: ["10.01"],
                          value: Word.AbEq
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    nodeType: Word.PairDefinition,
                    properties: {
                      isOptional: false
                    },
                    children: [
                      {
                        nodeType: Word.PairComponentKey,
                        properties: {
                          type: Word.Bool,
                          id: "isOP"
                        },
                        children: []
                      },
                      {
                        nodeType: Word.PairComponentValue,
                        properties: {
                          type: Word.Fn,
                          value: Word.AbEq,
                          args: ["false"]
                        },
                        children: []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      });
    });

    it(`should construct parse tree of a simple object with different types of keys and function as values;
      Checks [str with pass, str with user context function, any type with pass]`, () => {
      const schema = `
        typdef Alien {
          str "name": pass,
          optnl str "id": idValidity
          any "details": pass,
        }
      `;
      const pt = parser.parse(schema);
      expect(pt).to.deep.equal({
        nodeType: Word.Program,
        properties: {},
        children: [
          {
            nodeType: Word.StructureDefinition,
            properties: {},
            children: [
              {
                nodeType: Word.StructureIdentifier,
                properties: {
                  type: Word.TypeDef,
                  id: "Alien"
                },
                children: []
              },
              {
                nodeType: Word.StructureBody,
                properties: {},
                children: [
                  {
                    nodeType: Word.PairDefinition,
                    properties: {
                      isOptional: false
                    },
                    children: [
                      {
                        nodeType: Word.PairComponentKey,
                        properties: {
                          type: Word.Str,
                          id: "name"
                        },
                        children: []
                      },
                      {
                        nodeType: Word.PairComponentValue,
                        properties: {
                          type: Word.Fn,
                          value: Word.Identity
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    nodeType: Word.PairDefinition,
                    properties: {
                      isOptional: true
                    },
                    children: [
                      {
                        nodeType: Word.PairComponentKey,
                        properties: {
                          type: Word.Str,
                          id: "id"
                        },
                        children: []
                      },
                      {
                        nodeType: Word.PairComponentValue,
                        properties: {
                          type: Word.UFn,
                          value: "idValidity"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    nodeType: Word.PairDefinition,
                    properties: {
                      isOptional: false
                    },
                    children: [
                      {
                        nodeType: Word.PairComponentKey,
                        properties: {
                          id: "details",
                          type: Word.Any
                        },
                        children: []
                      },
                      {
                        nodeType: Word.PairComponentValue,
                        properties: {
                          type: Word.Fn,
                          value: Word.Identity
                        },
                        children: []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      });
    });
  });

  describe("Compound Type", () => {
    it(`should construct parse tree of an array of primitive types;
      Checks [ordered array, unordered array, multidim array]`, () => {
      const schema = `
        typedef Alien {
          []str "spaceships": ["Ret", "iBnu"],
          [][]num "hediScore": [[8, 0.5], [7, 0.9]],
          []str "weapon": unordered ["teleport", "telekinesis", "laser"]
        }
      `;
    });
  });
});
