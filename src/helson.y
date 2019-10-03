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
Fn = Word.Fn
Abs = Word.Abs
UFn = Word.UFn
Rec = Word.Rec

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
    | arr_key COLON arr_value COMMA?            { $$ = [ parseTree.makeEntry(PairComponentKey, { type: Arr, id: $1 }),
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

arr_key
    : (OPEN_SQB CLOSE_SQB)+ (str_key_type | num_key_type | bool_key_type | ref_key_type)
    ;

attr
    : TEXT                                      { $$ = yytext.replace(/^"|"$/g, '') }
    ;

str_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | attr                                      { $$ = ({ type: Abs, value: $1 }) }
    | CTX_USER_FN                               { $$ = ({ type: UFn, value: $1 }) }
    ;

num_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | intervals                                 { $$ = ({ type: Fn,  value: $1 }) }
    | NUMERIC                                   { $$ = ({ type: Abs, value: $1 }) }
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
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | TRUE                                      { $$ = ({ type: Abs,  value: $1 }) }
    | TRUTHY                                    { $$ = ({ type: Fn,  value: $1 }) }
    | FALSE                                     { $$ = ({ type: Abs,  value: $1 }) }
    | FALSY                                     { $$ = ({ type: Fn,  value: $1 }) }
    | CTX_USER_FN                               { $$ = ({ type: UFn, value: $1 }) }
    ;

ref_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | CTX_USER_FN                               { $$ = ({ type: UFn, value: $1 }) }
    ;

obj_value
    : IDENTITY                                  { $$ = ({ type: Fn,  value: $1 }) }
    | def_body                                  { $$ = ({ type: Rec, value: $1 }) }
    | CTX_USER_FN                               { $$ = ({ type: UFn, value: $1 }) }
    ;

%%
