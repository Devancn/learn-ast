const core = require("@babel/core");
const types = require("babel-types");
const esprima = require('esprima');
const BabelPluginTransformClasses = require("@babel/plugin-transform-classes");

const sourceCode = `
class Person{
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}
`;
// const ast = esprima.parseModule(sourceCode);

let BabelPluginTransformClasses2 = {
  visitor: {
    ClassDeclaration(nodePath) {
      let {node} = nodePath;
      let {id} = node;
      let classMethods = node.body.body;
      let body = [];
      classMethods.forEach(method => {
        // 判断方法类型
        if(method.kind === 'constructor') {
          // 使用types工具创建一个type为functionDeclaration的节点
          let constructorFunction = types.functionDeclaration(id, method.params, method.body,method.generator,method.async);
          body.push(constructorFunction);
        } else {
          let left = types.memberExpression(types.memberExpression(id, types.identifier('prototype')), method.key);
          let right = types.functionDeclaration(null,method.params,method.body,method.generator,method.async);
          // 使用types工具创建一个type为assignmentExpression的节点
          let assignmentExpression = types.assignmentExpression('=', left, right);
          body.push(assignmentExpression);
        }
      });
      // 替换成多借点
      nodePath.replaceWithMultiple(body);
    },
  },
};

/**
 * babel-core本身只是用来生成语法树，遍历语法树，生成新代码
 * 并不负责转换语法树
 */
let targetCode = core.transform(sourceCode, {
  plugins: [BabelPluginTransformClasses2],
});
console.log(targetCode);

console.log(targetCode.code);
