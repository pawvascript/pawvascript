const fs = require('fs');
const ohm = require('ohm-js');

const grammar = ohm.grammar(fs.readFileSync('grammar/pawvascript.ohm'));

module.exports = (text, startPoint) => startPoint ? grammar.match(text, startPoint).succeeded() : grammar.match(text).succeeded();