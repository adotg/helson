const parser = require("./helson").parser;
const transformer = require("./transformer");
const verifier = require("./verifier");
const context = require("./context");

function exec(input) {
  return parser.parse(input);
}

const fs = require("fs");
const str = fs.readFileSync("../examples/ex1.schema").toString();
const pt = exec(str); // parse tree

fs.writeFileSync("./output.json", JSON.stringify(pt, null, 2));

const { ast, depGraph } = transformer(pt);
// const replacer = function(key, val) {
//   if (typeof val === "function") {
//     return val.toString();
//   }

//   return val;
// };
// console.log(JSON.stringify(resp, replacer, 2));
// console.log("============================");
// console.log(JSON.stringify(depGraph, null, 2));

const config = { mount: "Order1" };
const matchObj = {
  customer: {
    name: "Akash",
    age: 12
  },
  quantity: 10
};

const status = verifier(ast, matchObj, config, context);
console.log(JSON.stringify(status, null, 2));

/*
 * Expected usage:
 * helson(text).context({}).for(name).match(obj, { context: {}})
 */
