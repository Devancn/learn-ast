let esprima = require("esprima"); // es解析器
let estraverse = require('estraverse-fb')// facebook出的专门针对jsx的遍历器
let sourceCode = `<h1 id="title"><span>hello</span>world</h1>`;
let ast = esprima.parseModule(sourceCode, { jsx: true, tokens: true }) // jsx: 表示sourceCode属于jsx语法，tokens：打印tokens信息
/*
* esprima内部要得到抽象语法书，需要经过2步骤
* 1. 把源代码进行分词，得到一个tokens的数组
* 2. 把token数组转成一个抽象语法树
Module {
  type: 'Program',
  body: [
    ExpressionStatement {
      type: 'ExpressionStatement',
      expression: [JSXElement]
    }
  ],
  sourceType: 'module',
  tokens: [
    { type: 'Punctuator', value: '<' },
    { type: 'JSXIdentifier', value: 'h1' },
    { type: 'JSXIdentifier', value: 'id' },
    { type: 'Punctuator', value: '=' },
    { type: 'String', value: '"title"' },
    { type: 'Punctuator', value: '>' },
    { type: 'Punctuator', value: '<' },
    { type: 'JSXIdentifier', value: 'span' },
    { type: 'Punctuator', value: '>' },
    { type: 'JSXText', value: 'hello' },
    { type: 'Punctuator', value: '<' },
    { type: 'Punctuator', value: '/' },
    { type: 'JSXIdentifier', value: 'span' },
    { type: 'Punctuator', value: '>' },
    { type: 'JSXText', value: 'world' },
    { type: 'Punctuator', value: '<' },
    { type: 'Punctuator', value: '/' },
    { type: 'JSXIdentifier', value: 'h1' },
    { type: 'Punctuator', value: '>' }
  ]
}
*/
let ident = 0; // 打印节点时缩进的空格树

function padding() {
    return ' '.repeat(ident);
}

/*
 visitor 访问器, 对ast进行深度优先遍历，没进入一个node节点会触发enter函数，并把相应的
 节点信息传给该函数。遍历完某个节点离开时会触发leave函数并把该节点的信息传递给该函数
*/
estraverse.traverse(ast, {
    enter(node) {
        console.log(padding() + node.type + '进入');
        ident += 2;
    },
    leave(node) {
        ident -= 2;
        console.log(padding() + node.type + '离开');
    }
})