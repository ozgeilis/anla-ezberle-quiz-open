// Local dependency audit: static imports/exports, literal import(), require(),
// and @/ aliases. No module execution, credentials, or network access.
import { readdir, readFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
export interface Dependency {
  from: string;
  specifier: string;
  to: string | null;
}
export async function questionDependencies() {
  const files: string[] = [];
  const scan = async (dir: string) => {
    for (const entry of await readdir(join(root, dir), {
      withFileTypes: true,
    })) {
      const name = join(dir, entry.name);
      if (entry.isDirectory()) await scan(name);
      else if (/\.[cm]?[jt]sx?$/.test(entry.name)) files.push(name);
    }
  };
  // All source/tool/test directories, plus root configs. Native output is ignored.
  for (const dir of ["src", "scripts", "tests", "supabase"]) await scan(dir);
  files.push(...(await readdir(root)).filter((f) => /\.[cm]?[jt]sx?$/.test(f)));
  const edges: Dependency[] = [];
  for (const file of files.sort()) {
    const ast = ts.createSourceFile(
      file,
      await readFile(join(root, file), "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    const visit = (node: ts.Node) => {
      let specifier: string | undefined;
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      )
        specifier = node.moduleSpecifier.text;
      if (
        ts.isCallExpression(node) &&
        (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
          node.expression.getText(ast) === "require") &&
        node.arguments[0] &&
        ts.isStringLiteral(node.arguments[0])
      )
        specifier = node.arguments[0].text;
      if (
        specifier &&
        (specifier.startsWith(".") || specifier.startsWith("@/"))
      ) {
        const base = specifier.startsWith("@/")
          ? resolve(root, "src", specifier.slice(2))
          : resolve(root, dirname(file), specifier);
        const target = [
          "",
          ".ts",
          ".tsx",
          ".js",
          ".mjs",
          ".json",
          "/index.ts",
          "/index.tsx",
        ]
          .map((suffix) => base + suffix)
          .find((p) => existsSync(p) && statSync(p).isFile());
        edges.push({
          from: file,
          specifier,
          to: target ? relative(root, target) : null,
        });
      }
      ts.forEachChild(node, visit);
    };
    visit(ast);
  }
  return { files, edges };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  void questionDependencies().then(({ files, edges }) => {
    const broken = edges.filter((e) => !e.to);
    console.log(
      JSON.stringify(
        { sourceFiles: files.length, localEdges: edges.length, broken },
        null,
        2,
      ),
    );
    if (broken.length) process.exitCode = 1;
  });
}
