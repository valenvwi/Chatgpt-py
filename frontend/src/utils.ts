export function formatMessageContent(content: string) {
  const sections = content.split(/(```[\s\S]*?```|`[\s\S]*?`)/g);
  return sections
    .map((section) => {
      if (section.startsWith("```") && section.endsWith("```")) {
        section = section.split("\n").slice(1).join("\n");
        const code = section.substring(0, section.length - 3);
        return `<pre><code class="code-block">${code}</code></pre>`;
      } else if (section.startsWith("`") && section.endsWith("`")) {
        const code = section.substring(1, section.length - 1);
        return `<code class="inline-code">${code}</code>`;
      } else {
        return section.replace(/\n/g, "<br>");
      }
    })
    .join("");
}
