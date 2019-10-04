const expect = require("chai").expect;
const parser = require("../src/helson").parser; // temporary location before the build
const { Word } = require("../src/parse-tree"); // temporary location before the build

describe("L1 Object", () => {
  it("should construct parse tree of a simple object with keys=2 and level=1", () => {
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

  it("should construct parse tree of a simple object with different simple types of keys and level=1", () => {
    const schema = `
      typdef Alien {
        str "name": pass,
        optnl str "id": fail,
        str "power": /pow\-\d/,
        num "speed": 10.01
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
                        type: Word.Abs,
                        value: "/pow-d/",
                        transformer: Word.Transformer.Str.Pattern
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
                        type: Word.Abs,
                        value: "10.01"
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
