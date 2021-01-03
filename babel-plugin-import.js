const { types } = require("@babel/core");

//  吧importSpecifier变成import DefaultSpecifier
const visitor = {
  ImportDeclaration: {
    // 当遍历到type为ImportSpecifier时会执行此函数，第一个参数为节点的路径，第二个参数为节点的状态
    enter(path, { opts }) {
      const { node } = path;
      const specifiers = node.specifiers;
      const source = node.source;
      if (
        opts.libraryName === source.value &&
        !types.isImportDefaultSpecifier(specifiers[0])
      ) {
        const defaultImportDeclaration = specifiers.map((specifier) => {
          const importDefaultSpecifier = types.importDefaultSpecifier(
            specifier.local
          );
          return types.importDeclaration(
            [importDefaultSpecifier],
            types.stringLiteral(
              `${node.source.value}/${opts.libraryDirectory}/${specifier.imported.name}`
            ),
          );
        });
        path.replaceWithMultiple(defaultImportDeclaration);
      }
    },
  },
};
module.exports = function (babel) {
  return {
    visitor,
  };
};
