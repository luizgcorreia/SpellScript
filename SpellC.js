class SpellC {
    constructor() {
        this.var_map = {};
        this.level = 0;
    }

    script(lines) {
        return "#include <stdio.h>\n\nint main() {\n" + lines.reduce((lines, stm) => lines + stm, "") + "\treturn 0;\n}";
    }

    block(lines) {
        let string = "{\n" + lines.reduce((text, stm) => text + "\t" + stm, "")  + "\t}";
        return string;
    }

    read(id) {
        return "scanf(\"" + this._type_format(id) + "\", " + "&" + id + ")";
    }

    print(id) {
        return "printf(\"" + this._type_format(id) + "\\n\", " + id + ")";
    }

    declare(type, ids) {

        let decl = (stm, type, arr) => {
            if(stm.text) {
                this.var_map[stm.text] = type;
                return stm.text;
            }
            else {
                this.var_map[stm[4]] = type;
                return stm[4] + arr +  " = " + stm[0];
            }
        };
        let idlist = (ids, type, arr) => ids[0].map(id => decl(id[0], type, arr) + ", ") + decl(ids[1], type, arr);

        switch(type.text) {
            case "integer": return "int " + idlist(ids, "integer", "");
            case "decimal": return "double " + idlist(ids, "decimal", "");
            case "scroll": return "char " + idlist(ids, "string", "[255]");
            default: return null;
        }
    }

    atribution(id, value, arr) {
        if (!this.var_map[id])
            throw Error("Secret to unfidelized " + id + ". You should use the fidelius spell first");
        
        switch(this.var_map[id]){
            case 'integer': {
                if (Number.isInteger(value.type)){
                    if (value.type !== 0)
                        throw Error("Incompatible types\n" + id + " expected an integer secret, but saw expression " + value.text);
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
                        throw Error("Incompatible types\n" + id + " expected a decimal secret, but saw expression " + value.text);
                } else {
                    if (isNaN(value))
                        throw Error("Incompatible types\n" + id + " expected a decimal secret, but saw " + value);
                }
                break;
            }
            case 'string': {
                if (Number.isInteger(value.type) && value.type !== 2)
                    throw Error("Incompatible types\nExpression " + value.text + " to a scroll");
                break;
            }
            default: {
    
            }
        }
    
        return id + arr +  " = " + value.text;
    }

    term(head, tail) {
        let types = tail.map(part => this._term_check(part[3])).concat(this._term_check(head));
        return {types: types, text: head + tail.map(part => part[1] + part[3])};
    }

    expression(head, tail) {
        let type = Math.max(...tail.reduce((list, part) => list.concat(part[3].types), head.types));
        
        if (type === 2) {
            throw Error("Incompatible types in expression: " + head.text + tail.map(part => part[1] + part[3].text));
        }
        return {type: type, text: head.text + tail.map(part => part[1] + part[3].text)};
    }

    conditional(condition, block, else_block) {
        let if_stm = "if(" + condition + ")" + block;
        if (else_block) {
            if_stm = if_stm + " else " + else_block[1];
        }
        return if_stm;
    }

    loop(condition, block) {
        return "while(" + condition + ")" + block;
    }

    loopDo(block, condition) {
        return "do " + block + "while(" + condition + ")";
    }

    relationalOperation(exp1, reloperator, exp2) {
        if (exp1.type === 2 || exp2.type === 2 )
            throw Error("Invalid relational operation types")
        return exp1.text + " " + reloperator + " " + exp2.text;
    }

    relationEqual(not, is) {
        let string;
        if (not)
            string = not + " " + is;
        else
            string = is.text;
        return this._reltoC(string);
    }

    relationLessGreater(op) {
        let string;            
        let rel_op_2 = op[2];
        if (rel_op_2.type === "t_than")
            string = op[0] + " than";
        else
            string = op[0] + " " + rel_op_2[0] + " " + rel_op_2[2];
        return this._reltoC(string);
    }

    _type_format(token) {
        let format;
        if (token.type === "t_id") {
            switch(this.var_map[token.text]){
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

    _term_check(term) {

        if (term.type === 't_id') {
            if (!this.var_map[term])
                throw Error("Unfidelized " + term + " in expression. You should use the fidelius spell first");
            switch(this.var_map[term]){
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

    _reltoC(op) {
        switch(op) {
            case "greater than": return ">";
            case "less than": return "<";
            case "greater or equal": return ">=";
            case "less or equal": return "<=";
            case "not is": return "!=";
            case "is": return "==";
            default: "";
        }
    }

}

module.exports = SpellC;