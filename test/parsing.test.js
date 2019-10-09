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
    describe("Array", () => {
      it(`should construct parse tree of an array of primitive types;
        Checks [ordered array, unordered array, multidim array]`, () => {
        const schema = `
          typdef Power {
            str "name": pass,
            num "damage": [0, 100],
            optnl num "range": [1, 50]
          }
          typdef Alien {
            [][][]str "spaceships": [[["this", "is"], ["really"], ["super"]], [["really"]], [["random"], ["ness"]]],
            []str "test": ["yooo", "yaa"],
            []num "values": [1, 2, 3.33, 4],
            optnl [][]bool "flags": [[true, false], [false, true], [true]],
            []\`Power "power": pass
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
                    type: "typdef",
                    id: "Power"
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
                        isOptional: false
                      },
                      children: [
                        {
                          nodeType: Word.PairComponentKey,
                          properties: {
                            type: Word.Num,
                            id: "damage"
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Fn,
                            value: "lcrcRange,0,100"
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
                            id: "range"
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Fn,
                            value: "lcrcRange,1,50"
                          },
                          children: []
                        }
                      ]
                    }
                  ]
                }
              ]
            },
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
                            type: Word.Arr,
                            typeof: Word.Str,
                            id: "spaceships"
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Fn,
                            value: Word.AbEq,
                            args: [
                              [
                                [["this", "is"], ["really"], ["super"]],
                                [["really"]],
                                [["random"], ["ness"]]
                              ]
                            ]
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
                            type: Word.Arr,
                            typeof: Word.Str,
                            id: "test"
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Fn,
                            value: Word.AbEq,
                            args: [["yooo", "yaa"]]
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
                            type: Word.Arr,
                            typeof: "Num",
                            id: "values"
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Fn,
                            value: Word.AbEq,
                            args: [["1", "2", "3.33", "4"]]
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
                            type: Word.Arr,
                            typeof: Word.Bool,
                            id: "flags"
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Fn,
                            value: Word.AbEq,
                            args: [
                              [["true", "false"], ["false", "true"], ["true"]]
                            ]
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
                            type: Word.Arr,
                            typeofExt: "Power",
                            id: "power",
                            dim: 1
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

    describe("OList", () => {
      it("", () => {
        // In the form of
        // [110, "Report submitted yesterday!", no-reply@mail.box, { isEncrypted: true }, ['moderator@mail.box', 'akash']]
        const schema = `
          olist Admins {
            str "cc1": "moderator@mail.box",
            str "cc2": pass
          }
          olist Report {
            num "code": pass,
            str "msg": pass,
            str "from": "no-reply@mail.box",
            obj "meta": {
              bool "isEncrypted": pass,
              optnl "isLoopback": true,
            },
            \`Admins "admins": pass,
          }

          typedef Response {
            \`Report "reports": pass
          }
        `;
      });
    });
  });
});
