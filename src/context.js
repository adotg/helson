/*
 * Methods like
 * isStr, isNum, isBool, isRef
 *
 * Whenever isRef is called, it recursively checks linked node
 */

const Err = require("./err");
const { Word } = require("./parse-tree");
const { isArray, isSimpleObj, hashOfObj } = require("./utils");

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
        itr.report(key, Err.KeyInSchemaNotInObj.msg());
      } else if (iterableKeys[key] === KeyPresence.Overflow) {
        status = false;
        itr.report(key, Err.KeyInObjNotInSchema.msg());
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
    itr.report(key, Err.ValueOutSideRange.msg());
  }

  return () => result;
};

const lorcRange = ({ value, key }, args, _, itr) => {
  let result;

  args = _rangeNormalizer(args);
  result = value > args[0] && value <= args[1];
  if (!result) {
    itr.report(key, Err.ValueOutSideRange.msg());
  }

  return () => result;
};

const loroRange = ({ value, key }, args, _, itr) => {
  let result;

  args = _rangeNormalizer(args);
  result = value > args[0] && value < args[1];
  if (!result) {
    itr.report(key, Err.ValueOutSideRange.msg());
  }

  return () => result;
};

const lcroRange = ({ value, key }, args, _, itr) => {
  let result;

  args = _rangeNormalizer(args);
  result = value >= args[0] && value < args[1];
  if (!result) {
    itr.report(key, Err.ValueOutSideRange.msg());
  }

  return () => result;
};

const isStr = ({ value, key }, _, __, itr) => {
  const result = typeof value === "string";
  if (!result) {
    itr.report(key, Err.ValueMismatch.msg("string", typeof value));
  }

  return () => result;
};

const isNum = ({ value, key }, _, __, itr) => {
  const result = typeof value === "number";
  if (!result) {
    itr.report(key, Err.ValueMismatch.msg("number", typeof value));
  }

  return () => result;
};

const isBool = ({ value, key }, _, __, itr) => {
  const result = typeof value === "boolean";
  if (!result) {
    itr.report(key, Err.ValueMismatch.msg("number", typeof value));
  }

  return () => result;
};

const abEq = ({ value, key }, args, __, itr) => {
  const result = value === args[0];

  if (!result) {
    itr.report(key, Err.ValueMismatch.msg(args[0], value));
  }

  return () => result;
};

const arrAbEq = (...params) => {
  const { dim, currentDim, value, key } = params[0];
  const itr = params[3];
  const args = params[1];
  if (dim && currentDim) {
    if (dim === currentDim) {
      return abEq(...params);
    }
  } else {
    if (args && args[0] instanceof Array && value.length !== args[0].length) {
      itr.report(
        key,
        Err.ArrayMembersDifferent.msg(args[0].length, value.length)
      );
      return () => false;
    }
  }

  return pass();
};

const enumLookup = ({ value, key }, args, { ast }, itr) => {
  let result = false;
  const enumName = args[0];

  // TODO this convertion of hash should not be presents inside validity checker function. The iterator (or ther top
  // level component) should hash compound object and push it down. However, here we are because of time
  if (isArray(value) || isSimpleObj(value)) {
    value = hashOfObj(value);
  }

  if (
    enumName in ast[Word.EnumIterables] &&
    ast[Word.EnumIterables][enumName][value] === 1
  ) {
    result = true;
  }

  if (!result) {
    itr.report(key, Err.ValueNotPresent.msg(value, enumName));
  }

  return () => result;
};

function createContext() {
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
      abEq,
      arrAbEq,
      enumLookup
    },
    [context.NS.User]: {},
    _local: {}
  };

  context.get = ns => context.def[ns];

  context.set = userCtx => {
    if (userCtx === null) {
      context.def[context.NS.User] = {};
    } else {
      context.def[context.NS.User] = userCtx;
    }
  };

  context.setLocal = localCtx => {
    if (localCtx === null) {
      context.def._local = {};
    } else {
      context.def._local = localCtx;
    }
  };

  return context;
}

module.exports = { createContext };
