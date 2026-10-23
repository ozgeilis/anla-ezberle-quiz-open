// Tooling only. Unlike JSON.stringify, this preserves own undefined properties.
// Property and array order are intentional parts of the frozen snapshot.
export function questionSnapshot(value: unknown, indent = 0): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "string" || typeof value === "boolean")
    return JSON.stringify(value);
  if (typeof value === "number" && Number.isFinite(value)) {
    if (Object.is(value, -0)) return "-0";
    return String(value);
  }
  const pad = "  ".repeat(indent);
  const childPad = pad + "  ";
  if (Array.isArray(value)) {
    if (Object.keys(value).length !== value.length)
      throw new Error("Sparse or extended arrays cannot be snapshotted");
    return value.length
      ? `[\n${value.map((v) => childPad + questionSnapshot(v, indent + 1)).join(",\n")}\n${pad}]`
      : "[]";
  }
  if (
    typeof value === "object" &&
    Object.getPrototypeOf(value) === Object.prototype
  ) {
    if (Reflect.ownKeys(value).length !== Object.keys(value).length)
      throw new Error(
        "Non-enumerable or symbol metadata cannot be snapshotted",
      );
    const entries = Object.entries(value);
    return entries.length
      ? `{\n${entries.map(([key, v]) => `${childPad}${JSON.stringify(key)}: ${questionSnapshot(v, indent + 1)}`).join(",\n")}\n${pad}}`
      : "{}";
  }
  throw new Error("Unsupported snapshot value");
}
