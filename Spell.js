// Generated automatically by nearley, version 2.18.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const SpellC = require('./SpellC');
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
        t_begin: ["lumos","Lumos"],
        t_end: ["nox","Nox"],
        t_read: ["legilimens","Legilimens"],
        t_print: ["revelio","Revelio"],
        t_declare: ["fidelius","Fidelius"],
        t_if: ["expecto","Expecto"],
        t_else: ["expulso","Expulso"],
        t_loop: ["incarcerous","Incarcerous"],
        t_do: ["do","Do"],
        t_to: ["to"],
        t_type: ["integer","decimal","scroll"],
        t_not: ["not"],
        t_is: ["is"],
        t_or: ["or"],
        t_relational_op: ["greater", "less"],
        t_than: ["than"],
        t_equal: ["equal"]
    })}
})

let spell = new SpellC();
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "Script", "symbols": ["Lines"], "postprocess":  
        script => spell.script(script[0])
        },
    {"name": "Block", "symbols": ["___", (lexer.has("t_begin") ? {type: "t_begin"} : t_begin), "Lines", (lexer.has("t_end") ? {type: "t_end"} : t_end), "___"], "postprocess":  
        block => spell.block(block[2])
        },
    {"name": "Lines$ebnf$1$subexpression$1", "symbols": ["Spell", "_", (lexer.has("t_point") ? {type: "t_point"} : t_point), "___"]},
    {"name": "Lines$ebnf$1", "symbols": ["Lines$ebnf$1$subexpression$1"]},
    {"name": "Lines$ebnf$1$subexpression$2", "symbols": ["Spell", "_", (lexer.has("t_point") ? {type: "t_point"} : t_point), "___"]},
    {"name": "Lines$ebnf$1", "symbols": ["Lines$ebnf$1", "Lines$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Lines", "symbols": ["___", "Lines$ebnf$1"], "postprocess": 
        cmd =>  cmd[1].map(spell => "\t".repeat(spell.level) + spell[0] + "\n")
         },
    {"name": "Spell$subexpression$1", "symbols": ["Declare"]},
    {"name": "Spell$subexpression$1", "symbols": ["Atribution"]},
    {"name": "Spell$subexpression$1", "symbols": ["Read"]},
    {"name": "Spell$subexpression$1", "symbols": ["Print"]},
    {"name": "Spell$subexpression$1", "symbols": ["Conditional"]},
    {"name": "Spell$subexpression$1", "symbols": ["Loop"]},
    {"name": "Spell$subexpression$1", "symbols": ["LoopDo"]},
    {"name": "Spell", "symbols": ["Spell$subexpression$1"], "postprocess": 
        (cmd) => {
            return cmd[0] + ";";
        }
        },
    {"name": "Read", "symbols": [(lexer.has("t_read") ? {type: "t_read"} : t_read), "_", (lexer.has("t_lparen") ? {type: "t_lparen"} : t_lparen), "_", (lexer.has("t_id") ? {type: "t_id"} : t_id), "_", (lexer.has("t_rparen") ? {type: "t_rparen"} : t_rparen)], "postprocess": 
        stm => spell.read(stm[4])
        },
    {"name": "Print$subexpression$1", "symbols": [(lexer.has("t_id") ? {type: "t_id"} : t_id)]},
    {"name": "Print$subexpression$1", "symbols": [(lexer.has("t_string") ? {type: "t_string"} : t_string)]},
    {"name": "Print", "symbols": [(lexer.has("t_print") ? {type: "t_print"} : t_print), "_", (lexer.has("t_lparen") ? {type: "t_lparen"} : t_lparen), "_", "Print$subexpression$1", "_", (lexer.has("t_rparen") ? {type: "t_rparen"} : t_rparen)], "postprocess": 
        stm => spell.print(stm[4][0])
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
        stm => spell.declare(stm[2], stm[4])
        },
    {"name": "Atribution$subexpression$1", "symbols": ["Value"]},
    {"name": "Atribution$subexpression$1", "symbols": ["Expression"]},
    {"name": "Atribution", "symbols": ["Atribution$subexpression$1", "__", (lexer.has("t_to") ? {type: "t_to"} : t_to), "__", (lexer.has("t_id") ? {type: "t_id"} : t_id)], "postprocess": 
        stm => spell.atribution(stm[4],stm[0][0],"")
        },
    {"name": "Conditional$ebnf$1$subexpression$1", "symbols": [(lexer.has("t_else") ? {type: "t_else"} : t_else), "Block"]},
    {"name": "Conditional$ebnf$1", "symbols": ["Conditional$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "Conditional$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Conditional", "symbols": [(lexer.has("t_if") ? {type: "t_if"} : t_if), "_", "RelationalOperation", "Block", "Conditional$ebnf$1"], "postprocess": 
        stm => spell.conditional(stm[2], stm[3], stm[4])
        },
    {"name": "Loop", "symbols": [(lexer.has("t_loop") ? {type: "t_loop"} : t_loop), "_", "RelationalOperation", "Block"], "postprocess": 
        stm => spell.loop(stm[2], stm[3])
        },
    {"name": "LoopDo", "symbols": [(lexer.has("t_do") ? {type: "t_do"} : t_do), "Block", (lexer.has("t_loop") ? {type: "t_loop"} : t_loop), "_", "RelationalOperation"], "postprocess": 
        stm => spell.loopDo(stm[1], stm[4])
        },
    {"name": "RelationalOperation", "symbols": ["Expression", "_", "RelationalOperator", "_", "Expression"], "postprocess": 
        op => spell.relationalOperation(op[0], op[2], op[4]) 
        },
    {"name": "RelationalOperator$subexpression$1$ebnf$1", "symbols": [(lexer.has("t_not") ? {type: "t_not"} : t_not)], "postprocess": id},
    {"name": "RelationalOperator$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "RelationalOperator$subexpression$1", "symbols": ["RelationalOperator$subexpression$1$ebnf$1", "_", (lexer.has("t_is") ? {type: "t_is"} : t_is)]},
    {"name": "RelationalOperator", "symbols": ["RelationalOperator$subexpression$1"], "postprocess": 
        op => spell.relationEqual(op[0][0],op[0][2])
                            },
    {"name": "RelationalOperator$subexpression$2", "symbols": [(lexer.has("t_relational_op") ? {type: "t_relational_op"} : t_relational_op), "_", (lexer.has("t_than") ? {type: "t_than"} : t_than)]},
    {"name": "RelationalOperator$subexpression$2$subexpression$1", "symbols": [(lexer.has("t_or") ? {type: "t_or"} : t_or), "_", (lexer.has("t_equal") ? {type: "t_equal"} : t_equal)]},
    {"name": "RelationalOperator$subexpression$2", "symbols": ["RelationalOperator$subexpression$2$subexpression$1"]},
    {"name": "RelationalOperator", "symbols": ["RelationalOperator$subexpression$2"], "postprocess": 
        op => spell.relationLessGreater(op[0])
                            },
    {"name": "Expression$ebnf$1", "symbols": []},
    {"name": "Expression$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("t_sum") ? {type: "t_sum"} : t_sum)]},
    {"name": "Expression$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("t_sub") ? {type: "t_sub"} : t_sub)]},
    {"name": "Expression$ebnf$1$subexpression$1", "symbols": ["_", "Expression$ebnf$1$subexpression$1$subexpression$1", "_", "Term"]},
    {"name": "Expression$ebnf$1", "symbols": ["Expression$ebnf$1", "Expression$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Expression", "symbols": ["Term", "Expression$ebnf$1"], "postprocess": 
        exp => spell.expression(exp[0], exp[1])
        },
    {"name": "Term$ebnf$1", "symbols": []},
    {"name": "Term$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("t_mult") ? {type: "t_mult"} : t_mult)]},
    {"name": "Term$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("t_div") ? {type: "t_div"} : t_div)]},
    {"name": "Term$ebnf$1$subexpression$1", "symbols": ["_", "Term$ebnf$1$subexpression$1$subexpression$1", "_", "Value"]},
    {"name": "Term$ebnf$1", "symbols": ["Term$ebnf$1", "Term$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Term", "symbols": ["Value", "Term$ebnf$1"], "postprocess":  
        term => spell.term(term[0], term[1])
        },
    {"name": "Value", "symbols": [(lexer.has("t_integer") ? {type: "t_integer"} : t_integer)], "postprocess": id},
    {"name": "Value", "symbols": [(lexer.has("t_decimal") ? {type: "t_decimal"} : t_decimal)], "postprocess": id},
    {"name": "Value", "symbols": [(lexer.has("t_string") ? {type: "t_string"} : t_string)], "postprocess": id},
    {"name": "Value", "symbols": [(lexer.has("t_id") ? {type: "t_id"} : t_id)], "postprocess": id},
    {"name": "Value", "symbols": [(lexer.has("t_lparen") ? {type: "t_lparen"} : t_lparen), "_", "Expression", "_", (lexer.has("t_rparen") ? {type: "t_rparen"} : t_rparen)], "postprocess": value => ["(", value[2], ")"]},
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
