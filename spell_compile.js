let fs = require('fs');
let nearley = require('nearley');
let grammar = require("./Spell.js");

let parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

let filename = process.argv[2];
fs.readFile(filename, 'utf8', (err, data) => {
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
    parser.feed(data);
    console.log(parser.results[0]);
}