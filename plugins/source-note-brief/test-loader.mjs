export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith(".scss")) {
    return { url: new URL(specifier, context.parentURL).href, shortCircuit: true }
  }
  return nextResolve(specifier, context)
}

export async function load(url, context, nextLoad) {
  if (url.endsWith(".scss")) {
    return { format: "module", source: "export default '';", shortCircuit: true }
  }
  return nextLoad(url, context)
}
