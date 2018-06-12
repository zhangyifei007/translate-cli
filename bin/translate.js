#! /usr/bin/env node

var program = require('commander');
var colors = require('colors');
require('es6-promise').polyfill();
require('isomorphic-fetch');


program
  .version('0.0.1', '-v, --version')
  .usage('-[cmd] [input]')
  // .option('-q, --query', 'translate word');
  
program.on('--help', function(){
  console.log('  Examples:');
  console.log('');
  console.log('    $ translate -h');
  console.log('    $ translate -v');
  console.log('    $ translate hello');
  console.log('');
});

program.parse(process.argv);

if (!process.argv[2]) {
  program.help()
}

const API = 'http://fanyi.youdao.com/openapi.do?keyfrom=toaijf&key=868480929&type=data&doctype=json&version=1.1'
const url = encodeURI(`${API}&q=${program.args[0]}`)

fetch(url)
  .then(response => response.json())
  .then(data => {
    const {
      basic,
      translation,
      // query,
      web
    } = data

    console.log(`\n${colors.yellow('翻译')}\n`)
    // console.log(`   ${colors.blue('翻译文字')}: ${colors.yellow(query)}\n`)
    if (basic && basic.explains) {
      console.log(`   ${colors.blue('简明释义')}: ${colors.green(basic.explains[0])}\n`)
    }

    if (translation) {
      console.log(`   ${colors.blue('翻译结果')}: ${colors.green(translation[0])}\n`)
    }

    if (web) {
      console.log(`\n${colors.yellow('示例')}\n`)

      if (web && Array.isArray(web)) {
        web.forEach(({key, value}) => {
          console.log(`${colors.blue(key)}: ${colors.green(value[0])}\n`)
        })
      }
    }

  });
