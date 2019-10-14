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
      it(`should construct parse tree of an array;
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
                            typeArgs: Word.Str,
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
                            typeArgs: Word.Str,
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
                            typeArgs: "Num",
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
                            typeArgs: Word.Bool,
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
                            typeArgs: "Power",
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
              optnl bool "isLoopback": true,
            },
            \`Admins "admins": pass,
          }

          typdef Response {
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
                          nodeType: "PairComponentValue",
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
                          nodeType: "PairComponentValue",
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
            }
          ]
        });
      });

      it("should throw error when an array is present in ordered list (olist)", () => {
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
              optnl bool "isLoopback": true,
              optnl []str "otherInf": pass
            },
            \`Admins "admins": pass,
          }

          typdef Response {
            \`Report "reports": pass
          }
        `;

        try {
          parser.parse(schema);
          expect(true).to.be.false;
        } catch (e) {
          expect(true).to.be.true;
        }
        // TODO allow array inside olist
        // expect(parser.parse(schema)).to.throw();
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
          olist Report {
            \`Admins "by": \`"Highest"
          }
          typdef Response {
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
          olist Credential {
            str "Name": pass,
            str "Profession": pass,
            num "medal": pass,
          }

          enum top3 \`Credential {
            "#1": ["Deadpool", "Trash Talking", 10],
            "#3": ["Flash", "Trash Talking", 8],
            "#2": ["Spiderman", "Friendly", 8],
          }
        `;
      });
      it("should throw error if an unbounded array member is present inside a reference", () => {
        // TODO write test cases
      });
    });
  });
});
