const xprt = (module.exports = {});

function toBinary(dec) {
  // Only for positives
  // https://stackoverflow.com/a/16155417/2474269
  let n = dec.toString(2);
  // Zerofill to make fixed width 32 bit rep of str
  let r;
  if ((r = 8 - n.length)) {
    n =
      Array.from({ length: r })
        .map(() => 0)
        .join("") + n;
  }

  return n;
}

xprt.getEnumInf = enumAST => {
  const keys = Object.keys(enumAST);
  const sample = enumAST[keys[0]];
  return {
    type: sample.typeProcessor[1],
    typeArgs: sample.typeProcessor[2],
    typeProcessor: sample.typeProcessor,
    fn: sample.valueResolver[1],
    ns: sample.valueResolver[3].ns
  };
};

xprt.isSimpleObj = obj =>
  typeof obj === "object" && obj !== null && obj.constructor.name === "Object";

xprt.isArray = obj => obj instanceof Array;

xprt.hashOfStr = str => {
  // Will emulate a 32bit integer in JS. Hence groups 4 character of 1byte at once to create 4bytes word.
  words = str
    .split("")
    .reduce((seq, val, i) => {
      if (!(i % 4)) {
        // Create a word with 4bytes
        seq.push("");
      }

      seq[seq.length - 1] += toBinary(val.charCodeAt(0));
      return seq;
    }, [])
    .map(v => parseInt(v, 2));

  // Rotation = int hash value (sum below)  / 2 ^ 32 ; to figure out if the final hash is greater than
  // 2^32 and we have to break it down to multiple int (to represent the same int), how many such break
  // has happened. This carries the extra informaiton in a rare case when hash1st is same for two such strs
  let rotation = 0;
  // Total size 2^32 which is represented as signed int
  const L = Math.pow(2, 31);
  hash1st = words.reduce((sum, val, i) => {
    sum += val;

    if (sum >= L) {
      rotation++;
      // For int overflow, reduce it to two's complement
      sum -= 2 * L;
    }

    return sum;
  }, 0);

  return `${hash1st}.${rotation}`;
};

xprt.hashOfObj = obj => {
  // Little thing I didn't know. In JS JSON.stringify preserves the order in which an object was created
  const sObj = (function rec(member) {
    if (xprt.isArray(member)) {
      let i = 0;
      let item;
      for (; (item = member[i++]); ) {
        member[i - 1] = rec(item);
      }

      return member;
    } else if (xprt.isSimpleObj(member)) {
      let key;
      let value;
      const sortedObj = {};
      const sortedKeys = Object.keys(member).sort();

      for (key of sortedKeys) {
        value = member[key];
        sortedObj[key] = rec(value);
      }

      return sortedObj;
    } else {
      return member;
    }
  })(obj);

  const objStr = JSON.stringify(sObj);
  return xprt.hashOfStr(objStr);
};
