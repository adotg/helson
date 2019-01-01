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
      { eligibilityParams: { age: [Err.ValueOutSideRange.msg()] } }
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
        1: {
          age: [Err.ValueOutSideRange.msg()],
          score: [Err.KeyInSchemaNotInObj.msg()]
        }
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
});
