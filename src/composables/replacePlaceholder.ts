export function replacePlaceholder(str: string, replacements: Record<string, string>): string {
  const regex = /{{([^{}]+)}}/g;
  return str.replace(regex, (_, placeholder) => {
    const replacement = replacements[placeholder];
    return replacement !== undefined ? replacement : "";
  });
}
