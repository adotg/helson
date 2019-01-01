const parser = require("./helson").parser;
const transformer = require("./transformer");
const { verifier } = require("./verifier");
const { isSimpleObj } = require("./utils");

function makeEligibleContext(proposedCtx) {
  const eligibleContext = {};
  let key;
  let atLeaseOne = false;
  if (!isSimpleObj(proposedCtx)) {
    return null;
  }

  for (key in proposedCtx) {
    if (
      !proposedCtx.hasOwnProperty(key) ||
      typeof proposedCtx[key] !== "function"
    ) {
      continue;
    }

    atLeaseOne = true;
    eligibleContext[key] = proposedCtx[key];
  }

  if (!atLeaseOne) {
    return null;
  }

  return eligibleContext;
}

function helson(schemaInStr) {
  const resp = {};

  const context = require("./context").createContext();
  const pt = parser.parse(schemaInStr);
  const ast = transformer(pt);

  resp.context = ctxDef => {
    context.set(makeEligibleContext(ctxDef));
    return resp;
  };

  resp.match = (matchObj, matchWithIdentifier, localContext) => {
    localContext = makeEligibleContext(localContext);
    context.setLocal(localContext);
    return verifier(ast, matchObj, { mount: matchWithIdentifier }, context);
  };

  return resp;
}

module.exports = helson;

/*
 * Expected usage:
 * helson(text).context({}).for(name).match(obj, { context: {}})
 */
