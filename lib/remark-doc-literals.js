// Preserve layout data without enabling executable JavaScript in remote MDX.
export default function remarkDocLiterals() {
  return (tree) => {
    function visit(node) {
      for (const attribute of node.attributes || []) {
        if (attribute.value?.type !== 'mdxJsxAttributeValueExpression') continue;
        try {
          const value = JSON.parse(attribute.value.value);
          if (['string', 'number', 'boolean'].includes(typeof value)) attribute.value = String(value);
          else if (attribute.name === 'tags' && Array.isArray(value) && value.every(item => typeof item === 'string')) attribute.value = JSON.stringify(value);
        } catch { /* Nonliteral expressions remain blocked by the MDX compiler. */ }
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
