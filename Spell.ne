@{%
const moo = require('moo');

const lexer = moo.compile({
    ws: /[ \t]/,
    newline: { match: /\n/, lineBreaks: true },
    integer: /[0-9]+/,
    identifier: /[a-zA-Z][a-zA-Z0-9_]*/,
    lparen: "(",
    rparen: ")"
})
%}

Script -> ___ (Block|Lines):+ ___

Block -> ___ "lumos" Lines "nox" ___

Lines -> (___ Spell ["."]:? t_newline):* ___ Spell ["."]:? ___

Spell -> Declare | Read | Print | Conditional | Loop

Read -> "legilimens" _ "(" _ Id _ ")"

Print -> "revelio" _ "(" _ (Id|Text) _ ")"

Declare -> "fidelius" __ (IdList | AtribututionList)
IdList -> (Id _ "," _):* Id
AtribututionList -> (Secret _ "," _):* Secret
Secret -> Value __ "to" __ Id

Conditional -> "expecto" _ Expression _ Relational_Op _ Expression Block ("expulso" Block):?

Loop -> "incarcerous" _ Expression _ Relational_Op _ Expression Block

Relational_Op ->  "greater than" | "less than" | "greater or equal" | "less or equal" | "not is" | "is"

Expression -> Term ( _ ("+"|"-") _ Term):*
Term -> Value (("*"|"/") Value):*

Value -> Number | Id | "(" _ Expression _ ")"
Text -> "\"" [ a-zA-Z0-9]:+ "\""
Id -> [a-zA-Z]:+
Number -> [0-9]:+


t_newline -> [\n\r]
_ -> [\s\t]:*
__ -> [\s\t]:+
___ -> [\s\t\n\r]:* 

