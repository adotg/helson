%{
/* Alert: https://stackoverflow.com/a/34339368/2474269 */

// TODO recursive enum not supported, throw error message

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
ArrAbEq = Word.ArrAbEq
UFn = Word.UFn
Rec = Word.Rec
TypeDef = Word.TypeDef

dim = null
collector = null
buffer = null
rcg = null /* rcg = recursiveCollectorGroup */
stack = []
queue = []
valueDims = [];
ptrToCurrentRCG = null
pathRCG = null
rcgCount = 0

bits = 0x00
// RightToLeft
arrF = 0x01 // Array found

function parseInteger(n) {
    var nn = parseInt(n, 10);
    return isNaN(nn) ? null : nn;
}

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
    : TYPEDEF S_ID def_body                     {
                                                    _arrFoundFlag = isArrFound()
                                                    resetFoundBits()
                                                    /* if ($3[0] === OList && _arrFoundFlag) { */
                                                        // probably a valid caase; not required to throw error
                                                        /* throw new Error("An ordered list (olist) can't have unbounded array member") */
                                                    /* } */
                                                    $$ = parseTree.makeEntry(StructureDefinition, {},
                                                        [parseTree.makeEntry(StructureIdentifier, { type: $3[0], id: $2 }), $3[1]])
                                                }
    | enum                                      { $$ = parseTree.makeEntry(StructureDefinition, {}, [$1[0] /* identifier */, $1[1] /* body */]) }
    ;

enum
    : ENUM S_ID STR str_enum_body               { $$ = [parseTree.makeEntry(StructureIdentifier, { type: $1, id: $2, typeArgs: Str  }), $4] }
    | ENUM S_ID NUM num_enum_body               { $$ = [parseTree.makeEntry(StructureIdentifier, { type: $1, id: $2, typeArgs: Num  }), $4] }
    | ENUM S_ID BOOL bool_enum_body             { $$ = [parseTree.makeEntry(StructureIdentifier, { type: $1, id: $2, typeArgs: Bool }), $4] }
    | ENUM S_ID REFERENCE S_ID obj_enum_body    { $$ = [parseTree.makeEntry(StructureIdentifier, { type: $1, id: $2, typeArgs: Ref, subType: $4 }), $5] }
    ;

str_enum_body
    : OPEN_CURB str_pair* CLOSE_CURB            -> parseTree.makeEntry(StructureBody, {}, $2)
    ;

str_pair
    : attr COLON attr COMMA?                    {
                                                    $$ = parseTree.makeEntry(PairDefinition, {}, [
                                                        parseTree.makeEntry(PairComponentKey, { id: $1 }),
                                                        parseTree.makeEntry(PairComponentValue, { 
                                                            type: Word.Fn,
                                                            value: Word.AbEq,
                                                            args: [$3]
                                                        })
                                                    ])
                                                }
    ;

num_enum_body
    : OPEN_CURB num_pair* CLOSE_CURB COMMA?     -> parseTree.makeEntry(StructureBody, {}, $2)
    ;

num_pair
    : attr COLON NUMERIC COMMA?                 {
                                                    $$ = parseTree.makeEntry(PairDefinition, {}, [
                                                        parseTree.makeEntry(PairComponentKey, { id: $1 }),
                                                        parseTree.makeEntry(PairComponentValue, {
                                                            type: Word.Fn,
                                                            value: Word.AbEq,
                                                            args: [+$3]
                                                        })
                                                    ])
                                                }
    ;

bool_enum_body
    : OPEN_CURB bool_pair* CLOSE_CURB COMMA?    -> parseTree.makeEntry(StructureBody, {}, $2)
    ;

bool_pair
    : attr COLON (TRUE | FALSE) COMMA?          {
                                                    $$ = parseTree.makeEntry(PairDefinition, {}, [
                                                        parseTree.makeEntry(PairComponentKey, { id: $1 }),
                                                        parseTree.makeEntry(PairComponentValue, {
                                                            type: Word.Fn,
                                                            value: Word.AbEq,
                                                            args: [$3]
                                                        })
                                                    ])
                                                }
    ;

obj_enum_body
    : OPEN_CURB obj_pair* CLOSE_CURB            -> parseTree.makeEntry(StructureBody, {}, $2)
    ;

obj_pair
    : attr COLON ANYTHING COMMA?                {
                                                    // WARN Validation happens after the ast is prepared
                                                    match = $3.match(/\((.+)\)/)
                                                    $$ = parseTree.makeEntry(PairDefinition, {}, [
                                                        parseTree.makeEntry(PairComponentKey, { id: $1 }),
                                                        parseTree.makeEntry(PairComponentValue, {
                                                            type: Word.Fn,
                                                            value: Word.AbEq,
                                                            args: match[1]
                                                        })
                                                    ])
                                                }
    ;



def_body
    : OPEN_CURB pair+ CLOSE_CURB                { $$ = [TypeDef, parseTree.makeEntry(StructureBody, {}, $2)] }
    | OPEN_SQB pair+ CLOSE_SQB                  { $$ = [OList, parseTree.makeEntry(StructureBody, {}, $2)] }
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
    | str_arr_key COLON str_arr_value COMMA?    { 
                                                    setArrFoundBit()
                                                    $$ = [
                                                        parseTree.makeEntry(
                                                            PairComponentKey,
                                                            {
                                                                type: Arr,
                                                                typeArgs: Str,
                                                                id: $1,
                                                                dim: dim
                                                            }
                                                        ),
                                                        parseTree.makeEntry(PairComponentValue, $3)
                                                    ] 
                                                }
    | num_arr_key COLON num_arr_value COMMA?    {
                                                    setArrFoundBit()
                                                    $$ = [
                                                        parseTree.makeEntry(
                                                            PairComponentKey,
                                                            {
                                                                type: Arr,
                                                                typeArgs: Num,
                                                                id: $1,
                                                                dim: dim
                                                            }
                                                        ),
                                                        parseTree.makeEntry(PairComponentValue, $3)
                                                    ]
                                                }
    | bool_arr_key COLON bool_arr_value COMMA?  {
                                                    setArrFoundBit()
                                                    $$ = [
                                                        parseTree.makeEntry(
                                                            PairComponentKey,
                                                            {
                                                                type: Arr,
                                                                typeArgs: Bool,
                                                                id: $1,
                                                                dim: dim
                                                            }
                                                        ),
                                                        parseTree.makeEntry(PairComponentValue, $3)
                                                    ]
                                                }
    | ref_arr_key COLON ref_arr_value COMMA?    {
                                                    setArrFoundBit()
                                                    $$ = [
                                                            parseTree.makeEntry(
                                                                PairComponentKey,
                                                                {
                                                                    type: Arr,
                                                                    typeArgs: Word.Ref,
                                                                    subType: $1[0][0],
                                                                    id: $1[0][1],
                                                                    dim: $1[1]
                                                                }
                                                            ),
                                                        parseTree.makeEntry(PairComponentValue, $3)
                                                    ]
                                                    /* 
                                                     * For reference key the dimensionality is not checked from the
                                                     * parser, hence it's not stored in a local variable
                                                     */
                                                }
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

ctx_fn_param
    : TEXT
    | NUMERIC                                   { $$ = +$1 }
    | NULL
    ;

ctx_user_fn
    : CTX_USER_FN ctx_fn_param*                 { queue.push([$1, ...$2]) }
    ;


ctx_user_fns
    : ctx_user_fn (OR ctx_user_fn)*             { $$ = queue.slice(0); queue.length = 0; }
    ;

str_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,  value: $1 }) }
    | attr                                      { $$ = ({ type: Fn,  value: AbEq, args: [$1] }) }
    | REGEX                                     { $$ = ({ type: Fn,  value: AbEq, args: [$1, Word.Transformer.Str.Pattern] }) }
    | ctx_user_fns                              { $$ = ({ type: UFn, value: $1 }) }
    ;

str_arr_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,  value: $1 }) }
    | str_arr_body_valid                        { $$ = ({ type: Fn,  value: ArrAbEq, args: [$1] }) }
    | ctx_user_fns                              { $$ = ({ type: UFn,  value: $1 }) }
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
    | intervals                                 { $$ = ({ type: Fn,  value: $1[0], args: $1.slice(1) }) }
    | NUMERIC                                   { $$ = ({ type: Fn,  value: AbEq, args: [+$1] }) }
    | ctx_user_fns                              { $$ = ({ type: UFn, value: $1 }) }
    ;

intervals
    : (OPEN_BRAC | OPEN_SQB) NUMERIC? COMMA NUMERIC? (CLOSE_SQB | CLOSE_BRAC)
                                                { $$ = [`${
                                                    $1 === "(" ? "lo" : "lc"
                                                }${
                                                    $5 === ")" ? "ro" : "rc"
                                                }Range`, parseInteger($2), parseInteger($4)] }
    ;

num_arr_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,  value: $1 }) }
    | num_arr_body_valid                        { $$ = ({ type: Fn,  value: ArrAbEq, args: [$1] }) }
    | ctx_user_fns                              { $$ = ({ type: UFn,  value: $1 }) }
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
    : NUMERIC                                   { collector && collector.push(+$$); }
    ;

bool_value
    : IDENTITY                                  { $$ = ({ type: Fn,   value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,   value: $1 }) }
    | TRUE                                      { $$ = ({ type: Fn,   value: AbEq, args: [true] }) }
    | TRUTHY                                    { $$ = ({ type: Fn,   value: $1 }) }
    | FALSE                                     { $$ = ({ type: Fn,   value: AbEq, args: [false] }) }
    | FALSY                                     { $$ = ({ type: Fn,   value: $1 }) }
    | ctx_user_fns                              { $$ = ({ type: UFn,  value: $1 }) }]
    ;

bool_arr_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,  value: $1 }) }
    | bool_arr_body_valid                       { $$ = ({ type: Fn,  value: ArrAbEq, args: [$1] }) }
    | ctx_user_fns                              { $$ = ({ type: UFn,  value: $1 }) }
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
    : TRUE                                      { collector && collector.push(true); }
    | FALSE                                     { collector && collector.push(false); }
    ;

ref_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,  value: $1 }) }
    | ctx_user_fns                              { $$ = ({ type: UFn, value: $1 }) }
    | REFERENCE attr                            { $$ = ({ type: Ref, value: $2 }) }
    ;

ref_arr_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,  value: $1 }) }
    | ctx_user_fns                              { $$ = ({ type: UFn, value: $1 }) }
    ;

obj_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,  value: $1 }) }
    | def_body                                  { $$ = ({ type: Rec, value: $1[1] }) }
    | ctx_user_fns                              { $$ = ({ type: UFn, value: $1 }) }
    ;

any_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | FAIL                                      { $$ = ({ type: Fn,  value: $1 }) }
    | ctx_user_fns                              { $$ = ({ type: UFn, value: $1 }) }
    ;

%%
