/**
 * Escape text for HTML, then keep hyphenated words ("E-commerce") on one line
 * so big display type never strands "E-" at the end of a line. The text
 * itself is unchanged (a normal hyphen), so search engines read it as is.
 */
const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function keepHyphenated(text: string): string {
  return escape(text).replace(/(\S+-\S+)/g, '<span style="white-space:nowrap">$1</span>');
}
