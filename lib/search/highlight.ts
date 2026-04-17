export function highlight(text: string, query: string) {
  if (!query) return text;

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "ig");

  return text.split(regex).map((part, i) =>
    regex.test(part)
      ? `<mark class="bg-yellow-200 px-0.5">${part}</mark>`
      : part
  );
}