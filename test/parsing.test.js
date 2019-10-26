const expect = require("chai").expect;
const parser = require("../src/helson").parser; // temporary location before the build
const { Word } = require("../src/parse-tree"); // temporary location before the build

describe("Parse Tree", () => {
  describe("Primitive Type", () => {
    it(`should construct parse tree for a schema with keys=2;
      Checks [typedef, str with pass, optnl, num with rangeFn]`, () => {
      const schema = `
        typedef Person {
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
        typedef Alien {
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
                          args: [10.01],
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
        typedef Alien {
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
      it(`should construct parse tree of an array;
        Checks [ordered array, unordered array, multidim array]`, () => {
        const schema = `
          typedef Power {
            str "name": pass,
            num "damage": [0, 100],
            optnl num "range": [1, 50]
          }
          typedef Alien {
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
                    type: "typedef",
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
                            typeArgs: Word.Str,
                            id: "spaceships",
                            dim: 3
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Fn,
                            value: Word.ArrAbEq,
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
                            typeArgs: Word.Str,
                            id: "test",
                            dim: 1
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Fn,
                            value: Word.ArrAbEq,
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
                            typeArgs: "Num",
                            id: "values",
                            dim: 1
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Fn,
                            value: Word.ArrAbEq,
                            args: [[1, 2, 3.33, 4]]
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
                            typeArgs: Word.Bool,
                            id: "flags",
                            dim: 2
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Fn,
                            value: Word.ArrAbEq,
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
                            typeArgs: Word.Ref,
                            subType: "Power",
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
      it("should construct parse tree for ordered list without an array as a member", () => {
        // In the form of
        // [110, "Report submitted yesterday!", no-reply@mail.box, { isEncrypted: true }, ['moderator@mail.box', 'akash']]
        const schema = `
          typedef Admins [
            str "cc1": "moderator@mail.box",
            str "cc2": pass
          ]
          typedef Report [
            num "code": pass,
            str "msg": pass,
            str "from": "no-reply@mail.box",
            obj "meta": {
              bool "isEncrypted": pass,
              optnl bool "isLoopback": true,
            },
            \`Admins "admins": pass,
          ]

          typedef Response {
            \`Report "reports": pass
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
                    type: Word.OList,
                    id: "Admins"
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
                            id: "cc1"
                          },
                          children: []
                        },
                        {
                          nodeType: "PairComponentValue",
                          properties: {
                            type: Word.Fn,
                            value: Word.AbEq,
                            args: ["moderator@mail.box"]
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
                            id: "cc2"
                          },
                          children: []
                        },
                        {
                          nodeType: "PairComponentValue",
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
            },
            {
              nodeType: Word.StructureDefinition,
              properties: {},
              children: [
                {
                  nodeType: Word.StructureIdentifier,
                  properties: {
                    type: Word.OList,
                    id: "Report"
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
                            type: Word.Num,
                            id: "code"
                          },
                          children: []
                        },
                        {
                          nodeType: "PairComponentValue",
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
                            type: Word.Str,
                            id: "msg"
                          },
                          children: []
                        },
                        {
                          nodeType: "PairComponentValue",
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
                            type: Word.Str,
                            id: "from"
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Fn,
                            value: Word.AbEq,
                            args: ["no-reply@mail.box"]
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
                            type: Word.Obj,
                            id: "meta"
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Rec,
                            value: {
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
                                        type: Word.Bool,
                                        id: "isEncrypted"
                                      },
                                      children: []
                                    },
                                    {
                                      nodeType: "PairComponentValue",
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
                                        type: Word.Bool,
                                        id: "isLoopback"
                                      },
                                      children: []
                                    },
                                    {
                                      nodeType: "PairComponentValue",
                                      properties: {
                                        type: Word.Fn,
                                        value: Word.AbEq,
                                        args: ["true"]
                                      },
                                      children: []
                                    }
                                  ]
                                }
                              ]
                            }
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
                            type: Word.Ref,
                            typeArgs: "Admins",
                            id: "admins"
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
            },
            {
              nodeType: Word.StructureDefinition,
              properties: {},
              children: [
                {
                  nodeType: Word.StructureIdentifier,
                  properties: {
                    type: Word.TypeDef,
                    id: "Response"
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
                            type: Word.Ref,
                            typeArgs: "Report",
                            id: "reports"
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

      it("should throw error when an array is present in ordered list (olist)", () => {
        const schema = `
          typedef Admins [
            str "cc1": "moderator@mail.box",
            str "cc2": pass
          ]
          typedef Report [
            num "code": pass,
            str "msg": pass,
            str "from": "no-reply@mail.box",
            obj "meta": {
              bool "isEncrypted": pass,
              optnl bool "isLoopback": true,
              optnl []str "otherInf": pass
            },
            \`Admins "admins": pass,
          ]

          typedef Response {
            \`Report "reports": pass
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
                    type: Word.OList,
                    id: "Admins"
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
                            id: "cc1"
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Fn,
                            value: Word.AbEq,
                            args: ["moderator@mail.box"]
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
                            id: "cc2"
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
            },
            {
              nodeType: Word.StructureDefinition,
              properties: {},
              children: [
                {
                  nodeType: Word.StructureIdentifier,
                  properties: {
                    type: Word.OList,
                    id: "Report"
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
                            type: Word.Num,
                            id: "code"
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
                            type: Word.Str,
                            id: "msg"
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
                            type: Word.Str,
                            id: "from"
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Fn,
                            value: Word.AbEq,
                            args: ["no-reply@mail.box"]
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
                            type: Word.Obj,
                            id: "meta"
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: "Rec",
                            value: {
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
                                        type: Word.Bool,
                                        id: "isEncrypted"
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
                                        type: Word.Bool,
                                        id: "isLoopback"
                                      },
                                      children: []
                                    },
                                    {
                                      nodeType: Word.PairComponentValue,
                                      properties: {
                                        type: Word.Fn,
                                        value: Word.AbEq,
                                        args: ["true"]
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
                                        typeArgs: Word.Str,
                                        id: "otherInf",
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
                            type: Word.Ref,
                            typeArgs: "Admins",
                            id: "admins"
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
            },
            {
              nodeType: Word.StructureDefinition,
              properties: {},
              children: [
                {
                  nodeType: Word.StructureIdentifier,
                  properties: {
                    type: Word.TypeDef,
                    id: "Response"
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
                            type: Word.Ref,
                            typeArgs: "Report",
                            id: "reports"
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

    describe("Enum", () => {
      it("should construct parse tree correctly with primitive types", () => {
        const schema = `
          enum Admins str {
            "Highest": "mod@mail.box",
            "A1": "nimona@mail.box",
            "A2": "kidflash@mail.box"
          }
          typedef Report [
            \`Admins "by": \`"Highest"
          ]
          typedef Response {
            \`Report "reports": pass,
            \`Admins "reviewer": \`"A1"
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
                    type: Word.Enum,
                    id: "Admins",
                    typeArgs: Word.Str
                  },
                  children: []
                },
                {
                  nodeType: Word.StructureBody,
                  properties: {},
                  children: [
                    {
                      nodeType: Word.PairDefinition,
                      properties: {},
                      children: [
                        {
                          nodeType: Word.PairComponentKey,
                          properties: {
                            id: "Highest"
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Fn,
                            value: Word.AbEq,
                            args: ["mod@mail.box"]
                          },
                          children: []
                        }
                      ]
                    },
                    {
                      nodeType: Word.PairDefinition,
                      properties: {},
                      children: [
                        {
                          nodeType: Word.PairComponentKey,
                          properties: {
                            id: "A1"
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Fn,
                            value: Word.AbEq,
                            args: ["nimona@mail.box"]
                          },
                          children: []
                        }
                      ]
                    },
                    {
                      nodeType: Word.PairDefinition,
                      properties: {},
                      children: [
                        {
                          nodeType: Word.PairComponentKey,
                          properties: {
                            id: "A2"
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Fn,
                            value: Word.AbEq,
                            args: ["kidflash@mail.box"]
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
                    type: Word.OList,
                    id: "Report"
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
                            type: Word.Ref,
                            typeArgs: "Admins",
                            id: "by"
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Ref,
                            value: "Highest"
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
                    id: "Response"
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
                            type: Word.Ref,
                            typeArgs: "Report",
                            id: "reports"
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
                            type: Word.Ref,
                            typeArgs: "Admins",
                            id: "reviewer"
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Ref,
                            value: "A1"
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
      it("should construct parse tree with composite type", () => {
        const schema = `
          typedef Competition {
            num "code": pass,
            str "name": pass,
            num "pos": pass
          }

          typedef Credential [
            str "Name": pass,
            str "Profession": pass,
            num "medal": (1, 5),
            []\`Competition "competitionResult": pass
          ]

          enum Top3 \`Credential {
            "#1": (["Deadpool", "Trash Talking", 10, [{ "code": 0, "name": "high jump", "pos": 1}, { "code": 1, "name": "high jump", "pos": 2}]]),
            "#3": (["Flash", "Trash Talking", 8, [{ "code", 0, "name": "running", "pos": 1}]]),
            "#2": (["Spiderman", "Friendly", 8, [{ "code", 0, "name": "long jump", "pos": 1}]])
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
                    id: "Competition"
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
                            type: Word.Num,
                            id: "code"
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
                            id: "pos"
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
            },
            {
              nodeType: Word.StructureDefinition,
              properties: {},
              children: [
                {
                  nodeType: Word.StructureIdentifier,
                  properties: {
                    type: "olist",
                    id: "Credential"
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
                            id: "Name"
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
                            type: Word.Str,
                            id: "Profession"
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
                            id: "medal"
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Fn,
                            value: "loroRange,1,5"
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
                            typeArgs: Word.Ref,
                            subType: "Competition",
                            id: "competitionResult",
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
            },
            {
              nodeType: Word.StructureDefinition,
              properties: {},
              children: [
                {
                  nodeType: Word.StructureIdentifier,
                  properties: {
                    type: Word.Enum,
                    id: "Top3",
                    typeArgs: Word.Ref,
                    subType: "Credential"
                  },
                  children: []
                },
                {
                  nodeType: Word.StructureBody,
                  properties: {},
                  children: [
                    {
                      nodeType: Word.PairDefinition,
                      properties: {},
                      children: [
                        {
                          nodeType: Word.PairComponentKey,
                          properties: {
                            id: "#1"
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Fn,
                            value: Word.AbEq,
                            args:
                              '["Deadpool", "Trash Talking", 10, [{ "code": 0, "name": "high jump", "pos": 1}, { "code": 1, "name": "high jump", "pos": 2}]]'
                          },
                          children: []
                        }
                      ]
                    },
                    {
                      nodeType: Word.PairDefinition,
                      properties: {},
                      children: [
                        {
                          nodeType: Word.PairComponentKey,
                          properties: {
                            id: "#3"
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Fn,
                            value: Word.AbEq,
                            args:
                              '["Flash", "Trash Talking", 8, [{ "code", 0, "name": "running", "pos": 1}]]'
                          },
                          children: []
                        }
                      ]
                    },
                    {
                      nodeType: Word.PairDefinition,
                      properties: {},
                      children: [
                        {
                          nodeType: Word.PairComponentKey,
                          properties: {
                            id: "#2"
                          },
                          children: []
                        },
                        {
                          nodeType: Word.PairComponentValue,
                          properties: {
                            type: Word.Fn,
                            value: Word.AbEq,
                            args:
                              '["Spiderman", "Friendly", 8, [{ "code", 0, "name": "long jump", "pos": 1}]]'
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
  });
});
