import { parse } from "@babel/parser";
import { type NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;
import _generate from "@babel/generator";
const generate = _generate.default;

const variableName = "a";
const code = `
const a = [1, 2, 3];
const b = () => {
  return a[0] + a[1] + a[2];
};
`;

const ast = parse(code);

traverse(ast, {
  VariableDeclarator(path: NodePath<t.VariableDeclarator>) {
    if (path.node.id.name === variableName) {
      const parentPath = path.findParent((parent: NodePath) =>
        parent.isProgram()
      );
      if (!parentPath) {
        return;
      }

      const binding = path.scope.getBinding(variableName);

      if (!binding) {
        return;
      }

      const references = binding.referencePaths;

      if (references.length === 0) {
        return;
      }

      const value = path.node.init;
      if (!t.isArrayExpression(value)) {
        return;
      }

      const elements = value.elements;

      if (!elements) {
        return;
      }

      const newNodes = elements.map((element) => {
        if (!t.isNumericLiteral(element)) {
          return element;
        }

        return t.numericLiteral(element.value);
      });

      let isNoSideEffects = true;

      references.forEach((reference: NodePath) => {
        const accessPath = reference.parentPath;
        const explicitIndex = accessPath.node.property.value;

        if (typeof explicitIndex === "number") {
          const newElement = newNodes[explicitIndex] ||
            t.identifier("undefined");

          if (t.isFunction(newElement)) {
            isNoSideEffects = false
            return;
          }

          accessPath.replaceWith(newElement);
        } else {
          isNoSideEffects = false;
        }
      });

      if (isNoSideEffects) {
        path.remove();
      }
    }
  },
});

const { code: transformedCode } = generate(ast);

console.log(transformedCode);
