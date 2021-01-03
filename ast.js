const esprima = require('esprima'); // 把源代码转换成抽象语法树
const estraverse = require('estraverse'); // 用于遍历AST
const escodegen = require('escodegen');// 把AST生成代码字符串

const sourceCode = `function ast(){}`;
const ast = esprima.parseModule(sourceCode);
// console.log(ast)


// 用于填充空格进行缩进
let indent = 0;
const padding = () => " ".repeat(indent);
/**
 * 采用深度优先遍历有type属性的语法树的节点
 * 在遍历语法树时可对语法树进行修改
 */
estraverse.traverse(ast,{
    enter(node) { 
      console.log(padding() + '进入' + node.type );
      indent += 2;
    },  
    leave(node) {
      indent -= 2;
      console.log(padding() + '离开' + node.type );
    }
})
/*
进入Program
  进入FunctionDeclaration
    进入Identifier
    离开Identifier
    进入BlockStatement
    离开BlockStatement
  离开FunctionDeclaration
离开Program
 */

 // 生成代码
 let targetCode = escodegen.generate(ast);
 console.log(targetCode)