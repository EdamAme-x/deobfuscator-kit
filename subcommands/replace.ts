import { parse } from "@babel/parser";
import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;
import _generate from "@babel/generator";
import { parseArg } from "../utils/parseArg.ts";
const generate = _generate.default;

export const replaceArray = (
  filepath: string,
  name: string,
  output?: string,
  override?: string,
  ignoreSideEffects?: string,
) => {
  const code = Deno.readTextFileSync(filepath);

  const ast = parse(code);
  const isIgnoreSideEffects = parseArg(ignoreSideEffects);

  traverse(ast, {
    VariableDeclarator(path: NodePath<t.VariableDeclarator>) {
      if (path.node.id.name === name) {
        const parentPath = path.findParent((parent: NodePath) =>
          parent.isProgram()
        );
        if (!parentPath) {
          return;
        }

        const binding = path.scope.getBinding(name);

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
            const newElement = newNodes.reverse()[explicitIndex] ||
              t.identifier("undefined");

            if (t.isCallExpression(newElement) && !isIgnoreSideEffects) {
              isNoSideEffects = false;
              return;
            }

            accessPath.replaceWith(newElement);
          } else if (!isIgnoreSideEffects) {
            isNoSideEffects = false;
          }
        });

        if (isNoSideEffects || isIgnoreSideEffects) {
          path.remove();
        }
      }
    },
  });

  const { code: transformedCode } = generate(ast);

  const isStdout = output === "stdout";
  const isOverride = parseArg(override);

  if (isStdout) {
    console.log(transformedCode);
  } else if (isOverride) {
    Deno.writeTextFileSync(filepath, transformedCode);
  } else {
    Deno.writeTextFileSync(output || filepath, transformedCode);
  }
};

export const replaceObject = (
  filepath: string,
  name: string,
  output?: string,
  override?: string,
  ignoreSideEffects?: string,
) => {
  const code = Deno.readTextFileSync(filepath);
  const ast = parse(code);
  const isIgnoreSideEffects = parseArg(ignoreSideEffects);

  traverse(ast, {
    VariableDeclarator(path: NodePath<t.VariableDeclarator>) {
      if (path.node.id.name === name) {
        const parentPath = path.findParent((parent: NodePath) =>
          parent.isProgram()
        );
        if (!parentPath) {
          return;
        }

        const binding = path.scope.getBinding(name);
        if (!binding) {
          return;
        }

        const references = binding.referencePaths;
        if (references.length === 0) {
          return;
        }

        const value = path.node.init;
        if (!t.isObjectExpression(value)) {
          return;
        }

        const properties = value.properties;
        if (!properties) {
          return;
        }

        const newNodes = properties.map((property) => {
          if (
            !t.isObjectProperty(property) || !t.isNumericLiteral(property.value)
          ) {
            return property;
          }
          return t.objectProperty(
            property.key,
            t.numericLiteral(property.value.value),
          );
        });

        let isNoSideEffects = true;

        references.forEach((reference: NodePath) => {
          const accessPath = reference.parentPath;
          const propertyName = accessPath.node.property.value;

          const newElement = newNodes.reverse().find((prop) => {
            if (!t.isObjectProperty(prop)) {
              return false;
            }

            if (!("value" in prop.key)) {
              return false;
            }

            return prop.key.value == propertyName;
          }) ||
            t.identifier("undefined");

          if (!("value" in newElement)) {
            return;
          }

          if (t.isCallExpression(newElement.value) && !isIgnoreSideEffects) {
            isNoSideEffects = false;
            return;
          }

          accessPath.replaceWith(newElement.value);
        });

        if (isNoSideEffects || isIgnoreSideEffects) {
          path.remove();
        }
      }
    },
  });

  const { code: transformedCode } = generate(ast);

  const isStdout = output === "stdout";
  const isOverride = parseArg(override);

  if (isStdout) {
    console.log(transformedCode);
  } else if (isOverride) {
    Deno.writeTextFileSync(filepath, transformedCode);
  } else {
    Deno.writeTextFileSync(output || filepath, transformedCode);
  }
};
