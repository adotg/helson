const Word = require("./parse-tree").Word;

const failFn = () => false;

function itrFactory(ast, mount, matchObj) {
  const resp = {};
  const l = {
    enter: [],
    exit: [],
    keyvisited: []
  }; // Listeners
  const reports = {};

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
    if (typeof msg === "string") {
      reports[key] = reports[key] || [];
      reports[key].push(msg);
    } else if (Object.keys(msg).length) {
      // For nested object, it's mounted directly on the key
      reports[key] = msg;
    }
  };

  resp.getCompleteReport = () => reports;

  resp.inst = () => {
    const resp2 = {};
    const store = {};
    let matchObjKeys = null;
    let i = 0;

    if (!(mount in ast)) {
      // report to err
    }

    const mountedAST = ast[mount];
    resp2.next = () => {
      let isDone = false;
      // Overflow is the situation where the match (input) object has a key but the schema does not have the key
      let overflow = false;
      let key;
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
          fn(mountedAST[key] /* undefined for an overflow */, key, store)
        );
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

function verifier(ast, matchObj, config, context) {
  const sysContext = context.get(context.NS.System);

  const finalStatus = (function rec(itrBase) {
    const optionalityStatusGetter = sysContext.isOptional(itrBase);
    let typeStatusGetter = failFn;
    let valueStatusGetter = failFn;

    const itr = itrBase.inst();
    let done, item, fnSig;
    let localStatusCollection = [];
    while ((({ done, overflow, item } = itr.next()), !done)) {
      let nestedResp;

      if (overflow) {
        continue;
      }

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

        case Word.Ref:
          nestedResp = rec(
            itrFactory(ast, item.astVal.typeProcessor[1], matchObj[item.key])
          );
          // TODO right now iterators are not nested, only reports are nested. Not sure if this is the corrent
          // way of handling nested object reporting
          typeStatusGetter = () => nestedResp[0];
          itrBase.report(item.key, nestedResp[1]);
          break;
      }

      // TODO if type checking fails continue, don't proceed to value checking

      // Value checking
      switch (item.astVal.valueResolver[0]) {
        case Word.Fn:
        case Word.UFn:
          fnSig = item.astVal.valueResolver[1].split(",");
          valueStatusGetter = sysContext[fnSig[0]](
            item,
            fnSig.slice(1),
            {
              matchObj,
              ast
            },
            itrBase
          );
          break;

        case Word.Abs:
          valueStatusGetter = sysContext.equal(
            item,
            [item.astVal],
            { matchObj, ast },
            itrBase
          );
          break;
      }

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

module.exports = verifier;
