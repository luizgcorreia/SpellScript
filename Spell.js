// Generated automatically by nearley, version 2.18.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require('moo');

const lexer = moo.compile({
    t_wschar: /[ \t]/,
    t_newline: { match: /\n/, lineBreaks: true },
    t_lparen: "(",
    t_rparen: ")",
    t_comma: ",",
    t_point: ".",
    t_sum: "+",
    t_sub: "-",
    t_mult: "*",
    t_div: "/",
    t_decimal: /[0-9]+?\.[0-9]+/,
    t_integer: /[0-9]+/,
    t_string: /".*"/,
    t_id: { match: /[a-zA-Z][a-zA-Z0-9_]*/, type: moo.keywords({
        t_begin: ["lumos"],
        t_end: ["nox"],
        t_read: ["legilimens"],
        t_print: ["revelio"],
        t_declare: ["fidelius"],
        t_if: ["expecto"],
        t_else: ["expulso"],
        t_loop: ["incarcerous"],
        t_to: ["to"],
        t_type: ["integer","decimal","scroll"],
        t_relational_op: ["greater than", "less than", "greater or equal", "less or equal", "not is", "is"]
    })}
})

let reltoC = op => {
    switch(op) {
        case "greater than": return ">";
        case "less than": return "<";
        case "greater or equal": return ">=";
        case "less or equal": return "<=";
        case "not is": return "!=";
        case "is": return "==";
        default: "";
    }
};
let idlist = (ids, type, arr) => ids[0].map(id => decl(id[0], type, arr) + ", ") + decl(ids[1], type, arr);
let decl = (stm, type, arr) => {
    if(stm.text) {
        var_map[stm.text] = type;
        return stm.text;
    }
    else {
        var_map[stm[4]] = type;
        return stm[4] + arr +  " = " + stm[0];
    }

};
let atrib = (id, value, arr) => {
    if (!var_map[id])
        throw Error("Secret to unfidelized " + id + ". You should use the fidelius spell first");
    
    switch(var_map[id]){
        case 'integer': {
            if (Number.isInteger(value.type)){
                if (value.type !== 0)
                    throw Error("Incompatible types\n" + id + " expected an integer secret, but saw expression " + value.string);
            } else {
                if (isNaN(value))
                    throw Error("Incompatible types\n" + id + " expected an integer secret, but saw " + value);
                if (!Number.isInteger(Number(value)))
                    throw Error("Incompatible types\n" + id + " expected an integer secret, but saw decimal " + value);
            }
            break;
        }
        case 'decimal': {
            if (Number.isInteger(value.type)) {
                if (value.type > 1)
                    throw Error("Incompatible types\n" + id + " expected a decimal secret, but saw expression " + value.string);
            } else {
                if (isNaN(value))
                    throw Error("Incompatible types\n" + id + " expected a decimal secret, but saw " + value);
            }
            break;
        }
        case 'string': {
            if (Number.isInteger(value.type) && value.type !== 2)
                throw Error("Incompatible types\nExpression " + value.string + " to a scroll");
            break;
        }
        default: {

        }
    }

    return id + arr +  " = " + value.string;

};

let type_format = token => {
    let format;

    if (token.type === "t_id") {
        switch(var_map[token.text]){
            case 'integer': {
                format = '%d';
                break;
            }
            case 'decimal': {
                format = '%lf';
                break;
            }
            case 'string': {
                format = '%s';
                break;
            }
            default: {

            }
        }
    } else if (token.type === "t_string") {
        format = '%s';
    }

    return format;
}

let term_check = (term) => {
    
    if (term.type === 't_id') {
        if (!var_map[term])
            throw Error("Secret to unfidelized " + term + ". You should use the fidelius spell first");
        switch(var_map[term]){
            case 'integer': return 0;
            case 'decimal': return 1;
            case 'string': return 2;
            default: {
            }
        }
    } else {
        if (isNaN(term)) {
            return 2;
        } else if (!Number.isInteger(Number(term))) {
            return 1;
        } else {
            return 0;
        }
    }
}

let flat = arrays => [].concat.apply([], arrays);

let var_map = {};

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "Script", "symbols": ["Lines"], "postprocess":  
        script => "#include <stdio.h>\n\nint main() {\n" + script[0] + "\treturn 0;\n}"
        },
    {"name": "Block", "symbols": ["___", (lexer.has("t_begin") ? {type: "t_begin"} : t_begin), "Lines", (lexer.has("t_end") ? {type: "t_end"} : t_end), "___"], "postprocess":  
        block => "{\n" + block[2] + "}"
        },
    {"name": "Lines$ebnf$1$subexpression$1", "symbols": ["Spell", "_", (lexer.has("t_point") ? {type: "t_point"} : t_point), "___"]},
    {"name": "Lines$ebnf$1", "symbols": ["Lines$ebnf$1$subexpression$1"]},
    {"name": "Lines$ebnf$1$subexpression$2", "symbols": ["Spell", "_", (lexer.has("t_point") ? {type: "t_point"} : t_point), "___"]},
    {"name": "Lines$ebnf$1", "symbols": ["Lines$ebnf$1", "Lines$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Lines", "symbols": ["___", "Lines$ebnf$1"], "postprocess": 
        cmd =>  cmd[1].map(spell => "\t" + spell[0] + "\n").reverse().reduce((stm, lines) => lines + stm, "") 
         },
    {"name": "Spell$subexpression$1", "symbols": ["Declare"]},
    {"name": "Spell$subexpression$1", "symbols": ["Atribution"]},
    {"name": "Spell$subexpression$1", "symbols": ["Read"]},
    {"name": "Spell$subexpression$1", "symbols": ["Print"]},
    {"name": "Spell$subexpression$1", "symbols": ["Conditional"]},
    {"name": "Spell$subexpression$1", "symbols": ["Loop"]},
    {"name": "Spell", "symbols": ["Spell$subexpression$1"], "postprocess": 
        (cmd) => {
            return cmd[0] + ";";
        }
        },
    {"name": "Read", "symbols": [(lexer.has("t_read") ? {type: "t_read"} : t_read), "_", (lexer.has("t_lparen") ? {type: "t_lparen"} : t_lparen), "_", (lexer.has("t_id") ? {type: "t_id"} : t_id), "_", (lexer.has("t_rparen") ? {type: "t_rparen"} : t_rparen)], "postprocess": 
        stm => "scanf(\"" + type_format(stm[4]) + "\", " + "&" + stm[4] + ")"
        },
    {"name": "Print$subexpression$1", "symbols": [(lexer.has("t_id") ? {type: "t_id"} : t_id)]},
    {"name": "Print$subexpression$1", "symbols": [(lexer.has("t_string") ? {type: "t_string"} : t_string)]},
    {"name": "Print", "symbols": [(lexer.has("t_print") ? {type: "t_print"} : t_print), "_", (lexer.has("t_lparen") ? {type: "t_lparen"} : t_lparen), "_", "Print$subexpression$1", "_", (lexer.has("t_rparen") ? {type: "t_rparen"} : t_rparen)], "postprocess": 
        stm => "printf(\"" + type_format(stm[4][0]) + "\\n\", " + stm[4][0] + ")"
        },
    {"name": "Declare$subexpression$1$ebnf$1", "symbols": []},
    {"name": "Declare$subexpression$1$ebnf$1$subexpression$1", "symbols": [(lexer.has("t_id") ? {type: "t_id"} : t_id), "_", (lexer.has("t_comma") ? {type: "t_comma"} : t_comma), "_"]},
    {"name": "Declare$subexpression$1$ebnf$1", "symbols": ["Declare$subexpression$1$ebnf$1", "Declare$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Declare$subexpression$1", "symbols": ["Declare$subexpression$1$ebnf$1", (lexer.has("t_id") ? {type: "t_id"} : t_id)]},
    {"name": "Declare$subexpression$1$ebnf$2", "symbols": []},
    {"name": "Declare$subexpression$1$ebnf$2$subexpression$1$subexpression$1", "symbols": ["Value", "__", (lexer.has("t_to") ? {type: "t_to"} : t_to), "__", (lexer.has("t_id") ? {type: "t_id"} : t_id)]},
    {"name": "Declare$subexpression$1$ebnf$2$subexpression$1", "symbols": ["Declare$subexpression$1$ebnf$2$subexpression$1$subexpression$1", "_", (lexer.has("t_comma") ? {type: "t_comma"} : t_comma), "_"]},
    {"name": "Declare$subexpression$1$ebnf$2", "symbols": ["Declare$subexpression$1$ebnf$2", "Declare$subexpression$1$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Declare$subexpression$1$subexpression$1", "symbols": ["Value", "__", (lexer.has("t_to") ? {type: "t_to"} : t_to), "__", (lexer.has("t_id") ? {type: "t_id"} : t_id)]},
    {"name": "Declare$subexpression$1", "symbols": ["Declare$subexpression$1$ebnf$2", "Declare$subexpression$1$subexpression$1"]},
    {"name": "Declare", "symbols": [(lexer.has("t_declare") ? {type: "t_declare"} : t_declare), "__", (lexer.has("t_type") ? {type: "t_type"} : t_type), "__", "Declare$subexpression$1"], "postprocess": 
        stm => {
            let type = stm[2];
            switch(type.text) {
                case "integer": return "int " + idlist(stm[4], "integer", "");
                case "decimal": return "double " + idlist(stm[4], "decimal", "");
                case "scroll": return "char " + idlist(stm[4], "string", "[255]");
                default: return null;
            }
        }
        },
    {"name": "Atribution$subexpression$1", "symbols": ["Value"]},
    {"name": "Atribution$subexpression$1", "symbols": ["Expression"]},
    {"name": "Atribution", "symbols": ["Atribution$subexpression$1", "__", (lexer.has("t_to") ? {type: "t_to"} : t_to), "__", (lexer.has("t_id") ? {type: "t_id"} : t_id)], "postprocess": 
        stm => atrib(stm[4],stm[0][0],"")
        },
    {"name": "Conditional$ebnf$1$subexpression$1", "symbols": [(lexer.has("t_else") ? {type: "t_else"} : t_else), "Block"]},
    {"name": "Conditional$ebnf$1", "symbols": ["Conditional$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "Conditional$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Conditional", "symbols": [(lexer.has("t_if") ? {type: "t_if"} : t_if), "_", "RelationalOperation", "Block", "Conditional$ebnf$1"], "postprocess": 
        stm => {
            let if_stm = "if(" + stm[2] + ")" + stm[3];
            let else_block = stm[4];
            if (else_block) {
                if_stm = if_stm + " else " + else_block[1];
            }
            return if_stm;
        }
        },
    {"name": "Loop", "symbols": [(lexer.has("t_loop") ? {type: "t_loop"} : t_loop), "_", "RelationalOperation", "Block"]},
    {"name": "RelationalOperation", "symbols": ["Expression", "_", (lexer.has("t_relational_op") ? {type: "t_relational_op"} : t_relational_op), "_", "Expression"], "postprocess": 
        op => {
            if (op[0].type === 2 || op[4].type === 2 )
                throw Error("Invalid relational operation types")
            return op[0].string + " " + reltoC(op[2].text) + " " + op[4].string;
        }
        },
    {"name": "Expression$ebnf$1", "symbols": []},
    {"name": "Expression$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("t_sum") ? {type: "t_sum"} : t_sum)]},
    {"name": "Expression$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("t_sub") ? {type: "t_sub"} : t_sub)]},
    {"name": "Expression$ebnf$1$subexpression$1", "symbols": ["_", "Expression$ebnf$1$subexpression$1$subexpression$1", "_", "Term"]},
    {"name": "Expression$ebnf$1", "symbols": ["Expression$ebnf$1", "Expression$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Expression", "symbols": ["Term", "Expression$ebnf$1"], "postprocess": 
        exp => {
            let first_term = exp[0], list_terms = exp[1];
            let type = Math.max(...list_terms.reduce((list, part) => list.concat(part[3].types), first_term.types));
            if (type === 2) {
                throw Error("Incompatible types in expression: " + first_term.string + list_terms.map(part => part[1] + part[3].string));
            }
            return {type: type, string: first_term.string + list_terms.map(part => part[1] + part[3].string)};
        }
        },
    {"name": "Term$ebnf$1", "symbols": []},
    {"name": "Term$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("t_mult") ? {type: "t_mult"} : t_mult)]},
    {"name": "Term$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("t_div") ? {type: "t_div"} : t_div)]},
    {"name": "Term$ebnf$1$subexpression$1", "symbols": ["_", "Term$ebnf$1$subexpression$1$subexpression$1", "_", "Value"]},
    {"name": "Term$ebnf$1", "symbols": ["Term$ebnf$1", "Term$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": ["Value", "Term$ebnf$1"], "postprocess":  
        term => {
            let types = term[1].map(part => term_check(part[3])).concat(term_check(term[0]));
            return {types: types, string: term[0] + term[1].map(part => part[1] + part[3])};
        }
        },
    {"name": "Value", "symbols": [(lexer.has("t_integer") ? {type: "t_integer"} : t_integer)], "postprocess": id},
    {"name": "Value", "symbols": [(lexer.has("t_decimal") ? {type: "t_decimal"} : t_decimal)], "postprocess": id},
    {"name": "Value", "symbols": [(lexer.has("t_string") ? {type: "t_string"} : t_string)], "postprocess": id},
    {"name": "Value", "symbols": [(lexer.has("t_id") ? {type: "t_id"} : t_id)], "postprocess": id},
    {"name": "Value", "symbols": [(lexer.has("t_lparen") ? {type: "t_lparen"} : t_lparen), "_", "Expression", "_", (lexer.has("t_rparen") ? {type: "t_rparen"} : t_rparen)], "postprocess": value => "(" + value[2] + ")"},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1$subexpression$1", "symbols": [(lexer.has("t_wschar") ? {type: "t_wschar"} : t_wschar)]},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "_$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": d => null},
    {"name": "__$ebnf$1$subexpression$1", "symbols": [(lexer.has("t_wschar") ? {type: "t_wschar"} : t_wschar)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1$subexpression$1"]},
    {"name": "__$ebnf$1$subexpression$2", "symbols": [(lexer.has("t_wschar") ? {type: "t_wschar"} : t_wschar)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "__$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": d => null},
    {"name": "___$ebnf$1", "symbols": []},
    {"name": "___$ebnf$1$subexpression$1", "symbols": [(lexer.has("t_newline") ? {type: "t_newline"} : t_newline)]},
    {"name": "___$ebnf$1$subexpression$1", "symbols": [(lexer.has("t_wschar") ? {type: "t_wschar"} : t_wschar)]},
    {"name": "___$ebnf$1", "symbols": ["___$ebnf$1", "___$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "___", "symbols": ["___$ebnf$1"], "postprocess": d => null}
]
  , ParserStart: "Script"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
