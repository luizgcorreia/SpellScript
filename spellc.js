let fs = require('fs');
let nearley = require('nearley');
let grammar = require("./Spell.js");

let parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

fs.readFile('test.spell', 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error('File does not exist.');
        return;
      }
  
      throw err;
    }
  
    compile(data);
  });

function compile(data) {
    //let source = data.replace(/[ \t]+/g," ");
    //console.log(source);
    parser.feed(data);
    console.log(parser.results[0]);
}