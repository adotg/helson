%{
/* Alert: https://stackoverflow.com/a/34339368/2474269 */

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
OList = Word.OList
Enum = Word.Enum
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

bits = 0x00
// RightToLeft
arrF = 0x01 // Array found

function setArrFoundBit() {
    bits = bits | arrF;
    return true;
}

function isArrFound() {
    return bits & arrF;
}

function resetFoundBits() {
    bits = 0x00;
}

function checkAndResetArrayDefEquality() {
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
}
%}

%ebnf

%%

program
    : structs* EOF                              { return parseTree.makeEntry(Program, { /* empty */ }, $1) }
    ;

structs
    : (TYPEDEF | OLIST) S_ID def_body           {
                                                    _arrFoundFlag = isArrFound()
                                                    resetFoundBits()
                                                    if ($1 === OList && _arrFoundFlag) {
                                                        throw new Error("An ordered list (olist) can't have unbounded array member")
                                                    } else if ($1 === Enum && _arrFoundFlag) {
                                                        throw new Error("An enum can't have unbounded array member")
                                                    }
                                                    $$ = parseTree.makeEntry(StructureDefinition, {},
                                                        [parseTree.makeEntry(StructureIdentifier, { type: $1, id: $2 }), $3])
                                                }
    | enum                                      { $$ = parseTree.makeEntry(StructureDefinition, {}, [$1[0] /* identifier */, $1[1] /* body */]) }
    ;

enum
    : ENUM S_ID STR str_enum_body               { $$ = [parseTree.makeEntry(StructureIdentifier, { type: $1, id: $2, typeArgs: Str  }), $4] }
    | ENUM S_ID NUM num_enum_body               { $$ = [parseTree.makeEntry(StructureIdentifier, { type: $1, id: $2, typeArgs: Num  }), $4] }
    | ENUM S_ID BOOL bool_enum_body             { $$ = [parseTree.makeEntry(StructureIdentifier, { type: $1, id: $2, typeArgs: Bool }), $4] }
    | ENUM S_ID REFERENCE S_ID obj_value        { $$ = [parseTree.makeEntry(StructureIdentifier, { type: $1, id: $2, typeArgs: Ref  }), $4] }
    ;

str_enum_body
    : OPEN_CURB str_pair* CLOSE_CURB            -> parseTree.makeEntry(StructureBody, {}, $2)
    ;

str_pair
    : attr COLON str_value COMMA?               {
                                                    $$ = parseTree.makeEntry(PairDefinition, {}, [
                                                        parseTree.makeEntry(PairComponentKey, { id: $1 }),
                                                        parseTree.makeEntry(PairComponentValue, $3)
                                                    ])
                                                }
    ;

num_enum_body
    : OPEN_CURB num_pair* CLOSE_CURB COMMA?     -> parseTree.makeEntry(StructureBody, {}, $2)
    ;

num_pair
    : attr COLON num_value COMMA?               {
                                                    $$ = parseTree.makeEntry(PairDefinition, {}, [
                                                        parseTree.makeEntry(PairComponentKey, { id: $1 }),
                                                        parseTree.makeEntry(PairComponentValue, $3)
                                                    ])
                                                }
    ;

bool_enum_body
    : OPEN_CURB bool_pair* CLOSE_CURB COMMA?    -> parseTree.makeEntry(StructureBody, {}, $2)
    ;

bool_pair
    : attr COLON bool_value COMMA?              {
                                                    $$ = parseTree.makeEntry(PairDefinition, {}, [
                                                        parseTree.makeEntry(PairComponentKey, { id: $1 }),
                                                        parseTree.makeEntry(PairComponentValue, $3)
                                                    ])
                                                }
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
    | str_arr_key COLON str_arr_value COMMA?    { setArrFoundBit(); $$ = [ parseTree.makeEntry(PairComponentKey, { type: Arr, typeArgs: Str, id: $1 }),
                                                        parseTree.makeEntry(PairComponentValue, $3) ] }
    | num_arr_key COLON num_arr_value COMMA?    { setArrFoundBit(); $$ = [ parseTree.makeEntry(PairComponentKey, { type: Arr, typeArgs: Num, id: $1 }),
                                                        parseTree.makeEntry(PairComponentValue, $3) ] }
    | bool_arr_key COLON bool_arr_value COMMA?  { setArrFoundBit(); $$ = [ parseTree.makeEntry(PairComponentKey, { type: Arr, typeArgs: Bool, id: $1 }),
                                                        parseTree.makeEntry(PairComponentValue, $3) ] }
    | ref_arr_key COLON ref_arr_value COMMA?    { setArrFoundBit(); $$ = [ parseTree.makeEntry(PairComponentKey, { type: Arr, typeArgs: $1[0][0], id: $1[0][1], dim: $1[1] }),
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
    : sqbs str_key                              { dim = $1.length; $$ = $2 }
    ;

num_arr_key
    : sqbs num_key                              { dim = $1.length; $$ = $2 }
    ;

bool_arr_key
    : sqbs bool_key                              { dim = $1.length; $$ = $2 }
    ;

ref_arr_key
    : sqbs ref_key                              {$$ = [$2, $1.length /* dimension */]}
    ;

sqbs
    : (OPEN_SQB CLOSE_SQB)+
    ;

any_key
    : ANY attr                                  { $$ = $2 }
    ;

attr
    : TEXT                                      { $$ = yytext.replace(/^"|"$/g, ''); collector && collector.push($$); }
    ;


str_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,  value: $1 }) }
    | attr                                      { $$ = ({ type: Fn,  value: AbEq, args: [$1] }) }
    | REGEX                                     { $$ = ({ type: Fn,  value: AbEq, args: [$1, Word.Transformer.Str.Pattern] }) }
    | CTX_USER_FN                               { $$ = ({ type: UFn, value: $1 }) }
    ;

str_arr_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,  value: $1 }) }
    | str_arr_body_valid                        { $$ = ({ type: Fn,  value: AbEq, args: [$1] }) }
    | (UNORDERED | CTX_USER_FN) str_arr_body_valid
                                                { $$ = ({ type: Fn,  value: $1, args: [$2] }) }
    ;

str_arr_body_valid
    : str_arr_body                              { checkAndResetArrayDefEquality(); $$ = buffer; }
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

num_arr_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,  value: $1 }) }
    | num_arr_body_valid                        { $$ = ({ type: Fn,  value: AbEq, args: [$1] }) }
    | (UNORDERED | CTX_USER_FN) num_arr_body_valid
                                                { $$ = ({ type: Fn,  value: $1, args: [$2] }) }
    ;

num_arr_body_valid
    : num_arr_body                              { checkAndResetArrayDefEquality(); $$ = buffer; }
    ;

num_arr_body
    : open_sqb_hook num_val_proxy? (COMMA num_val_proxy)* close_sqb_hook
                                                { $$ = rcg }
    | open_sqb_hook num_arr_body (COMMA num_arr_body)* close_sqb_hook
                                                { $$ = rcg }
    ;

num_val_proxy
    : NUMERIC                                   { collector && collector.push($$); }
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

bool_arr_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,  value: $1 }) }
    | bool_arr_body_valid                       { $$ = ({ type: Fn,  value: AbEq, args: [$1] }) }
    | (UNORDERED | CTX_USER_FN) bol_arr_body_valid
                                                { $$ = ({ type: Fn,  value: $1, args: [$2] }) }
    ;

bool_arr_body_valid
    : bool_arr_body                              { checkAndResetArrayDefEquality(); $$ = buffer; }
    ;

bool_arr_body
    : open_sqb_hook bool_val_proxy? (COMMA bool_val_proxy)* close_sqb_hook
                                                { $$ = rcg }
    | open_sqb_hook bool_arr_body (COMMA bool_arr_body)* close_sqb_hook
                                                { $$ = rcg }
    ;

bool_val_proxy
    : TRUE                                      { collector && collector.push($$); }
    | FALSE                                     { collector && collector.push($$); }
    ;

ref_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,  value: $1 }) }
    | CTX_USER_FN                               { $$ = ({ type: UFn, value: $1 }) }
    | REFERENCE attr                            { $$ = ({ type: Ref, value: $2 })}
    ;

ref_arr_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,  value: $1 }) }
    | CTX_USER_FN                               { $$ = ({ type: UFn, value: $1 }) }
    | ANYOF                                     { $$ = ({ type: Fn,  value: $1 }) }
    | ALLOF                                     { $$ = ({ type: Fn,  value: $1 }) }
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
