const expect = require("chai").expect;
const helson = require("../src/index");
const Err = require("../src/err");

describe("Helson", () => {
  it("should verifier a simple object", () => {
    const schema = `
      typdef Person {
        str "name": pass,
        num "age": [18, 100]
      } 
    `;

    const status = helson(schema).match(
      {
        name: "John Wick",
        age: 21
      },
      "Person"
    );
    expect(status).to.deep.equal([true, {}]);
  });

  it("should not match if the value range is outside the allowed range", () => {
    const schema = `
      typdef Person {
        str "name": pass,
        obj "eligibilityParams": {
          num "age": [18, 100],
          num "score": [0, 1]
        }
      } 
    `;

    const status = helson(schema).match(
      {
        name: "John Wick",
        eligibilityParams: {
          age: 17,
          score: 0.5
        }
      },
      "Person"
    );
    expect(status).to.deep.equal([
      false,
      { eligibilityParams: [{ age: [Err.ValueOutSideRange.msg()] }] }
    ]);
  });

  it("should match if an optional property is not present", () => {
    const schema = `
      typdef EligibilityParams {
        num "age": [18, 100],
        num "score": [0, 1]
      }

      typdef Person {
        str "name": pass,
        \`EligibilityParams "eligibilityParams": pass,
        optnl obj "previousApplication": {
          num "applicationNo": pass,
          bool "status": pass
        }
      } 
    `;

    const status = helson(schema).match(
      {
        name: "John Wick",
        eligibilityParams: {
          age: 19,
          score: 0.5
        }
      },
      "Person"
    );
    expect(status).to.deep.equal([true, {}]);
  });

  it("should match if an nested optional property is not present", () => {
    const schema = `
      typdef EligibilityParams {
        num "age": [18, 100],
        num "score": [0, 1],
        optnl str "recommendation": pass,
      }

      typdef Person {
        str "name": pass,
        optnl \`EligibilityParams "eligibilityParams": pass,
      } 
    `;

    const status1 = helson(schema).match(
      {
        name: "John Wick",
        eligibilityParams: {
          age: 19,
          score: 0.5
        }
      },
      "Person"
    );
    const status2 = helson(schema).match(
      {
        name: "John Wick"
      },
      "Person"
    );
    expect([status1, status2]).to.deep.equal([[true, {}], [true, {}]]);
  });

  it("should match an ordered list", () => {
    const schema = `
      typdef Person [
        str "name": pass,
        num "score": [0, 1]
      ] 
    `;

    const status = helson(schema).match(["John Wick", 0.9], "Person");
    expect(status).to.deep.equal([true, {}]);
  });

  it("should match an ordered list with object with optional key", () => {
    const schema = `
      typdef EligibilityParams {
        num "age": [18, 100],
        num "score": [0, 1],
        optnl str "recommendation": pass,
      }
      typdef Person [
        str "name": pass,
        \`EligibilityParams "eligibilityParams": pass
      ] 
    `;

    const status = helson(schema).match(
      [
        "John Wick",
        {
          age: 24,
          score: 1
        }
      ],
      "Person"
    );

    expect(status).to.deep.equal([true, {}]);
  });

  it("should not match an ordered list with object with non optional key not present and outside range", () => {
    const schema = `
      typdef EligibilityParams {
        num "age": [18, 100],
        num "score": [0, 1],
        optnl str "recommendation": pass,
      }
      typdef Person [
        str "name": pass,
        \`EligibilityParams "eligibilityParams": pass
      ] 
    `;

    const status = helson(schema).match(
      [
        "John Wick",
        {
          age: 101
        }
      ],
      "Person"
    );

    expect(status).to.deep.equal([
      false,
      {
        1: [
          {
            age: [Err.ValueOutSideRange.msg()],
            score: [Err.KeyInSchemaNotInObj.msg()]
          }
        ]
      }
    ]);
  });

  it("should match with an object having value decided by enum", () => {
    const schema = `
      enum Grades str {
        "Great": "A",
        "Avg": "B",
        "Poor": "C",
        "Fail": "F"
      }

      typdef Person {
        str "name": pass,
        \`Grades "failGrade": \`"Fail",
        \`Grades "gradeReceived": pass,
      }
    `;

    const status = helson(schema).match(
      {
        name: "Akash Goswami",
        failGrade: "F",
        gradeReceived: "B"
      },
      "Person"
    );

    expect(status).to.deep.equal([true, {}]);
  });

  it("should not match with an object having value decided by enum but different passed values", () => {
    const schema = `
      enum Grades str {
        "Great": "A",
        "Avg": "B",
        "Poor": "C",
        "Fail": "F"
      }

      typdef Person {
        str "name": pass,
        \`Grades "failGrade": \`"Fail",
        \`Grades "gradeReceived": pass,
      }
    `;

    const status = helson(schema).match(
      {
        name: "Akash Goswami",
        failGrade: "X",
        gradeReceived: "B+"
      },
      "Person"
    );

    expect(status).to.deep.equal([
      false,
      {
        failGrade: [Err.ValueMismatch.msg("F", "X")],
        gradeReceived: [Err.ValueNotPresent.msg("B+", "Grades")]
      }
    ]);
  });

  it("should match with an object having value decided by complex enum when a correct value is passed", () => {
    const schema = `
      enum HttpErrorCode num {
        "InternalServerError": 500,
        "ResourceNotFound": 404,
        "Auth": 403
      }

      enum HttpOkCode num {
        "AllOk": 200
      }

      typdef Data {
        str "userId": pass,
        optnl bool "isLoggedIn": pass,
      }

      enum ClassicResponse \`ErrResponseFormat {
        "Simple": ([500, { "items": []}]),
        "Verbose": ([500, { "items": [] }, { "code": 1, "msg": "The third-party API didn't respond before timeout." }])
      }

      typdef ErrResponseFormat [
        \`HttpErrorCode "code": pass,
        obj "data": {
          []\`Data "items": pass
        },
        optnl obj "err": {
          num "code": pass,
          str "msg": pass,
        }
      ]

      typdef SuccessResponseFormat [
        \`HttpErrorCode "code": \`"AllOK",
        obj "data": {
          []\`Data "items": pass
        }
      ]

      typdef ErrResp {
        \`ClassicResponse "resp": pass,
      }
    `;

    const resp = helson(schema).match(
      {
        resp: [
          500,
          { items: [] },
          {
            code: 1,
            msg: "The third-party API didn't respond before timeout."
          }
        ]
      },
      "ErrResp"
    );

    expect(resp).to.deep.equal([true, {}]);
  });

  it("should throw error during transformation if the enum compound value does not comply schema", () => {
    const schema = `
      enum HttpErrorCode num {
        "InternalServerError": 500,
        "ResourceNotFound": 404,
        "Auth": 403
      }

      enum HttpOkCode num {
        "AllOk": 200
      }

      typdef Data {
        str "userId": pass,
        optnl bool "isLoggedIn": pass,
      }

      enum ClassicResponse \`ErrResponseFormat {
        "Simple": ([500, { "items": []}]),
        "Verbose": ([500, { "items": [] }, { "code": 1 }])
      }

      typdef ErrResponseFormat [
        \`HttpErrorCode "code": pass,
        obj "data": {
          []\`Data "items": pass
        },
        optnl obj "err": {
          num "code": pass,
          str "msg": pass,
        }
      ]

      typdef SuccessResponseFormat [
        \`HttpErrorCode "code": \`"AllOK",
        obj "data": {
          []\`Data "items": pass
        }
      ]

      typdef ErrResp {
        \`ClassicResponse "resp": pass,
      }
    `;

    expect(() => helson(schema)).to.throw();
  });

  it("should parse and validate simple 1D array", () => {
    const schema = `
      typdef Primes {
        []num "somePrimes": [2, 3, 5, 7, 11, 13, 17, 19, 23] 
      }
    `;

    const result = helson(schema).match(
      {
        somePrimes: [2, 3, 5, 7, 11, 13, 17, 19, 23]
      },
      "Primes"
    );

    expect(result).to.deep.equal([true, {}]);
  });

  it("should not validate simple 1D array with unequal length", () => {
    const schema = `
      typdef Primes {
        []num "somePrimes": [2, 3, 5, 7, 11, 13, 17, 19] 
      }
    `;

    const result1 = helson(schema).match(
      {
        somePrimes: [2, 3, 5, 7, 11, 13, 17, 19, 23]
      },
      "Primes"
    );

    const result2 = helson(schema).match(
      {
        somePrimes: [2, 3, 5, 7, 11, 13, 17]
      },
      "Primes"
    );

    expect([result1, result2]).to.deep.equal([
      [
        false,
        {
          somePrimes: [Err.ArrayMembersDifferent.msg(8, 9)]
        }
      ],
      [
        false,
        {
          somePrimes: [Err.ArrayMembersDifferent.msg(8, 7)]
        }
      ]
    ]);
  });

  it("should not validate simple 1D array with unequal content", () => {
    const schema = `
      typdef Primes {
        []num "somePrimes": [2, 3, 5, 7, 11, 13, 17, 19] 
      }
    `;

    const result1 = helson(schema).match(
      {
        somePrimes: [2, 3, 5, 7, 11, 17, 19, 23]
      },
      "Primes"
    );

    const result2 = helson(schema).match(
      {
        somePrimes: [2, 3, 5, 7, "NA", 13, 17, 19]
      },
      "Primes"
    );

    const result3 = helson(schema).match(
      {
        somePrimes: [2, [3, 5, 7], "NA", 13, 17, 19]
      },
      "Primes"
    );

    expect([result1, result2, result3]).to.deep.equal([
      [
        false,
        {
          somePrimes: [
            {
              5: [Err.ValueMismatch.msg(13, 17)],
              6: [Err.ValueMismatch.msg(17, 19)],
              7: [Err.ValueMismatch.msg(19, 23)]
            }
          ]
        }
      ],
      [
        false,
        {
          somePrimes: [
            {
              4: [
                Err.ValueMismatch.msg("number", "string"),
                Err.ValueMismatch.msg(11, "NA")
              ]
            }
          ]
        }
      ],
      [
        false,
        {
          somePrimes: [
            {
              1: [
                Err.ValueMismatch.msg("number", "object"),
                Err.ValueMismatch.msg(3, [3, 5, 7])
              ],
              2: [
                Err.ValueMismatch.msg("number", "string"),
                Err.ValueMismatch.msg(5, "NA")
              ],
              3: [Err.ValueMismatch.msg(7, 13)],
              4: [Err.ValueMismatch.msg(11, 17)],
              5: [Err.ValueMismatch.msg(13, 19)]
            },
            Err.ArrayMembersDifferent.msg(8, 6)
          ]
        }
      ]
    ]);
  });

  it("should validate simple multidim array with similar content", () => {
    const schema = `
      typdef MultiDim {
        optnl [][]str "types": [["Arr", "Arr", "String"], ["String"], ["Arr", "Arr", "Foreign", "Type"], ["Bool"]],
        optnl [][][]num "mat3D": [[[1, 2], [3, 2]], [[1, 1, 1], [5, 5, 5], [6, 6, 6]], [[]]]
      }
    `;

    const result1 = helson(schema).match({}, "MultiDim");
    const result2 = helson(schema).match(
      {
        mat3D: [[[1, 2], [3, 2]], [[1, 1, 1], [5, 5, 5], [6, 6, 6]], [[]]]
      },
      "MultiDim"
    );
    result3 = helson(schema).match(
      {
        types: [["Arr", "String"], [], [["Type"]]],
        mat3D: [[[1, 2], [3, 2]], [[1, 1, 1], [5, 5, 5], [6, 6, 6]], [[]]]
      },
      "MultiDim"
    );

    expect([result1, result2, result3]).to.deep.equal([
      [true, {}],
      [true, {}],
      [
        false,
        {
          types: [
            {
              0: [
                {
                  1: [Err.ValueMismatch.msg("Arr", "String")]
                },
                Err.ArrayMembersDifferent.msg(3, 2)
              ],
              1: [Err.ArrayMembersDifferent.msg(1, 0)],
              2: [
                {
                  0: [
                    Err.ValueMismatch.msg("string", "object"),
                    Err.ValueMismatch.msg("Arr", "Type")
                  ]
                },
                Err.ArrayMembersDifferent.msg(4, 1)
              ]
            },
            Err.ArrayMembersDifferent.msg(4, 3)
          ]
        }
      ]
    ]);
  });

  it.skip("should thorw error if no mount point is given", () => {});
});
