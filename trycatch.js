const core = require("@babel/core");
const { tryStatement } = require("babel-types");
const types = require("babel-types");
const esprima = require('esprima');
const template = require('@babel/template');

const sourceCode = `
function sum(a, b) {
  return a + b + c;
}
`;
const transformCode = `
function sum(a, b) {
  try {
    return a + b + c;
  } catch(error) {
    console.log(error)    
  }
}
`
// const ast = esprima.parseModule(sourceCode);

let TryCatchPluginTransform = {
  visitor: {
    FunctionDeclaration(nodePath) {
      let {node} = nodePath;
      let {id} = node;
      let blockStatement = node.body;
      if(blockStatement.body && types.isTryStatement(blockStatement.body[0])) {
        return; 
      }

      let catchStatement = template.statement('console.log(error)')();
      let catchClause = types.catchClause(types.identifier('error'), types.blockStatement([catchStatement]));
      const tryStatement = types.tryStatement(node.body,catchClause);
      // 创建一个函数节点,id 与参数不变这里的id指的是ast中的id与params
      const func = types.functionDeclaration(id,node.params, types.blockStatement([
        tryStatement
      ]), node.generator, node.async);
      nodePath.replaceWith(func);
    }
  },
};

/**
 * babel-core本身只是用来生成语法树，遍历语法树，生成新代码
 * 并不负责转换语法树
 */
let targetCode = core.transform(sourceCode, {
  plugins: [TryCatchPluginTransform],
});
console.log(targetCode.code);
