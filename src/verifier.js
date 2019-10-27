const { Word } = require("./parse-tree");
const { getEnumInf, hashOfObj } = require("./utils");

const failFn = () => false;
const passFn = () => true;

// WARN This function hosts structrual assumption and implements a workaround to detect enum,
// thereby reducing the dynamic behaviour of the verifier. For the the time being it works.
// For future for any scalability issue check if the resolve process of
// enum could be done from parser (towards the top of the lib) / or from any other place instead
// of calling it from verification phrase
function recursiveTypeResolve(item, ast) {
  let enumName;
  let enumInf;
  let vr;

  if (item.typeProcessor[0] === Word.Enum) {
    enumName = item.typeProcessor[2];
    enumInf = getEnumInf(ast[Word.Enum][enumName]);
    item.typeProcessor = enumInf.typeProcessor.slice(1);
    vr = item.valueResolver;
    if (vr[0] === Word.Ref) {
      // Link enum member's valueResolver as the input value (match object's) value will be tested against
      item.valueResolver = ast[Word.Enum][enumName][vr[1]].valueResolver;
    }
  }

  return item;
}

function itrFactory(ast, mount, matchObj) {
  const resp = {};
  const l = {
    enter: [],
    exit: [],
    keyvisited: []
  }; // Listeners
  const reports = {};

  let prefix;

  // TODO not the best way of detecting array, but hey it's okay for the time being
  if (typeof mount === "string") {
    if (mount in ast[Word.TypeDef]) {
      prefix = Word.TypeDef;
    } else if (mount in ast[Word.OList]) {
      prefix = Word.OList;
    } else if (mount in ast[Word.Enum]) {
      prefix = Word.Enum;
    } else {
      throw new Error(`
        The type definition \`${mount}\` you wanted to use as a schema is not found.
        It's case sensitive, please make sure the case matches with the definition.
        Please make sure the spelling is correct.
      `);
    }
  } else if (mount.astVal.typeProcessor[0] === Word.Arr) {
    prefix = Word.Arr;
  } else {
    throw new Error(`Unknown mount type. You should not get this issue.`);
  }

  resp.subentry = () => prefix === Word.Enum || prefix === Word.Arr;

  resp.on = (phrase, fn) => {
    phrase = phrase.toLowerCase();
    if (!(phrase in l)) {
      return;
    }

    const index = l[phrase].push(fn) - 1;
    return ((i, ph) => () => l[ph].splice(i, 1))(index, phrase);
  };

  // TODO temporary. Collect all the keys in error reporter
  resp.report = (key, msg) => {
    // TODO this is a brute force way of gathering report. Currently, probably works, but this should ideally have an
    // semantics to compose report
    if (typeof msg === "string" && !msg.trim()) {
      return;
    } else if (msg instanceof Array && !msg.length) {
      return;
    } else if (!Object.keys(msg).length) {
      return;
    }

    reports[key] = reports[key] || [];
    reports[key].push(msg);
  };

  resp.getCompleteReport = () => reports;

  resp.inst =
    prefix === Word.Arr
      ? () => {
          const resp2 = {};
          const store = {};
          const dim = mount.astVal.typeProcessor.filter(
            type => type === Word.Arr
          ).length;
          let currentDim = 0;
          let i = 0;

          resp2.next = () => {
            const key = i;
            let isDone = false;
            let overflow = false;
            let value;
            let astVal = mount.astVal;
            let expectedArr;

            if (i === 0) {
              currentDim++;
              l.enter.forEach(fn => fn(astVal, store));

              if (!astVal.stackOfTypeProcessor) {
                astVal.stackOfTypeProcessor = [];
              }

              if (!astVal.stackOfValueResolver) {
                astVal.stackOfValueResolver = [];
              }
              astVal.stackOfTypeProcessor.push(astVal.typeProcessor);
              // Create a new version of the resolver before saving, as the resolver might get mutated based on  the
              // type
              astVal.stackOfValueResolver.push(astVal.valueResolver);

              // Removes the first element `Arr` as iterator makes element to element type and equality checking
              astVal.typeProcessor = astVal.typeProcessor.slice(1);
              astVal.valueResolver = astVal.valueResolver.slice(0);
            }

            if (i === matchObj.length) {
              currentDim--;
              // The last most key in the object
              l.exit.forEach(fn => fn(astVal, store));
              astVal.typeProcessor = astVal.stackOfTypeProcessor.splice(
                astVal.stackOfTypeProcessor.length - 1,
                1
              )[0];
              astVal.valueResolver = astVal.stackOfValueResolver.splice(
                astVal.stackOfValueResolver.length - 1,
                1
              )[0];
              if (!astVal.stackOfTypeProcessor.length) {
                delete astVal.stackOfTypeProcessor;
              }
              if (!astVal.stackOfValueResolver.length) {
                delete astVal.stackOfValueResolver;
              }
              isDone = true;
            } else {
              i++;
              value = matchObj[key];
              expectedArr =
                astVal.stackOfValueResolver[
                  astVal.stackOfValueResolver.length - 1
                ][2];
              if (expectedArr instanceof Array) {
                if (key >= expectedArr[0].length) {
                  overflow = true;
                }

                astVal.valueResolver[2] = [expectedArr[0][key]];
              }
            }

            return {
              done: isDone,
              overflow,
              item: {
                dim,
                currentDim,
                value,
                astVal,
                key,
                store
              }
            };
          };

          return resp2;
        }
      : () => {
          const resp2 = {};
          const store = {};
          let matchObjKeys = null;
          let i = 0;

          const mountedAST = ast[prefix][mount];
          resp2.next = () => {
            let isDone = false;
            // Overflow is the situation where the match (input) object has a key but the schema does not have the key
            let overflow = false;
            let key;

            switch (prefix) {
              case Word.OList:
                if (i === 0) {
                  // If the iteration is beginning, call the hooks and do preprocessing
                  l.enter.forEach(fn => fn(mountedAST, store));
                }

                if (i === matchObj.length) {
                  // The last most key in the object
                  l.exit.forEach(fn => fn(mountedAST, store));
                  isDone = true;
                } else {
                  key = i++; /* index for an array */

                  if (key >= mountedAST.length) {
                    overflow = true;
                  }

                  l.keyvisited.forEach(fn =>
                    fn(
                      mountedAST[key] /* undefined for an overflow */,
                      key,
                      store
                    )
                  );
                }
                break;
              case Word.TypeDef:
                if (i == 0) {
                  // If the iteration is beginning, call the hooks and do preprocessing
                  l.enter.forEach(fn => fn(mountedAST, store));

                  // Save the iterable keys
                  matchObjKeys = Object.keys(matchObj);
                }

                if (i === matchObjKeys.length) {
                  // The last most key in the object
                  l.exit.forEach(fn => fn(mountedAST, store));
                  isDone = true;
                } else {
                  key = matchObjKeys[i++];
                  if (!(key in mountedAST)) {
                    overflow = true;
                  }
                  l.keyvisited.forEach(fn =>
                    fn(
                      mountedAST[key] /* undefined for an overflow */,
                      key,
                      store
                    )
                  );
                }
                break;
              default:
                throw new Error(`
                Can't use \`${prefix}\` type as schema.
                Only type definition of an ordered list and object can be used as a schema. 
              `);
            }

            return {
              done: isDone,
              overflow,
              item: {
                value: matchObj[key],
                astVal: mountedAST[key],
                key,
                store
              }
            };
          };

          return resp2;
        };

  return resp;
}

function postTransformationMutator(ast, context) {
  const enumItrbls = (ast[Word.EnumIterables] = ast[Word.EnumIterables] || {});
  /* verifier + mutator */
  return () => {
    const enums = ast[Word.Enum];
    let item;
    let eachDefs;
    let valResolver;
    let eachEnum;
    let enumInf;
    let iterables;
    let enumName;

    [Word.TypeDef, Word.OList].forEach(defs => {
      for (item in ast[defs]) {
        if (!ast[defs].hasOwnProperty(item)) {
          continue;
        }
        let key;
        eachDefs = ast[defs][item];
        for (key in eachDefs) {
          if (eachDefs[key].typeProcessor[0] === Word.Ref) {
            if ((enumName = eachDefs[key].typeProcessor[1]) in ast[Word.Enum]) {
              eachDefs[key].typeProcessor.unshift(Word.Enum);
              // If identity (pass) fn is used in schema for enum reference, replace it with enumLookup fn
              let val = eachDefs[key].valueResolver;
              if (val[0] === Word.Fn && val[1] === Word.Identity) {
                // Pass the enum name as part of the args of context fn. Probably not the best way of injecting the
                // name. By here we go. This is done because during verification the enum member's typeProcessor changes
                // to more fundamental type
                val[1] = `${Word.EnumLookup},${enumName}`;
              }
            }
          }
        }
      }
    });

    for (item in enums) {
      eachEnum = enums[item];
      enumInf = getEnumInf(eachEnum);
      iterables = enumItrbls[item] = enumItrbls[item] || {};

      if (enumInf.type === Word.Ref) {
        // For reference type, verification from transformation is required as the parser returns the value
        // as is from the tokenizer
        let key;
        let proxyValue;
        for (key in eachEnum) {
          valResolver = eachEnum[key].valueResolver;
          try {
            proxyValue = JSON.parse(valResolver[2]);
          } catch (e) {
            throw new Error(`
              For key \`${key}\` in enum definition \`${item}\`:
              Value can not be parsed to form a JavaScript object.
              Value should be readable by \`JSON.parse\`.
              Original error thrown by \`JSON.parse\`
              ${e}
            `);
          }

          const status = verifier(
            ast,
            proxyValue,
            { mount: enumInf.typeArgs },
            context
          );
          if (!status[0]) {
            // If enum definition itself does not comply the schema of the referece type
            throw new Error(`
              For key \`${key}\` in enum definition \`${item}\`:
              Value does not comply to the type definition of \`${
                enumInf.typeArgs
              }\`.
              Mismatch details:
              ${JSON.stringify(status[1], null, 2)}
            `);
          } else {
            // Save the hash of the object
            iterables[hashOfObj(proxyValue)] = 1;
          }
        }
      } else {
        // For other primitive types directly extracts the member as iterables. Verification is already completed from
        // parser, hence explicit verification is not required
        let key;
        for (key in eachEnum) {
          valResolver = eachEnum[key].valueResolver;
          iterables[valResolver[2][0]] = 1;
        }
      }
    }
  };
}

function verifier(ast, matchObj, config, context) {
  const sysContext = context.get(context.NS.System);
  const userContext = context.get(context.NS.User);
  const localContext = context.get(context.NS.Local);

  const finalStatus = (function rec(itrBase) {
    const optionalityStatusGetter = itrBase.subentry()
      ? passFn
      : sysContext.isOptional(itrBase);
    let typeStatusGetter = failFn;
    let valueStatusGetter = failFn;

    const itr = itrBase.inst();
    let done;
    let item;
    let fnSig;
    let localStatusCollection = [];
    let fn;
    while ((({ done, overflow, item } = itr.next()), !done)) {
      let nestedResp;

      if (overflow) {
        continue;
      }

      recursiveTypeResolve(item.astVal, ast);
      // Type checking
      switch (item.astVal.typeProcessor[0]) {
        case Word.Str:
          typeStatusGetter = sysContext[Word.StrChkFn](
            item,
            [],
            { matchObj, ast },
            itrBase
          );
          break;

        case Word.Num:
          typeStatusGetter = sysContext[Word.NumChkFn](
            item,
            [],
            { matchObj, ast },
            itrBase
          );
          break;

        case Word.Bool:
          typeStatusGetter = sysContext[Word.BoolChkFn](
            item,
            [],
            { matchObj, ast },
            itrBase
          );
          break;

        case Word.Arr:
          typeStatusGetter = sysContext[Word.ArrChkFn](
            item,
            [],
            { matchObj, ast },
            itrBase
          );

          if (typeStatusGetter()) {
            nestedResp = rec(itrFactory(ast, item, item.value));
            typeStatusGetter = () => nestedResp[0];
            itrBase.report(item.key, nestedResp[1]);
          }
          break;

        case Word.Ref:
          nestedResp = rec(
            itrFactory(ast, item.astVal.typeProcessor[1], item.value)
          );
          // TODO right now iterators are not nested, only reports are nested. Not sure if this is the correct
          // way of handling nested object reporting
          typeStatusGetter = () => nestedResp[0];
          itrBase.report(item.key, nestedResp[1]);
          break;

        case Word.Any:
          typeStatusGetter = sysContext[Word.Identity]();
          break;
      }

      // TODO if type checking fails continue, don't proceed to value checking

      // Value checking
      fnSig = item.astVal.valueResolver[1].split(",");
      switch (item.astVal.valueResolver[0]) {
        case Word.Fn:
          fn = sysContext[fnSig[0]];
          break;
        case Word.UFn:
          fn = localContext[fnSig[0]] || userContext[fnSig[0]];
          break;
      }

      valueStatusGetter = fn(
        item,
        [...fnSig.slice(1), ...(item.astVal.valueResolver[2] || [])],
        {
          matchObj,
          ast
        },
        itrBase
      );

      localStatusCollection.push(typeStatusGetter() && valueStatusGetter());
    }

    return [
      [optionalityStatusGetter(), ...localStatusCollection].reduce(
        (runningStatus, val) => runningStatus && val,
        true
      ),
      itrBase.getCompleteReport()
    ];
  })(itrFactory(ast, config.mount, matchObj));

  return finalStatus;
}

module.exports = { verifier, postTransformationMutator };
