%{
parseTree = require('./parse-tree');

Word = parseTree.Word
Program = Word.Program
StructureDefinition = Word.StructureDefinition
StructureIdentifier = Word.StructureIdentifier
StructureBody = Word.StructureBody
PairDefinition = Word.PairDefinition
PairComponentKey = Word.PairComponentKey
PairComponentValue = Word.PairComponentValue

Str = Word.Str
Num = Word.Num
Bool = Word.Bool
Ref = Word.Ref
Obj = Word.Obj
Arr = Word.Arr
Any = Word.Any
Fn = Word.Fn
AbEq = Word.AbEq
UFn = Word.UFn
Rec = Word.Rec

dim = null
collector = null
buffer = null
rcg = null /* rcg = recursiveCollectorGroup */
stack = []
valueDims = [];
ptrToCurrentRCG = null
pathRCG = null
rcgCount = 0
%}

%ebnf

%%

program
    : type_def* EOF                             { return parseTree.makeEntry(Program, { /* empty */ }, $1) }
    ;

type_def
    : TYPEDEF S_ID def_body                     { $$ = parseTree.makeEntry(StructureDefinition, {},
                                                    [parseTree.makeEntry(StructureIdentifier, { type: $1, id: $2 }), $3]) }
    ;

def_body
    : OPEN_CURB pair+ CLOSE_CURB                -> parseTree.makeEntry(StructureBody, {}, $2)
    ;

pair
    : OPTIONAL pair_def                         -> parseTree.makeEntry(PairDefinition, { isOptional: true }, $2)
    | pair_def                                  -> parseTree.makeEntry(PairDefinition, { isOptional: false }, $1)
    ;

pair_def
    : str_key COLON str_value COMMA?            { $$ = [ parseTree.makeEntry(PairComponentKey, { type: Str, id: $1 }),
                                                          parseTree.makeEntry(PairComponentValue, $3) ] }
    | num_key COLON num_value COMMA?            { $$ = [ parseTree.makeEntry(PairComponentKey, { type: Num, id: $1 }),
                                                          parseTree.makeEntry(PairComponentValue, $3) ] }
    | bool_key COLON bool_value COMMA?          { $$ = [ parseTree.makeEntry(PairComponentKey, { type: Bool, id: $1 }),
                                                          parseTree.makeEntry(PairComponentValue, $3) ] }
    | ref_key COLON ref_value COMMA?            { $$ = [ parseTree.makeEntry(PairComponentKey, { type: Ref, typeArgs: $1[0], id: $1[1] }),
                                                           parseTree.makeEntry(PairComponentValue, $3) ] }
    | obj_key COLON obj_value COMMA?            { $$ = [ parseTree.makeEntry(PairComponentKey, { type: Obj, id: $1 }),
                                                           parseTree.makeEntry(PairComponentValue, $3) ] }
    | str_arr_key COLON str_arr_value COMMA?    { $$ = [ parseTree.makeEntry(PairComponentKey, { type: Arr, id: $1 }),
                                                           parseTree.makeEntry(PairComponentValue, $3) ] }
    | any_key COLON any_value COMMA?            { $$ = [ parseTree.makeEntry(PairComponentKey, { type: Any, id: $1 }),
                                                       parseTree.makeEntry(PairComponentValue, $3) ] }
    ;

str_key
    : STR attr                                  { $$ = $2 }
    ;

num_key
    : NUM attr                                  { $$ = $2 }
    ;

bool_key
    : BOOL attr                                 { $$ = $2 }
    ;

ref_key
    : REFERENCE S_ID attr                       { $$ = [$2, $3] }
    ;

obj_key
    : OBJ attr                                  { $$ = $2 }
    ;

str_arr_key
    : sqb+ str_key                              { dim = $1.length; $$ = $2 }
    ;

sqb
    : OPEN_SQB CLOSE_SQB
    ;

any_key
    : ANY attr                                  { $$ = $2 }
    ;

attr
    : TEXT                                      { $$ = yytext.replace(/^"|"$/g, ''); (collector && collector.push($$)); }
    ;

str_arr_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,  value: $1 }) }
    | str_arr_body_valid                        { $$ = ({ type: Fn,  value: $1 }) }
    | (UNORDERED | CTX_USER_FN) str_arr_body_valid
    ;

str_arr_body_valid
    : str_arr_body                              {
                                                    buffer = rcg;
                                                    // rcgCount and stack would reset to ideal count here
                                                    rcg = null;
                                                    ptrToCurrentRCG = null;
                                                    dimEqstatus = valueDims.reduce(
                                                        (carry, val) => val === carry ? carry : -1,
                                                        dim
                                                    );
                                                    if (dimEqstatus === -1) {
                                                        throw new Error('Array dimension does not match');
                                                    }
                                                    valueDims.length = 0;
                                                    $$ = buffer
                                                }
    ;

str_arr_body
    : open_sqb_hook attr? (COMMA attr)* close_sqb_hook
                                                { $$ = rcg }
    | open_sqb_hook str_arr_body (COMMA str_arr_body)* close_sqb_hook
                                                { $$ = rcg }
    ;

open_sqb_hook
    : OPEN_SQB                                  {
                                                    ptrToCurrentRCG = [];
                                                    if (parent = stack[stack.length - 1]) {
                                                        delete parent.__leaf__;
                                                        parent.push(ptrToCurrentRCG);
                                                    } else {
                                                        // Start of stack. Root.
                                                        rcg = ptrToCurrentRCG 
                                                    }
                                                    // Assign a leaf flag which later be deleted if the node becomes
                                                    // parent
                                                    ptrToCurrentRCG.__leaf__ = true;
                                                    stack.push(ptrToCurrentRCG);
                                                    collector = ptrToCurrentRCG;
                                                    rcgCount += 1;
                                                }
    ;

close_sqb_hook
    : CLOSE_SQB                                 {
                                                    abductedNode = stack.splice(stack.length - 1, 1)[0];
                                                    if (abductedNode.__leaf__) {
                                                        valueDims.push(rcgCount);
                                                        delete abductedNode.__leaf__;
                                                    }
                                                    collector = null;
                                                    rcgCount -= 1;
                                                }
    ;


str_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,  value: $1 }) }
    | attr                                      { $$ = ({ type: Fn,  value: AbEq, args: [$1] }) }
    | REGEX                                     { $$ = ({ type: Fn,  value: AbEq, args: [$1, Word.Transformer.Str.Pattern] }) }
    | CTX_USER_FN                               { $$ = ({ type: UFn, value: $1 }) }
    ;

num_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,  value: $1 }) }
    | intervals                                 { $$ = ({ type: Fn,  value: $1 }) }
    | NUMERIC                                   { $$ = ({ type: Fn,  value: AbEq, args: [$1] }) }
    | CTX_USER_FN                               { $$ = ({ type: UFn, value: $1 }) }
    ;

intervals
    : (OPEN_BRAC | OPEN_SQB) NUMERIC? COMMA NUMERIC? (CLOSE_SQB | CLOSE_BRAC)
                                                { $$ = `${
                                                    $1 === "(" ? "lo" : "lc"
                                                }${
                                                    $5 === ")" ? "ro" : "rc"
                                                }Range,${$2 || null},${$4 || null}` }
    ;

bool_value
    : IDENTITY                                  { $$ = ({ type: Fn,   value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,   value: $1 }) }
    | TRUE                                      { $$ = ({ type: Fn,   value: AbEq, args: [$1] }) }
    | TRUTHY                                    { $$ = ({ type: Fn,   value: $1 }) }
    | FALSE                                     { $$ = ({ type: Fn,   value: AbEq, args: [$1] }) }
    | FALSY                                     { $$ = ({ type: Fn,   value: $1 }) }
    | CTX_USER_FN                               { $$ = ({ type: UFn,  value: $1 }) }
    ;

ref_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,  value: $1 }) }
    | CTX_USER_FN                               { $$ = ({ type: UFn, value: $1 }) }
    ;

obj_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,  value: $1 }) }
    | def_body                                  { $$ = ({ type: Rec, value: $1 }) }
    | CTX_USER_FN                               { $$ = ({ type: UFn, value: $1 }) }
    ;

any_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,  value: $1 }) }
    ;

%%
