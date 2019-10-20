/*
 * Methods like
 * isStr, isNum, isBool, isRef
 *
 * Whenever isRef is called, it recursively checks linked node
 */

const KeyPresence = {
  Mandatory: 1,
  Optional: 2,
  Visited: -1,
  Overflow: -2
};

const isOptional = itr => {
  const iterableKeys = {};
  const releasables = [];
  const report = {};
  let i = 0;
  let status = true;

  releasables[i++] = itr.on("enter", mountedAST => {
    let key;
    for (key in mountedAST) {
      if (!mountedAST.hasOwnProperty(key)) {
        continue;
      }
      iterableKeys[key] = mountedAST[key].preProcessor[1]
        ? KeyPresence.Optional
        : KeyPresence.Mandatory;
    }
  });

  releasables[i++] = itr.on("keyVisited", (_, key) => {
    if (key in iterableKeys) {
      // If a key is present in the ast and it's visited, change the status to visited
      iterableKeys[key] = KeyPresence.Visited;
    } else {
      // If a key is not present in the ast and it's visited, then it's an additional key which is
      // reported as overflow
      iterableKeys[key] = KeyPresence.Overflow;
    }
  });

  releasables[i++] = itr.on("exit", () => {
    let key;
    for (key in iterableKeys) {
      if (!iterableKeys.hasOwnProperty(key)) {
        continue;
      }

      if (iterableKeys[key] === KeyPresence.Mandatory) {
        // All mandatory non optional key needs to be visited, if even one mandatory key is not visited report error
        status = false;
        itr.report(
          key,
          "Non optional Key present in schema but not in input object"
        );
      } else if (iterableKeys[key] === KeyPresence.Overflow) {
        status = false;
        itr.report(key, "Key present in input object but not in schema");
      }
    }
  });

  return () => {
    // release listeners before the function returns, as there is no need for this
    releasables.forEach(fn => fn());
    return status;
  };
};

const pass = () => () => true;

const _rangeNormalizer = range => {
  range = range.map(v => (v === "null" ? null : parseInt(v, 10)));
  if (range[0] === null) {
    range[0] = Number.NEGATIVE_INFINITY;
  }

  if (range[1] === null) {
    range[1] = Number.POSITIVE_INFINITY;
  }

  return range;
};

// left close right close range
const lcrcRange = ({ value, key }, args, _, itr) => {
  let result;

  args = _rangeNormalizer(args);
  result = value >= args[0] && value <= args[1];

  if (!result) {
    itr.report(key, "Value outside range");
  }

  return () => result;
};

const lorcRange = ({ value, key }, args, _, itr) => {
  let result;

  args = _rangeNormalizer(args);
  result = value > args[0] && value <= args[1];
  if (!result) {
    itr.report(key, "Value outside range");
  }

  return () => result;
};

const loroRange = ({ value, key }, args, _, itr) => {
  let result;

  args = _rangeNormalizer(args);
  result = value > args[0] && value < args[1];
  if (!result) {
    itr.report(key, "Value outside range");
  }

  return () => result;
};

const lcroRange = ({ value, key }, args, _, itr) => {
  let result;

  args = _rangeNormalizer(args);
  result = value >= args[0] && value < args[1];
  if (!result) {
    itr.report(key, "Value outside range");
  }

  return () => result;
};

const isStr = ({ value, key }, _, __, itr) => {
  const result = typeof value === "string";
  if (!result) {
    itr.report(key, `Value of type string expected; received ${typeof value}`);
  }

  return () => result;
};

const isNum = ({ value, key }, _, __, itr) => {
  const result = typeof value === "number";
  if (!result) {
    itr.report(key, `Value of type number expected; received ${typeof value}`);
  }

  return () => result;
};

const isBool = ({ value, key }, _, __, itr) => {
  const result = typeof value === "boolean";
  if (!result) {
    itr.report(key, `Value of type boolean expected; received ${typeof value}`);
  }

  return () => result;
};

const assign = () => {
  const result = {};

  return ({ value, key }) => {
    result[key] = value;
    return result;
  };
};

const abEq = ({ value }, args, __, itr) => {
  const result = value === args[0];

  if (!result) {
    itr.report(
      key,
      `Values not equal; expected: ${args[0]}, received: ${value}`
    );
  }

  return () => result;
};

const context = {};

context.NS = {
  System: 0,
  User: 1
};

context.def = {
  [context.NS.System]: {
    isOptional,
    lcrcRange,
    lorcRange,
    loroRange,
    lcroRange,
    pass,
    isStr,
    isNum,
    isBool,
    assign,
    abEq
  },
  [context.NS.User]: {}
};

context.get = ns => context.def[ns];

context.set = userConfig => (context.def[context.NS.User] = userConfig);

module.exports = context;
