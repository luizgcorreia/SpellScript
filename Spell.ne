@{%
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
%}

@lexer lexer


Script -> Lines {% 
    script => spell.script(script[0])
%}

Block -> ___ %t_begin Lines %t_end ___ {% 
    block => spell.block(block[2])
%}

Lines -> ___ (Spell _ %t_point ___):+ {%
    cmd =>  cmd[1].map(spell => "\t".repeat(spell.level) + spell[0] + "\n")
 %}

Spell -> (Declare | Atribution | Read | Print | Conditional | Loop | LoopDo) {%
    (cmd) => {
        return cmd[0] + ";";
    }
%}

Read -> %t_read _ %t_lparen _ %t_id _ %t_rparen {%
    stm => spell.read(stm[4])
%}

Print -> %t_print _ %t_lparen _ (%t_id|%t_string) _ %t_rparen {%
    stm => spell.print(stm[4][0])
%}

Declare -> %t_declare __ %t_type __ (
        (%t_id _ %t_comma _):* %t_id
        | 
        ( (Value __ %t_to __ %t_id) _ %t_comma _):* (Value __ %t_to __ %t_id)
    ) 
{%
    stm => spell.declare(stm[2], stm[4])
%}

Atribution -> (Value|Expression) __ %t_to __ %t_id {%
    stm => spell.atribution(stm[4],stm[0][0],"")
%}

Conditional -> %t_if _ RelationalOperation Block (%t_else Block):? {%
    stm => spell.conditional(stm[2], stm[3], stm[4])
%}

Loop -> %t_loop _ RelationalOperation Block {%
    stm => spell.loop(stm[2], stm[3])
%}

LoopDo -> %t_do Block %t_loop _ RelationalOperation {%
    stm => spell.loopDo(stm[1], stm[4])
%}

RelationalOperation -> Expression _ RelationalOperator _ Expression {%
    op => spell.relationalOperation(op[0], op[2], op[4]) 
%}

RelationalOperator -> 
                    (%t_not:? _ %t_is) 
                    {%
                        op => spell.relationEqual(op[0][0],op[0][2])
                    %}
                    | 
                    (%t_relational_op _ %t_than | (%t_or _ %t_equal)) 
                    {%
                        op => spell.relationLessGreater(op[0])
                    %}

Expression -> Term ( _ (%t_sum|%t_sub) _ Term):* {%
    exp => spell.expression(exp[0], exp[1])
%}
Term -> Value ( _ (%t_mult|%t_div) _ Value):* {% 
    term => spell.term(term[0], term[1])
%}

Value -> %t_integer {% id %} | %t_decimal {% id %} | %t_string {% id %} | %t_id {% id %} | %t_lparen _ Expression _ %t_rparen {% value => ["(", value[2], ")"] %}

# Whitespace: '_' is optional, '__' is mandatory.
_  -> (%t_wschar):* {% d => null %}
__ -> (%t_wschar):+ {% d => null %}
___ -> (%t_newline|%t_wschar):* {% d => null %}