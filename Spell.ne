@{%
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

%}

@lexer lexer


Script -> Lines {% 
    script => "#include <stdio.h>\n\nint main() {\n" + script[0] + "\treturn 0;\n}"
%}

Block -> ___ %t_begin Lines %t_end ___ {% 
    block => "{\n" + block[2] + "}"
%}

Lines -> ___ (Spell _ %t_point ___):+ {%
    cmd =>  cmd[1].map(spell => "\t" + spell[0] + "\n").reverse().reduce((stm, lines) => lines + stm, "") 
 %}

Spell -> (Declare | Atribution | Read | Print | Conditional | Loop) {%
    (cmd) => {
        return cmd[0] + ";";
    }
%}

Read -> %t_read _ %t_lparen _ %t_id _ %t_rparen {%
    stm => "scanf(\"" + type_format(stm[4]) + "\", " + "&" + stm[4] + ")"
%}

Print -> %t_print _ %t_lparen _ (%t_id|%t_string) _ %t_rparen {%
    stm => "printf(\"" + type_format(stm[4][0]) + "\\n\", " + stm[4][0] + ")"
%}

Declare -> %t_declare __ %t_type __ (
        (%t_id _ %t_comma _):* %t_id
        | 
        ( (Value __ %t_to __ %t_id) _ %t_comma _):* (Value __ %t_to __ %t_id)
    ) 
{%
    stm => {
        let type = stm[2];
        switch(type.text) {
            case "integer": return "int " + idlist(stm[4], "integer", "");
            case "decimal": return "double " + idlist(stm[4], "decimal", "");
            case "scroll": return "char " + idlist(stm[4], "string", "[255]");
            default: return null;
        }
    }
%}

Atribution -> (Value|Expression) __ %t_to __ %t_id {%
    stm => atrib(stm[4],stm[0][0],"")
%}

Conditional -> %t_if _ RelationalOperation Block (%t_else Block):? {%
    stm => {
        let if_stm = "if(" + stm[2] + ")" + stm[3];
        let else_block = stm[4];
        if (else_block) {
            if_stm = if_stm + " else " + else_block[1];
        }
        return if_stm;
    }
%}

Loop -> %t_loop _ RelationalOperation Block

RelationalOperation -> Expression _ %t_relational_op _ Expression {%
    op => {
        if (op[0].type === 2 || op[4].type === 2 )
            throw Error("Invalid relational operation types")
        return op[0].string + " " + reltoC(op[2].text) + " " + op[4].string;
    }
%}

Expression -> Term ( _ (%t_sum|%t_sub) _ Term):* {%
    exp => {
        let first_term = exp[0], list_terms = exp[1];
        let type = Math.max(...list_terms.reduce((list, part) => list.concat(part[3].types), first_term.types));
        if (type === 2) {
            throw Error("Incompatible types in expression: " + first_term.string + list_terms.map(part => part[1] + part[3].string));
        }
        return {type: type, string: first_term.string + list_terms.map(part => part[1] + part[3].string)};
    }
%}
Term -> Value ( _ (%t_mult|%t_div) _ Value):* {% 
    term => {
        let types = term[1].map(part => term_check(part[3])).concat(term_check(term[0]));
        return {types: types, string: term[0] + term[1].map(part => part[1] + part[3])};
    }
%}

Value -> %t_integer {% id %} | %t_decimal {% id %} | %t_string {% id %} | %t_id {% id %} | %t_lparen _ Expression _ %t_rparen {% value => "(" + value[2] + ")" %}

# Whitespace: '_' is optional, '__' is mandatory.
_  -> (%t_wschar):* {% d => null %}
__ -> (%t_wschar):+ {% d => null %}
___ -> (%t_newline|%t_wschar):* {% d => null %}