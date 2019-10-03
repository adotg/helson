const chai = require("chai");
const { expect } = chai;

describe("Program With simple Objects", () => {
  const pt = require("../src/parse-tree");
  const { Word, Enum } = pt;

  const structId = pt.makeEntry(Word.StructureIdentifier, {
    name: "Person ",
    type: Enum.StructureType.TypeDef
  });

  const keyOfPairDef1 = pt.makeEntry(Word.PairComponentKey, {
    type: "str",
    id: "test_key"
  });

  const valueOfPairDef1 = pt.makeEntry(Word.PairComponentValue, {
    type: "absolute",
    value: "test_value"
  });

  const keyOfPairDef2 = pt.makeEntry(Word.PairComponentKey, {
    type: "num",
    id: "test_key"
  });

  const valueOfPairDef2 = pt.makeEntry(Word.PairComponentValue, {
    type: "fn",
    value: "lorcrange 10 11"
  });

  const pairDef1 = pt.makeEntry(Word.PairDefinition, { isOptional: false }, [
    keyOfPairDef1,
    valueOfPairDef1
  ]);

  const pairDef2 = pt.makeEntry(Word.PairDefinition, { isOptional: true }, [
    keyOfPairDef2,
    valueOfPairDef2
  ]);

  const structBody = pt.makeEntry(Word.StructureBody, {}, [pairDef1, pairDef2]);

  const program = pt.makeEntry(Word.Program, {}, [structId, structBody]);

  it("should match", () => {
    expect(program).to.deep.equal({
      nodeType: Word.Program,
      properties: {},
      children: [
        {
          nodeType: Word.StructureIdentifier,
          properties: {
            name: "Person ",
            type: Enum.StructureType.TypeDef
          },
          children: []
        },
        {
          nodeType: Word.StructureBody,
          properties: {},
          children: [
            {
              nodeType: Word.PairDefinition,
              properties: { isOptional: false },
              children: [
                {
                  nodeType: Word.PairComponentKey,
                  properties: {
                    type: "str",
                    id: "test_key"
                  },
                  children: []
                },
                {
                  nodeType: Word.PairComponentValue,
                  properties: {
                    type: "absolute",
                    value: "test_value"
                  },
                  children: []
                }
              ]
            },
            {
              nodeType: Word.PairDefinition,
              properties: { isOptional: true },
              children: [
                {
                  nodeType: Word.PairComponentKey,
                  properties: {
                    type: "num",
                    id: "test_key"
                  },
                  children: []
                },
                {
                  nodeType: Word.PairComponentValue,
                  properties: {
                    type: "fn",
                    value: "lorcrange 10 11"
                  },
                  children: []
                }
              ]
            }
          ]
        }
      ]
    });
  });
});

