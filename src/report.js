const report = {};

report.Code = {
  TypeNotFound: { Value: 0x00, Msg: "Type not found" }
};

report.panic = function(code, arg) {
  arg = arg || {};

  new Error(report.Code[code].Msg);
};

module.exports = report;
