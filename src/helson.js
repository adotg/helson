/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var helson = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[5,99,100],$V1=[1,10],$V2=[1,13],$V3=[1,25],$V4=[1,26],$V5=[1,27],$V6=[1,28],$V7=[1,29],$V8=[1,31],$V9=[1,33],$Va=[12,14,47,49,50,51,52,55,69],$Vb=[1,48],$Vc=[1,101],$Vd=[47,49,50,51,69],$Ve=[12,14,47,49,50,51,52,55,69,75],$Vf=[72,75],$Vg=[70,75],$Vh=[1,155],$Vi=[1,162],$Vj=[1,163],$Vk=[70,103],$Vl=[1,179],$Vm=[12,14,47,49,50,51,52,55,69,70,75];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"program":3,"program_repetition0":4,"EOF":5,"structs":6,"structs_group0":7,"S_ID":8,"def_body":9,"OPEN_CURB":10,"def_body_repetition_plus0":11,"CLOSE_CURB":12,"pair":13,"OPTIONAL":14,"pair_def":15,"str_key":16,"COLON":17,"str_value":18,"pair_def_option0":19,"num_key":20,"num_value":21,"pair_def_option1":22,"bool_key":23,"bool_value":24,"pair_def_option2":25,"ref_key":26,"ref_value":27,"pair_def_option3":28,"obj_key":29,"obj_value":30,"pair_def_option4":31,"str_arr_key":32,"str_arr_value":33,"pair_def_option5":34,"num_arr_key":35,"num_arr_value":36,"pair_def_option6":37,"bool_arr_key":38,"bool_arr_value":39,"pair_def_option7":40,"ref_arr_key":41,"ref_arr_value":42,"pair_def_option8":43,"any_key":44,"any_value":45,"pair_def_option9":46,"STR":47,"attr":48,"NUM":49,"BOOL":50,"REFERENCE":51,"OBJ":52,"sqbs":53,"sqbs_repetition_plus0":54,"ANY":55,"TEXT":56,"IDENTITY":57,"FAIL":58,"REGEX":59,"CTX_USER_FN":60,"str_arr_body_valid":61,"str_arr_value_group0":62,"str_arr_body":63,"open_sqb_hook":64,"str_arr_body_option0":65,"str_arr_body_repetition0":66,"close_sqb_hook":67,"str_arr_body_repetition1":68,"OPEN_SQB":69,"CLOSE_SQB":70,"intervals":71,"NUMERIC":72,"intervals_group0":73,"intervals_option0":74,"COMMA":75,"intervals_option1":76,"intervals_group1":77,"num_arr_body_valid":78,"num_arr_value_group0":79,"num_arr_body":80,"num_arr_body_option0":81,"num_arr_body_repetition0":82,"num_arr_body_repetition1":83,"num_val_proxy":84,"TRUE":85,"TRUTHY":86,"FALSE":87,"FALSY":88,"bool_arr_body_valid":89,"bool_arr_value_group0":90,"bol_arr_body_valid":91,"bool_arr_body":92,"bool_arr_body_option0":93,"bool_arr_body_repetition0":94,"bool_arr_body_repetition1":95,"bool_val_proxy":96,"ANYOF":97,"ALLOF":98,"TYPEDEF":99,"OLIST":100,"UNORDERED":101,"OPEN_BRAC":102,"CLOSE_BRAC":103,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"S_ID",10:"OPEN_CURB",12:"CLOSE_CURB",14:"OPTIONAL",17:"COLON",47:"STR",49:"NUM",50:"BOOL",51:"REFERENCE",52:"OBJ",55:"ANY",56:"TEXT",57:"IDENTITY",58:"FAIL",59:"REGEX",60:"CTX_USER_FN",69:"OPEN_SQB",70:"CLOSE_SQB",72:"NUMERIC",75:"COMMA",85:"TRUE",86:"TRUTHY",87:"FALSE",88:"FALSY",91:"bol_arr_body_valid",97:"ANYOF",98:"ALLOF",99:"TYPEDEF",100:"OLIST",101:"UNORDERED",102:"OPEN_BRAC",103:"CLOSE_BRAC"},
productions_: [0,[3,2],[6,3],[9,3],[13,2],[13,1],[15,4],[15,4],[15,4],[15,4],[15,4],[15,4],[15,4],[15,4],[15,4],[15,4],[16,2],[20,2],[23,2],[26,3],[29,2],[32,2],[35,2],[38,2],[41,2],[53,1],[44,2],[48,1],[18,1],[18,1],[18,1],[18,1],[18,1],[33,1],[33,1],[33,1],[33,2],[61,1],[63,4],[63,4],[64,1],[67,1],[21,1],[21,1],[21,1],[21,1],[21,1],[71,5],[36,1],[36,1],[36,1],[36,2],[78,1],[80,4],[80,4],[84,1],[24,1],[24,1],[24,1],[24,1],[24,1],[24,1],[24,1],[39,1],[39,1],[39,1],[39,2],[89,1],[92,4],[92,4],[96,1],[96,1],[27,1],[27,1],[27,1],[42,1],[42,1],[42,1],[42,1],[42,1],[30,1],[30,1],[30,1],[30,1],[45,1],[45,1],[4,0],[4,2],[7,1],[7,1],[11,1],[11,2],[19,0],[19,1],[22,0],[22,1],[25,0],[25,1],[28,0],[28,1],[31,0],[31,1],[34,0],[34,1],[37,0],[37,1],[40,0],[40,1],[43,0],[43,1],[46,0],[46,1],[54,2],[54,3],[62,1],[62,1],[65,0],[65,1],[66,0],[66,3],[68,0],[68,3],[73,1],[73,1],[74,0],[74,1],[76,0],[76,1],[77,1],[77,1],[79,1],[79,1],[81,0],[81,1],[82,0],[82,3],[83,0],[83,3],[90,1],[90,1],[93,0],[93,1],[94,0],[94,3],[95,0],[95,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 return parseTree.makeEntry(Program, { /* empty */ }, $$[$0-1]) 
break;
case 2:

                                                    if ($$[$0-2] === OList && isArrFound()) {
                                                        throw new Error("An ordered list (olist) can't have array")
                                                    }
                                                    resetFoundBits()
                                                    this.$ = parseTree.makeEntry(StructureDefinition, {},
                                                        [parseTree.makeEntry(StructureIdentifier, { type: $$[$0-2], id: $$[$0-1] }), $$[$0]])
                                                
break;
case 3:
this.$ = parseTree.makeEntry(StructureBody, {}, $$[$0-1]);
break;
case 4:
this.$ = parseTree.makeEntry(PairDefinition, { isOptional: true }, $$[$0]);
break;
case 5:
this.$ = parseTree.makeEntry(PairDefinition, { isOptional: false }, $$[$0]);
break;
case 6:
 this.$ = [ parseTree.makeEntry(PairComponentKey, { type: Str, id: $$[$0-3] }),
                                                        parseTree.makeEntry(PairComponentValue, $$[$0-1]) ] 
break;
case 7:
 this.$ = [ parseTree.makeEntry(PairComponentKey, { type: Num, id: $$[$0-3] }),
                                                        parseTree.makeEntry(PairComponentValue, $$[$0-1]) ] 
break;
case 8:
 this.$ = [ parseTree.makeEntry(PairComponentKey, { type: Bool, id: $$[$0-3] }),
                                                        parseTree.makeEntry(PairComponentValue, $$[$0-1]) ] 
break;
case 9:
 this.$ = [ parseTree.makeEntry(PairComponentKey, { type: Ref, typeArgs: $$[$0-3][0], id: $$[$0-3][1] }),
                                                        parseTree.makeEntry(PairComponentValue, $$[$0-1]) ] 
break;
case 10:
 this.$ = [ parseTree.makeEntry(PairComponentKey, { type: Obj, id: $$[$0-3] }),
                                                        parseTree.makeEntry(PairComponentValue, $$[$0-1]) ] 
break;
case 11:
 setArrFoundBit(); this.$ = [ parseTree.makeEntry(PairComponentKey, { type: Arr, typeArgs: Str, id: $$[$0-3] }),
                                                        parseTree.makeEntry(PairComponentValue, $$[$0-1]) ] 
break;
case 12:
 setArrFoundBit(); this.$ = [ parseTree.makeEntry(PairComponentKey, { type: Arr, typeArgs: Num, id: $$[$0-3] }),
                                                        parseTree.makeEntry(PairComponentValue, $$[$0-1]) ] 
break;
case 13:
 setArrFoundBit(); this.$ = [ parseTree.makeEntry(PairComponentKey, { type: Arr, typeArgs: Bool, id: $$[$0-3] }),
                                                        parseTree.makeEntry(PairComponentValue, $$[$0-1]) ] 
break;
case 14:
 setArrFoundBit(); this.$ = [ parseTree.makeEntry(PairComponentKey, { type: Arr, typeArgs: $$[$0-3][0][0], id: $$[$0-3][0][1], dim: $$[$0-3][1] }),
                                                        parseTree.makeEntry(PairComponentValue, $$[$0-1]) ] 
break;
case 15:
 this.$ = [ parseTree.makeEntry(PairComponentKey, { type: Any, id: $$[$0-3] }),
                                                        parseTree.makeEntry(PairComponentValue, $$[$0-1]) ] 
break;
case 16: case 17: case 18: case 20: case 26:
 this.$ = $$[$0] 
break;
case 19:
 this.$ = [$$[$0-1], $$[$0]] 
break;
case 21: case 22: case 23:
 dim = $$[$0-1].length; this.$ = $$[$0] 
break;
case 24:
this.$ = [$$[$0], $$[$0-1].length /* dimension */]
break;
case 27:
 this.$ = yytext.replace(/^"|"$/g, ''); collector && collector.push(this.$); 
break;
case 28: case 29: case 33: case 34: case 42: case 43: case 44: case 48: case 49: case 63: case 64: case 72: case 73: case 75: case 76: case 78: case 79: case 80: case 81: case 84: case 85:
 this.$ = ({ type: Fn,  value: $$[$0] }) 
break;
case 30: case 35: case 45: case 50: case 65:
 this.$ = ({ type: Fn,  value: AbEq, args: [$$[$0]] }) 
break;
case 31:
 this.$ = ({ type: Fn,  value: AbEq, args: [$$[$0], Word.Transformer.Str.Pattern] }) 
break;
case 32: case 46: case 74: case 77: case 83:
 this.$ = ({ type: UFn, value: $$[$0] }) 
break;
case 36: case 51: case 66:
 this.$ = ({ type: Fn,  value: $$[$0-1], args: [$$[$0]] }) 
break;
case 37: case 52: case 67:
 checkAndResetArrayDefEquality(); this.$ = buffer; 
break;
case 38: case 39: case 53: case 54: case 68: case 69:
 this.$ = rcg 
break;
case 40:

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
                                                
break;
case 41:

                                                    abductedNode = stack.splice(stack.length - 1, 1)[0];
                                                    if (abductedNode.__leaf__) {
                                                        valueDims.push(rcgCount);
                                                        delete abductedNode.__leaf__;
                                                    }
                                                    collector = null;
                                                    rcgCount -= 1;
                                                
break;
case 47:
 this.$ = `${
                                                    $$[$0-4] === "(" ? "lo" : "lc"
                                                }${
                                                    $$[$0] === ")" ? "ro" : "rc"
                                                }Range,${$$[$0-3] || null},${$$[$0-1] || null}` 
break;
case 55: case 70: case 71:
 collector && collector.push(this.$); 
break;
case 56: case 57: case 59: case 61:
 this.$ = ({ type: Fn,   value: $$[$0] }) 
break;
case 58: case 60:
 this.$ = ({ type: Fn,   value: AbEq, args: [$$[$0]] }) 
break;
case 62:
 this.$ = ({ type: UFn,  value: $$[$0] }) 
break;
case 82:
 this.$ = ({ type: Rec, value: $$[$0] }) 
break;
case 86: case 118: case 120: case 134: case 136: case 142: case 144:
this.$ = [];
break;
case 87: case 91:
$$[$0-1].push($$[$0]);
break;
case 90:
this.$ = [$$[$0]];
break;
case 112:
this.$ = [$$[$0-1]];
break;
case 113: case 119: case 121: case 135: case 137: case 143: case 145:
$$[$0-2].push($$[$0-1]);
break;
}
},
table: [o($V0,[2,86],{3:1,4:2}),{1:[3]},{5:[1,3],6:4,7:5,99:[1,6],100:[1,7]},{1:[2,1]},o($V0,[2,87]),{8:[1,8]},{8:[2,88]},{8:[2,89]},{9:9,10:$V1},o($V0,[2,2]),{11:11,13:12,14:$V2,15:14,16:15,20:16,23:17,26:18,29:19,32:20,35:21,38:22,41:23,44:24,47:$V3,49:$V4,50:$V5,51:$V6,52:$V7,53:30,54:32,55:$V8,69:$V9},{12:[1,34],13:35,14:$V2,15:14,16:15,20:16,23:17,26:18,29:19,32:20,35:21,38:22,41:23,44:24,47:$V3,49:$V4,50:$V5,51:$V6,52:$V7,53:30,54:32,55:$V8,69:$V9},o($Va,[2,90]),{15:36,16:15,20:16,23:17,26:18,29:19,32:20,35:21,38:22,41:23,44:24,47:$V3,49:$V4,50:$V5,51:$V6,52:$V7,53:30,54:32,55:$V8,69:$V9},o($Va,[2,5]),{17:[1,37]},{17:[1,38]},{17:[1,39]},{17:[1,40]},{17:[1,41]},{17:[1,42]},{17:[1,43]},{17:[1,44]},{17:[1,45]},{17:[1,46]},{48:47,56:$Vb},{48:49,56:$Vb},{48:50,56:$Vb},{8:[1,51]},{48:52,56:$Vb},{16:53,20:54,23:55,26:56,47:$V3,49:$V4,50:$V5,51:$V6},{48:57,56:$Vb},o([47,49,50,51],[2,25],{69:[1,58]}),{70:[1,59]},o([5,12,14,47,49,50,51,52,55,69,75,99,100],[2,3]),o($Va,[2,91]),o($Va,[2,4]),{18:60,48:63,56:$Vb,57:[1,61],58:[1,62],59:[1,64],60:[1,65]},{21:66,57:[1,67],58:[1,68],60:[1,71],69:[1,74],71:69,72:[1,70],73:72,102:[1,73]},{24:75,57:[1,76],58:[1,77],60:[1,82],85:[1,78],86:[1,79],87:[1,80],88:[1,81]},{27:83,57:[1,84],58:[1,85],60:[1,86]},{9:90,10:$V1,30:87,57:[1,88],58:[1,89],60:[1,91]},{33:92,57:[1,93],58:[1,94],60:[1,99],61:95,62:96,63:97,64:100,69:$Vc,101:[1,98]},{36:102,57:[1,103],58:[1,104],60:[1,109],64:110,69:$Vc,78:105,79:106,80:107,101:[1,108]},{39:111,57:[1,112],58:[1,113],60:[1,118],64:119,69:$Vc,89:114,90:115,92:116,101:[1,117]},{42:120,57:[1,121],58:[1,122],60:[1,123],97:[1,124],98:[1,125]},{45:126,57:[1,127],58:[1,128]},{17:[2,16]},o([12,14,17,47,49,50,51,52,55,69,70,75],[2,27]),{17:[2,17]},{17:[2,18]},{48:129,56:$Vb},{17:[2,20]},{17:[2,21]},{17:[2,22]},{17:[2,23]},{17:[2,24]},{17:[2,26]},{70:[1,130]},o($Vd,[2,112]),o($Va,[2,92],{19:131,75:[1,132]}),o($Ve,[2,28]),o($Ve,[2,29]),o($Ve,[2,30]),o($Ve,[2,31]),o($Ve,[2,32]),o($Va,[2,94],{22:133,75:[1,134]}),o($Ve,[2,42]),o($Ve,[2,43]),o($Ve,[2,44]),o($Ve,[2,45]),o($Ve,[2,46]),{72:[1,136],74:135,75:[2,124]},o($Vf,[2,122]),o($Vf,[2,123]),o($Va,[2,96],{25:137,75:[1,138]}),o($Ve,[2,56]),o($Ve,[2,57]),o($Ve,[2,58]),o($Ve,[2,59]),o($Ve,[2,60]),o($Ve,[2,61]),o($Ve,[2,62]),o($Va,[2,98],{28:139,75:[1,140]}),o($Ve,[2,72]),o($Ve,[2,73]),o($Ve,[2,74]),o($Va,[2,100],{31:141,75:[1,142]}),o($Ve,[2,80]),o($Ve,[2,81]),o($Ve,[2,82]),o($Ve,[2,83]),o($Va,[2,102],{34:143,75:[1,144]}),o($Ve,[2,33]),o($Ve,[2,34]),o($Ve,[2,35]),{61:145,63:97,64:100,69:$Vc},o($Ve,[2,37]),{69:[2,114]},{69:[2,115]},o($Vg,[2,116],{64:100,65:146,63:147,48:148,56:$Vb,69:$Vc}),o([56,69,70,72,75,85,87],[2,40]),o($Va,[2,104],{37:149,75:[1,150]}),o($Ve,[2,48]),o($Ve,[2,49]),o($Ve,[2,50]),{64:110,69:$Vc,78:151,80:107},o($Ve,[2,52]),{69:[2,130]},{69:[2,131]},o($Vg,[2,132],{64:110,81:152,80:153,84:154,69:$Vc,72:$Vh}),o($Va,[2,106],{40:156,75:[1,157]}),o($Ve,[2,63]),o($Ve,[2,64]),o($Ve,[2,65]),{91:[1,158]},o($Ve,[2,67]),{91:[2,138]},{91:[2,139]},o($Vg,[2,140],{64:119,93:159,92:160,96:161,69:$Vc,85:$Vi,87:$Vj}),o($Va,[2,108],{43:164,75:[1,165]}),o($Ve,[2,75]),o($Ve,[2,76]),o($Ve,[2,77]),o($Ve,[2,78]),o($Ve,[2,79]),o($Va,[2,110],{46:166,75:[1,167]}),o($Ve,[2,84]),o($Ve,[2,85]),{17:[2,19]},o($Vd,[2,113]),o($Va,[2,6]),o($Va,[2,93]),o($Va,[2,7]),o($Va,[2,95]),{75:[1,168]},{75:[2,125]},o($Va,[2,8]),o($Va,[2,97]),o($Va,[2,9]),o($Va,[2,99]),o($Va,[2,10]),o($Va,[2,101]),o($Va,[2,11]),o($Va,[2,103]),o($Ve,[2,36]),o($Vg,[2,118],{66:169}),o($Vg,[2,120],{68:170}),o($Vg,[2,117]),o($Va,[2,12]),o($Va,[2,105]),o($Ve,[2,51]),o($Vg,[2,134],{82:171}),o($Vg,[2,136],{83:172}),o($Vg,[2,133]),o($Vg,[2,55]),o($Va,[2,13]),o($Va,[2,107]),o($Ve,[2,66]),o($Vg,[2,142],{94:173}),o($Vg,[2,144],{95:174}),o($Vg,[2,141]),o($Vg,[2,70]),o($Vg,[2,71]),o($Va,[2,14]),o($Va,[2,109]),o($Va,[2,15]),o($Va,[2,111]),o($Vk,[2,126],{76:175,72:[1,176]}),{67:177,70:$Vl,75:[1,178]},{67:180,70:$Vl,75:[1,181]},{67:182,70:$Vl,75:[1,183]},{67:184,70:$Vl,75:[1,185]},{67:186,70:$Vl,75:[1,187]},{67:188,70:$Vl,75:[1,189]},{70:[1,191],77:190,103:[1,192]},o($Vk,[2,127]),o($Vm,[2,38]),{48:193,56:$Vb},o($Vm,[2,41]),o($Vm,[2,39]),{63:194,64:100,69:$Vc},o($Vm,[2,53]),{72:$Vh,84:195},o($Vm,[2,54]),{64:110,69:$Vc,80:196},o($Vm,[2,68]),{85:$Vi,87:$Vj,96:197},o($Vm,[2,69]),{64:119,69:$Vc,92:198},o($Ve,[2,47]),o($Ve,[2,128]),o($Ve,[2,129]),o($Vg,[2,119]),o($Vg,[2,121]),o($Vg,[2,135]),o($Vg,[2,137]),o($Vg,[2,143]),o($Vg,[2,145])],
defaultActions: {3:[2,1],6:[2,88],7:[2,89],47:[2,16],49:[2,17],50:[2,18],52:[2,20],53:[2,21],54:[2,22],55:[2,23],56:[2,24],57:[2,26],98:[2,114],99:[2,115],108:[2,130],109:[2,131],117:[2,138],118:[2,139],129:[2,19],136:[2,125]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

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

/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* ignore whitespace */
break;
case 1:return 99
break;
case 2:return 100
break;
case 3:return 14
break;
case 4:return 'ENUM'
break;
case 5:return 47
break;
case 6:return 49
break;
case 7:return 50
break;
case 8:return 52
break;
case 9:return 57
break;
case 10:return 58
break;
case 11:return 85
break;
case 12:return 87
break;
case 13:return 86
break;
case 14:return 88
break;
case 15:return 55
break;
case 16:return 97
break;
case 17:return 98
break;
case 18:return 101
break;
case 19:return 69
break;
case 20:return 70
break;
case 21:return 102
break;
case 22:return 103
break;
case 23:return 10
break;
case 24:return 12
break;
case 25:return 51
break;
case 26:return 'OR'
break;
case 27:return 17
break;
case 28:return 75
break;
case 29:return 'NOT'
break;
case 30:return 59
break;
case 31:return 8
break;
case 32:return 60
break;
case 33:return 72
break;
case 34:return 56
break;
case 35:return 5
break;
}
},
rules: [/^(?:\s+)/,/^(?:typdef\b)/,/^(?:olist\b)/,/^(?:optnl\b)/,/^(?:enum\b)/,/^(?:str\b)/,/^(?:num\b)/,/^(?:bool\b)/,/^(?:obj\b)/,/^(?:pass\b)/,/^(?:fail\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:truthy\b)/,/^(?:falsy\b)/,/^(?:any\b)/,/^(?:anyOf\b)/,/^(?:allOf\b)/,/^(?:unordered\b)/,/^(?:\[)/,/^(?:\])/,/^(?:\()/,/^(?:\))/,/^(?:\{)/,/^(?:\})/,/^(?:`)/,/^(?:\|)/,/^(?::)/,/^(?:,)/,/^(?:!)/,/^(?:(\/.*\/))/,/^(?:([A-Z][a-zA-Z0-9_]*))/,/^(?:([a-zA-Z_]+[a-zA-Z0-9_]*))/,/^(?:([0-9]+(\.[0-9]+)?))/,/^(?:("[^"]*"))/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = helson;
exports.Parser = helson.Parser;
exports.parse = function () { return helson.parse.apply(helson, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}