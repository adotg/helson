const expect = require("chai").expect;
const { hashOfObj } = require("../src/utils");

describe("#hashOfObj", () => {
  it("should generate hash for an object", () => {
    const o = {
      id: "GoW",
      studio: "Santa Monica Studio",
      rating: {
        commonSenseMedia: 1,
        IGN: 1,
        _isScoreNormalized: true
      }
    };
    const hash = hashOfObj(o);
    expect(hash).to.equal("-2095591045.10");
  });

  it("should generate similar hash for same object", () => {
    const o = {
      id: "GoW",
      studio: "Santa Monica Studio",
      rating: {
        commonSenseMedia: 1,
        IGN: 1,
        _isScoreNormalized: true
      }
    };
    expect(hashOfObj(o)).to.equal(hashOfObj(o));
  });

  it("should generate similar hash for two object have different order of members", () => {
    const o1 = {
      id: "GoW",
      studio: "Santa Monica Studio",
      rating: {
        commonSenseMedia: 1,
        IGN: 1,
        ratingScale: [0, 0.2, 0.5, 0.75, 1],
        _isScoreNormalized: true
      }
    };

    const o2 = {
      rating: {
        _isScoreNormalized: true,
        commonSenseMedia: 1,
        ratingScale: [0, 0.2, 0.5, 0.75, 1],
        IGN: 1
      },
      studio: "Santa Monica Studio",
      id: "GoW"
    };

    expect(hashOfObj(o1)).to.equal(hashOfObj(o2));
  });

  it("should generate different hash for two objects even if they have slightly different value", () => {
    const o1 = {
      id: "GoW",
      studio: "Santa Monica Studio",
      rating: {
        commonSenseMedia: 1,
        IGN: 1,
        ratingScale: [0, 0.2, 0.5, 0.75, 1],
        _isScoreNormalized: true
      }
    };

    const o2 = {
      rating: {
        _isScoreNormalized: true,
        commonSenseMedia: 1,
        ratingScale: [0, 0.25, 0.51, 0.75, 1],
        IGN: 1
      },
      studio: "Santa Monica Studio",
      id: "GoW"
    };

    expect(hashOfObj(o1)).to.not.equal(hashOfObj(o2));
  });

  it("should generate different hash for two objects even if they have slightly different keys", () => {
    const o1 = {
      id: "GoW",
      studio: "Santa Monica Studio",
      rating: {
        commonSenseMedia: 1,
        IGn: 1,
        _isScoreNormalized: true
      }
    };

    const o2 = {
      rating: {
        _isScoreNormalized: true,
        commonSenseMedia: 1,
        IGN: 1
      },
      studio: "Santa Monica Studio",
      id: "GoW"
    };

    expect(hashOfObj(o1)).to.not.equal(hashOfObj(o2));
  });

  it("should generate same hash for object containing array members where the items of arrays are object in different order", () => {
    const o1 = {
      id: "GoW",
      studio: "Santa Monica Studio",
      ratings: [
        { platform: "CommonSenseMedia", scale: 5, score: 5 },
        { platform: "IGN", scale: 10, score: 10 }
      ]
    };

    const o2 = {
      id: "GoW",
      studio: "Santa Monica Studio",
      ratings: [
        { platform: "CommonSenseMedia", scale: 5, score: 5 },
        { scale: 10, score: 10, platform: "IGN" }
      ]
    };

    expect(hashOfObj(o1)).to.equal(hashOfObj(o2));
  });
});
