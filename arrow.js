let core = require("@babel/core");
let types = require("babel-types");
// const BabelPluginTransformEs2015ArrowFunctions = require("babel-plugin-transform-es2015-arrow-functions");

const sourceCode = `
const sum = (a, b) => {
  console.log(this);
  return a + b;
}
`;

 // 查找fnPath节点最近的有效的this环境（普通函数|顶层Program）
function findParent(fnPath) {
  do{
    if(fnPath.isFunction() && !fnPath.isArrowFunctionExpression() || fnPath.isProgram()) {
      return fnPath;
    }
  } while(fnPath = fnPath.parentPath);
}

function hoistFunctionEnvironment(fnPath) {
  // const thisEnvFn = fnPath.findParent(p => {
  //   return p.isFunction() && !p.isArrowFunctionExpression() || p.isProgram()
  // })
  const thisEnvFn = findParent(fnPath);
 let thisPaths =  getScopeInfoInformation(fnPath);
 let thisBinding = '_this';
 if(thisPaths.length > 0) {
   thisEnvFn.scope.push({
     /**
      * 在this函数环境中添加一个变量为_this，初始值为 types.thisExpression
      */
     id: types.identifier(thisBinding),
     init: types.thisExpression()
   })
   // 遍历所有使用到this的节点,把所有 types.thisExpression变成 thisRef(_this)
   thisPaths.forEach(thisChild => {
     let thisRef = types.identifier(thisBinding);
     thisChild.replaceWith(thisRef)
   })
 }
}

// 遍历语法树上子节点type为ThisExpression的节点并保存
function getScopeInfoInformation(fnPath) {
  debugger
  let thisPaths = [];
  fnPath.traverse({
    ThisExpression(thisPath) {
      thisPaths.push(thisPath)
    }
  })
  return thisPaths;
}
// babel插件本身就是一个对象，它会有一个visitor访问器
let BabelPluginTransformEs2015ArrowFunctions = {
  /**
   * 每个插件都有自己的访问器，不同的访问者产生的结果不同执行操作也不同
   */
  visitor: {
    // 这里的key表示AST中节点的type
    // babel在遍历到对应节点的type时会调用此函数
    // 参数是节点数据
    ArrowFunctionExpression(nodePath) {
      // 获取当前路径上的节点
      let node = nodePath.node;
      const thisBinding = hoistFunctionEnvironment(nodePath);
      node.type = "FunctionExpression";
    },
  },
};
/**
 * babel-core本身只是用来生成语法树，遍历语法树，生成新代码
 * 并不负责转换语法树
 */
let targetCode = core.transform(sourceCode, {
  plugins: [BabelPluginTransformEs2015ArrowFunctions],
});

console.log(targetCode.code);
