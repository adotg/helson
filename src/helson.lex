%s fn grp

userfn              [a-zA-Z_]+[a-zA-Z0-9_]*
struct_id           [A-Z][a-zA-Z0-9_]*
text                \"[^"]*\"
regex               \/.*\/
numeric             [0-9]+(\.[0-9]+)?
anything            \(.+\)

%%

\s+                 /* ignore whitespace */

typdef              { this.begin('fn'); return 'TYPEDEF'; }
olist               return 'OLIST'
optnl               return 'OPTIONAL'
enum                { this.begin('grp'); return 'ENUM'; }
str                 return 'STR'
num                 return 'NUM'
bool                return 'BOOL'
obj                 return 'OBJ'
pass                return 'IDENTITY'
fail                return 'FAIL'
true                return 'TRUE'
false               return 'FALSE'
truthy              return 'TRUTHY'
falsy               return 'FALSY'
any                 return 'ANY'
anyOf               return 'ANYOF'
allOf               return 'ALLOF'
unordered           return 'UNORDERED'
"["                 return 'OPEN_SQB'
"]"                 return 'CLOSE_SQB'
<fn>"("             return 'OPEN_BRAC'
<fn>")"             return 'CLOSE_BRAC'
"{"                 return 'OPEN_CURB'
"}"                 return 'CLOSE_CURB'
"`"                 return 'REFERENCE'
"|"                 return 'OR'
":"                 return 'COLON'
","                 return 'COMMA'
"!"                 return 'NOT'
{regex}             return 'REGEX'
{struct_id}         return 'S_ID'
{userfn}            return 'CTX_USER_FN'
{numeric}           return 'NUMERIC'
{text}              return 'TEXT'
<grp>{anything}     return 'ANYTHING'

<<EOF>>             return 'EOF'
