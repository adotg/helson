const expect = require("chai").expect;
const parser = require("../src/helson").parser; // temporary location before the build
const { Word } = require("../src/parse-tree"); // temporary location before the build
const transformer = require("../src/transformer");

function l(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

describe("AST", () => {
  it("should transform simple level 1 object", () => {
    const schema = `
      typedef Person {
        str "name": pass,
        optnl num "age": [, 100]
      }

      typedef Items [
        str "name": pass,
        str "itemCode": "no-code",
        num "quantity": [1, 10]
      ]

      enum Admins str {
        "Root": "root@mail.box",
        "Mod": "mod@mail.box",
        "A1": "akash@mail.box"
      }
    `;

    const pt = parser.parse(schema);
    const ast = transformer(pt);

    expect(ast).to.deep.equal({
      [Word.EnumIterables]: {
        Admins: {
          "akash@mail.box": 1,
          "mod@mail.box": 1,
          "root@mail.box": 1
        }
      },
      [Word.Enum]: {
        Admins: {
          Root: {
            typeProcessor: [Word.Enum, Word.Str, null],
            keyId: "Root",
            valueResolver: [
              Word.Fn,
              Word.AbEq,
              ["root@mail.box"],
              {
                ns: 0
              }
            ]
          },
          Mod: {
            typeProcessor: [Word.Enum, Word.Str, null],
            keyId: "Mod",
            valueResolver: [
              Word.Fn,
              Word.AbEq,
              ["mod@mail.box"],
              {
                ns: 0
              }
            ]
          },
          A1: {
            typeProcessor: [Word.Enum, Word.Str, null],
            keyId: "A1",
            valueResolver: [
              "Fn",
              "abEq",
              ["akash@mail.box"],
              {
                ns: 0
              }
            ]
          }
        }
      },
      typedef: {
        Person: {
          name: {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Str, null, null],
            keyId: "name",
            valueResolver: [
              Word.Fn,
              Word.Identity,
              null,
              {
                ns: 0
              }
            ]
          },
          age: {
            preProcessor: ["optionality", true],
            typeProcessor: [Word.Num, null, null],
            keyId: "age",
            valueResolver: [
              Word.Fn,
              "lcrcRange,null,100",
              null,
              {
                ns: 0
              }
            ]
          }
        }
      },
      [Word.OList]: {
        Items: [
          {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Str, null, null],
            keyId: "name",
            valueResolver: [
              Word.Fn,
              Word.Identity,
              null,
              {
                ns: 0
              }
            ]
          },
          {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Str, null, null],
            keyId: "itemCode",
            valueResolver: [
              Word.Fn,
              Word.AbEq,
              ["no-code"],
              {
                ns: 0
              }
            ]
          },
          {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Num, null, null],
            keyId: "quantity",
            valueResolver: [
              Word.Fn,
              "lcrcRange,1,10",
              null,
              {
                ns: 0
              }
            ]
          }
        ]
      }
    });
  });

  it("should transform simple object with arrays and obj", () => {
    const schema = `
      enum Facility num {
        "ClassM": 1,
        "ClassN": 2,
        "ClassO": 3
      }

      typedef Person {
        str "name": pass,
        optnl []str "profile": ["Twitter", "Reddit", "Pinterest"]
        obj "cred": {
          num "age": [18, 150],
          str "ssn": ssnValidator,
          optnl []&Facility "facilities": pass,
          &Facility "defaultFacility": &"ClassM"
        }
      } 
    `;

    const pt = parser.parse(schema);
    const ast = transformer(pt);
    expect(ast).to.deep.equal({
      [Word.EnumIterables]: {
        Facility: {
          "1": 1,
          "2": 1,
          "3": 1
        }
      },
      [Word.Enum]: {
        Facility: {
          ClassM: {
            typeProcessor: [Word.Enum, Word.Num, null],
            keyId: "ClassM",
            valueResolver: [
              Word.Fn,
              Word.AbEq,
              [1],
              {
                ns: 0
              }
            ]
          },
          ClassN: {
            typeProcessor: [Word.Enum, Word.Num, null],
            keyId: "ClassN",
            valueResolver: [
              Word.Fn,
              Word.AbEq,
              [2],
              {
                ns: 0
              }
            ]
          },
          ClassO: {
            typeProcessor: [Word.Enum, Word.Num, null],
            keyId: "ClassO",
            valueResolver: [
              "Fn",
              "abEq",
              [3],
              {
                ns: 0
              }
            ]
          }
        }
      },
      [Word.TypeDef]: {
        Person: {
          name: {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Str, null, null],
            keyId: "name",
            valueResolver: [
              Word.Fn,
              Word.Identity,
              null,
              {
                ns: 0
              }
            ]
          },
          profile: {
            preProcessor: ["optionality", true],
            typeProcessor: [Word.Arr, Word.Str, null],
            keyId: "profile",
            valueResolver: [
              Word.Fn,
              Word.ArrAbEq,
              [["Twitter", "Reddit", "Pinterest"]],
              {
                ns: 0
              }
            ]
          },
          cred: {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Ref, "@2"],
            keyId: "cred",
            valueResolver: [
              Word.Fn,
              Word.Identity,
              null,
              {
                ns: 0
              }
            ]
          }
        },
        "@2": {
          age: {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Num, null, null],
            keyId: "age",
            valueResolver: [
              Word.Fn,
              "lcrcRange,18,150",
              null,
              {
                ns: 0
              }
            ]
          },
          ssn: {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Str, null, null],
            keyId: "ssn",
            valueResolver: [
              Word.UFn,
              "ssnValidator",
              null,
              {
                ns: 1
              }
            ]
          },
          facilities: {
            preProcessor: ["optionality", true],
            typeProcessor: [Word.Arr, Word.Ref, "Facility"],
            keyId: "facilities",
            valueResolver: [
              Word.Fn,
              Word.Identity,
              null,
              {
                ns: 0
              }
            ]
          },
          defaultFacility: {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Enum, Word.Ref, "Facility", null],
            keyId: "defaultFacility",
            valueResolver: [
              Word.Ref,
              "ClassM",
              null,
              {
                ns: 0
              }
            ]
          }
        }
      },
      olist: {}
    });
  });

  it("should transform ordered list referenced from inside enum", () => {
    const schema = `
      enum HttpErrorCode num {
        "InternalServerError": 500,
        "AllOK": 200
      }

      typedef Data {
        str "userId": pass,
        optnl bool "isLoggedIn": pass,
      }

      enum ClassicResponse &ErrResponseFormat {
        "MessedUp": ([500, { "items": [[], [{ "userId": "a" }, { "userId" : "b", "isLoggedIn": true }]] }]),
      }

      typedef ErrResponseFormat [
        &HttpErrorCode "code": &"InternalServerError",
        obj "data": {
          [][]&Data "items": pass
        }
      ]

      typedef SuccessResponseFormat [
        &HttpErrorCode "code": &"AllOK",
        obj "data": {
          []&Data "items": arrLenGreaterThanOne
        }
      ]

      typedef ErrResp {
        &ClassicResponse "resp": &"MessedUp",
        obj "err": {
          num "code": pass,
          str "msg": pass,
          [][]num "primes": [[11, 13], [17, 19, 23]]
        }
      }
    `;

    const pt = parser.parse(schema);
    const ast = transformer(pt);
    expect(ast).to.deep.equal({
      [Word.EnumIterables]: {
        ClassicResponse: {
          "747778066.5": 1
        },
        HttpErrorCode: {
          200: 1,
          500: 1
        }
      },
      [Word.Enum]: {
        HttpErrorCode: {
          InternalServerError: {
            typeProcessor: [Word.Enum, Word.Num, null],
            keyId: "InternalServerError",
            valueResolver: [
              Word.Fn,
              Word.AbEq,
              [500],
              {
                ns: 0
              }
            ]
          },
          AllOK: {
            typeProcessor: [Word.Enum, Word.Num, null],
            keyId: "AllOK",
            valueResolver: [
              Word.Fn,
              Word.AbEq,
              [200],
              {
                ns: 0
              }
            ]
          }
        },
        ClassicResponse: {
          MessedUp: {
            typeProcessor: [Word.Enum, Word.Ref, "ErrResponseFormat"],
            keyId: "MessedUp",
            valueResolver: [
              Word.Fn,
              Word.AbEq,
              '[500, { "items": [[], [{ "userId": "a" }, { "userId" : "b", "isLoggedIn": true }]] }]',
              {
                ns: 0
              }
            ]
          }
        }
      },
      [Word.TypeDef]: {
        Data: {
          userId: {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Str, null, null],
            keyId: "userId",
            valueResolver: [
              Word.Fn,
              Word.Identity,
              null,
              {
                ns: 0
              }
            ]
          },
          isLoggedIn: {
            preProcessor: ["optionality", true],
            typeProcessor: [Word.Bool, null, null],
            keyId: "isLoggedIn",
            valueResolver: [
              Word.Fn,
              Word.Identity,
              null,
              {
                ns: 0
              }
            ]
          }
        },
        ErrResp: {
          resp: {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Enum, Word.Ref, "ClassicResponse", null],
            keyId: "resp",
            valueResolver: [
              Word.Ref,
              "MessedUp",
              null,
              {
                ns: 0
              }
            ]
          },
          err: {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Ref, "@8"],
            keyId: "err",
            valueResolver: [
              Word.Fn,
              Word.Identity,
              null,
              {
                ns: 0
              }
            ]
          }
        },
        "@6": {
          items: {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Arr, Word.Arr, Word.Ref, "Data"],
            keyId: "items",
            valueResolver: [
              Word.Fn,
              Word.Identity,
              null,
              {
                ns: 0
              }
            ]
          }
        },
        "@7": {
          items: {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Arr, Word.Ref, "Data"],
            keyId: "items",
            valueResolver: [
              Word.UFn,
              "arrLenGreaterThanOne",
              null,
              {
                ns: 1
              }
            ]
          }
        },
        "@8": {
          code: {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Num, null, null],
            keyId: "code",
            valueResolver: [
              Word.Fn,
              Word.Identity,
              null,
              {
                ns: 0
              }
            ]
          },
          msg: {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Str, null, null],
            keyId: "msg",
            valueResolver: [
              Word.Fn,
              Word.Identity,
              null,
              {
                ns: 0
              }
            ]
          },
          primes: {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Arr, Word.Arr, Word.Num, null],
            keyId: "primes",
            valueResolver: [
              Word.Fn,
              Word.ArrAbEq,
              [[[11, 13], [17, 19, 23]]],
              {
                ns: 0
              }
            ]
          }
        }
      },
      [Word.OList]: {
        ErrResponseFormat: [
          {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Num, null],
            keyId: "code",
            valueResolver: [
              Word.Fn,
              Word.AbEq,
              [500],
              {
                ns: 0
              }
            ]
          },
          {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Ref, "@6"],
            keyId: "data",
            valueResolver: [
              Word.Fn,
              Word.Identity,
              null,
              {
                ns: 0
              }
            ]
          }
        ],
        SuccessResponseFormat: [
          {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Enum, Word.Ref, "HttpErrorCode", null],
            keyId: "code",
            valueResolver: [
              Word.Ref,
              "AllOK",
              null,
              {
                ns: 0
              }
            ]
          },
          {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Ref, "@7"],
            keyId: "data",
            valueResolver: [
              Word.Fn,
              Word.Identity,
              null,
              {
                ns: 0
              }
            ]
          }
        ]
      }
    });
  });
});
