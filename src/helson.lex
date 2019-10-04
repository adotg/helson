userfn          \$\{[a-zA-Z_]*[a-zA-Z0-9_]+\}
struct_id       [A-Z][a-zA-Z0-9_]*
text            \"[^"]*\"
regex           ^\/.*\/$
numeric         [0-9]+(\.[0-9]+)?

%%

\s+             /* ignore whitespace */

typdef          return 'TYPEDEF'
optnl           return 'OPTIONAL'
enum            return 'ENUM'
str             return 'STR'
num             return 'NUM'
bool            return 'BOOL'
obj             return 'OBJ'
pass            return 'IDENTITY'
fail            return 'FAIL'
anyOf           return 'ANYOF'
true            return 'TRUE'
false           return 'FALSE'
truthy          return 'TRUTHY'
falsy           return 'FALSY'
allOf           return 'ALLOF'
"["             return 'OPEN_SQB'
"]"             return 'CLOSE_SQB'
"("             return 'OPEN_BRAC'
")"             return 'CLOSE_BRAC'
"{"             return 'OPEN_CURB'
"}"             return 'CLOSE_CURB'
"`"             return 'REFERENCE'
"|"             return 'OR'
":"             return 'COLON'
","             return 'COMMA'
"!"             return 'NOT'
{userfn}        return 'CTX_USER_FN'
{struct_id}     return 'S_ID'
{numeric}       return 'NUMERIC'
{text}          return 'TEXT'
{regex}         return 'REGEX'

<<EOF>>         return 'EOF'
