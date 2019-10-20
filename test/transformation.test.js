const expect = require("chai").expect;
const parser = require("../src/helson").parser; // temporary location before the build
const { Word } = require("../src/parse-tree"); // temporary location before the build
const transformer = require("../src/transformer");

function l(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

describe("AST", () => {
  it.skip("should transform simple level 1 object", () => {
    const schema = `
      typdef Person {
        str "name": pass,
        optnl num "age": [, 100]
      }

      typdef Items [
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
      [Word.Enum]: {
        Admins: {
          Root: "root@mail.box",
          Mod: "mod@mail.box",
          A1: "akash@mail.box"
        }
      },
      [Word.TypeDef]: {
        Person: {
          name: {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Str, null],
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
            typeProcessor: [Word.Num, null],
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
      olist: {
        Items: [
          {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Str, null],
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
            typeProcessor: [Word.Str, null],
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
            typeProcessor: [Word.Num, null],
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

  it.skip("should transform simple object with arrays and obj", () => {
    const schema = `
      enum Facility num {
        "ClassM": 1,
        "ClassN": 2,
        "ClassO": 3
      }

      typdef Person {
        str "name": pass,
        optnl []str "profile": ["Twitter", "Reddit", "Pinterest"]
        obj "cred": {
          num "age": [18, 150],
          str "ssn": ssnValidator,
          optnl []\`Facility "facilities": pass,
          \`Facility "defaultFacility": \`"ClassM"
        }
      } 
    `;

    const pt = parser.parse(schema);
    const ast = transformer(pt);
    expect(ast).to.deep.equal({
      enum: {
        Facility: {
          ClassM: 1,
          ClassN: 2,
          ClassO: 3
        }
      },
      typdef: {
        Person: {
          name: {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Str, null],
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
            typeProcessor: [Word.Arr, Word.Str],
            keyId: "profile",
            valueResolver: [
              Word.Fn,
              Word.AbEq,
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
            valueResolver: [Word.Fn, Word.Identity, null, { ns: 0 }]
          }
        },
        "@2": {
          age: {
            preProcessor: ["optionality", false],
            typeProcessor: [Word.Num, null],
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
            typeProcessor: [Word.Str, null],
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
            typeProcessor: [Word.Arr, "Facility"],
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
            typeProcessor: [Word.Ref, "Facility"],
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

      typdef Data {
        str "userId": pass,
        optnl bool "isLoggedIn": pass,
      }

      enum ClassicResponse \`ErrResponseFormat {
        "MessedUp": ([500, { "items": [[], [{ "userId": "a" }, { "userId" : "b", "isLoggedIn": true }]] }]),
      }

      typdef ErrResponseFormat [
        \`HttpErrorCode "code": \`"InternalServerError",
        obj "data": {
          [][]\`Data "items": pass
        }
      ]

      typdef SuccessResponseFormat [
        \`HttpErrorCode "code": \`"AllOK",
        obj "data": {
          []\`Data "items": arrLenGreaterThanOne
        }
      ]

      typdef ErrResp {
        \`ClassicResponse "resp": \`"MessedUp",
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
              Word.AbEq,
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
