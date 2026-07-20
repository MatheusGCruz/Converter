import Regex from './utils/Regex';

interface ValidationResult {
  valid: boolean;
  error?: string;
}

class Text {
  static convert(value: string, fromUnit: string, toUnit: string): string {
    const trimmed = value.trim();
    if (trimmed === '') return '';

    if (fromUnit === 'regex' || toUnit === 'regex' ||
        fromUnit.startsWith('regex_') || toUnit.startsWith('regex_')) {
      return Text.convertRegex(trimmed, fromUnit, toUnit);
    }

    let format: string;
    if (toUnit === 'auto') {
      format = Text.detectFormat(trimmed);
    } else {
      format = toUnit;
    }

    const validation = Text.validate(trimmed, format);
    if (!validation.valid) {
      return validation.error!;
    }

    return Text.prettify(trimmed, format);
  }

  private static convertRegex(value: string, fromUnit: string, toUnit: string): string {
    const target = fromUnit.startsWith('regex_') ? fromUnit : toUnit;

    if (target === 'regex_auto' || fromUnit === 'regex' || toUnit === 'regex') {
      return Text.checkAllLines(value);
    }

    if (target && target !== 'regex') {
      const label = Regex.getLabel(target);
      const pattern = Regex.getPattern(target);
      if (pattern) {
        const isValid = Regex.validate(value, target);
        return isValid
          ? `Valid ${label}\n\nPattern:\n${pattern.source}`
          : `Invalid ${label}\n\nPattern:\n${pattern.source}`;
      }
    }

    return Text.checkAllLines(value);
  }

  private static checkAllLines(value: string): string {
    const lines = value.split('\n');
    const results: string[] = [];

    for (const line of lines) {
      if (line.trim() === '') {
        results.push('');
        continue;
      }

      const matches = Regex.checkAll(line);

      if (matches.length === 0) {
        results.push(`\u274C ${line}`);
      } else if (matches.length === 1) {
        results.push(`\u2705 ${line} \u2014 ${matches[0].label}: ${matches[0].pattern}`);
      } else {
        results.push(`\u2705 ${line}`);
        for (const match of matches) {
          results.push(`     \u2014 ${match.label}: ${match.pattern}`);
        }
      }
    }

    return results.join('\n');
  }

  private static detectFormat(value: string): string {
    const trimmed = value.trim();

    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try { JSON.parse(trimmed); return 'json'; } catch { /* not json */ }
    }

    if (trimmed.startsWith('<')) {
      const lower = trimmed.toLowerCase();
      if (lower.startsWith('<!doctype') || lower.startsWith('<html')) {
        return 'html';
      }
      return 'xml';
    }

    if (trimmed.includes('{') && trimmed.includes('}') && trimmed.includes(':')) {
      return 'css';
    }

    const lines = trimmed.split('\n');
    if (lines.length > 1) {
      const firstCols = lines[0].split(',').length;
      if (firstCols > 1 && lines.slice(1).every(l => l.split(',').length === firstCols)) {
        return 'csv';
      }
    }

    if (/^[\w][\w -]*:/m.test(trimmed)) {
      return 'yaml';
    }

    return 'javascript';
  }

  private static validate(value: string, format: string): ValidationResult {
    switch (format) {
      case 'json': return Text.validateJson(value);
      case 'xml': return Text.validateXml(value);
      case 'html': return Text.validateHtml(value);
      case 'css': return Text.validateCss(value);
      case 'javascript': return Text.validateJavascript(value);
      case 'yaml': return Text.validateYaml(value);
      case 'csv': return Text.validateCsv(value);
      default: return { valid: true };
    }
  }

  private static prettify(value: string, format: string): string {
    switch (format) {
      case 'json': return Text.prettifyJson(value);
      case 'xml': return Text.prettifyXml(value);
      case 'html': return Text.prettifyHtml(value);
      case 'css': return Text.prettifyCss(value);
      case 'javascript': return Text.prettifyJavascript(value);
      case 'yaml': return value;
      case 'csv': return value;
      default: return value;
    }
  }

  private static findLineAndColumn(text: string, index: number): { line: number; column: number } {
    const before = text.substring(0, index);
    const lines = before.split('\n');
    return { line: lines.length, column: lines[lines.length - 1].length + 1 };
  }

  private static validateJson(value: string): ValidationResult {
    try {
      JSON.parse(value);
      return { valid: true };
    } catch (e) {
      const msg = (e as Error).message;
      const posMatch = msg.match(/position\s+(\d+)/i);
      if (posMatch) {
        const pos = parseInt(posMatch[1]);
        const { line, column } = Text.findLineAndColumn(value, pos);
        const char = pos < value.length ? `'${value[pos]}'` : 'EOF';
        return { valid: false, error: `Invalid JSON at line ${line}, column ${column}: unexpected character ${char}` };
      }
      return { valid: false, error: `Invalid JSON: ${msg}` };
    }
  }

  private static validateXml(value: string): ValidationResult {
    const stack: string[] = [];
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)(\s[^>]*)?\s*\/?>/g;
    const selfClosingTags = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']);
    let match: RegExpExecArray | null;

    while ((match = tagRegex.exec(value)) !== null) {
      const tag = match[0];
      const tagName = match[1].toLowerCase();
      const isClosing = tag.startsWith('</');
      const isSelfClosing = tag.endsWith('/>') || selfClosingTags.has(tagName);

      if (isClosing) {
        if (stack.length === 0 || stack[stack.length - 1] !== tagName) {
          const { line, column } = Text.findLineAndColumn(value, match.index);
          const expected = stack.length > 0 ? `expected </${stack[stack.length - 1]}>` : 'no open tags';
          return { valid: false, error: `Invalid XML at line ${line}, column ${column}: unexpected closing tag </${tagName}> (${expected})` };
        }
        stack.pop();
      } else if (!isSelfClosing) {
        stack.push(tagName);
      }
    }

    if (stack.length > 0) {
      const tagName = stack[stack.length - 1];
      const lastOpenIndex = value.lastIndexOf(`<${tagName}`);
      const { line, column } = Text.findLineAndColumn(value, lastOpenIndex);
      return { valid: false, error: `Invalid XML at line ${line}, column ${column}: unclosed tag <${tagName}>` };
    }

    return { valid: true };
  }

  private static validateHtml(value: string): ValidationResult {
    return Text.validateXml(value);
  }

  private static validateCss(value: string): ValidationResult {
    let braceCount = 0;
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < value.length; i++) {
      const char = value[i];

      if (inString) {
        if (char === stringChar && value[i - 1] !== '\\') inString = false;
        continue;
      }

      if (char === '"' || char === "'") {
        inString = true;
        stringChar = char;
        continue;
      }

      if (char === '{') braceCount++;
      if (char === '}') {
        braceCount--;
        if (braceCount < 0) {
          const { line, column } = Text.findLineAndColumn(value, i);
          return { valid: false, error: `Invalid CSS at line ${line}, column ${column}: unexpected character '}'` };
        }
      }
    }

    if (braceCount > 0) {
      let lastBrace = -1;
      let count = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] === '{') { count++; lastBrace = i; }
        if (value[i] === '}') count--;
      }
      const { line, column } = Text.findLineAndColumn(value, lastBrace);
      return { valid: false, error: `Invalid CSS at line ${line}, column ${column}: unclosed block` };
    }

    return { valid: true };
  }

  private static validateJavascript(value: string): ValidationResult {
    const stack: string[] = [];
    const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
    let inString = false;
    let stringChar = '';
    let inLineComment = false;
    let inBlockComment = false;

    for (let i = 0; i < value.length; i++) {
      const char = value[i];
      const next = value[i + 1];

      if (inLineComment) {
        if (char === '\n') inLineComment = false;
        continue;
      }
      if (inBlockComment) {
        if (char === '*' && next === '/') { inBlockComment = false; i++; }
        continue;
      }
      if (inString) {
        if (char === stringChar && value[i - 1] !== '\\') inString = false;
        continue;
      }

      if (char === '/' && next === '/') { inLineComment = true; i++; continue; }
      if (char === '/' && next === '*') { inBlockComment = true; i++; continue; }
      if (char === '"' || char === "'" || char === '`') { inString = true; stringChar = char; continue; }

      if (char === '(' || char === '[' || char === '{') {
        stack.push(char);
      } else if (char === ')' || char === ']' || char === '}') {
        if (stack.length === 0 || stack[stack.length - 1] !== pairs[char]) {
          const { line, column } = Text.findLineAndColumn(value, i);
          return { valid: false, error: `Invalid JavaScript at line ${line}, column ${column}: unexpected character '${char}'` };
        }
        stack.pop();
      }
    }

    if (stack.length > 0) {
      const openChar = stack[stack.length - 1];
      let lastPos = -1;
      let depth = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] === openChar) { depth++; lastPos = i; }
        const closeMap: Record<string, string> = { '(': ')', '[': ']', '{': '}' };
        if (value[i] === closeMap[openChar]) depth--;
      }
      const { line, column } = Text.findLineAndColumn(value, lastPos);
      return { valid: false, error: `Invalid JavaScript at line ${line}, column ${column}: unclosed '${openChar}'` };
    }

    return { valid: true };
  }

  private static validateYaml(value: string): ValidationResult {
    const lines = value.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const tabPos = line.indexOf('\t');
      if (tabPos !== -1) {
        return { valid: false, error: `Invalid YAML at line ${i + 1}, column ${tabPos + 1}: tabs are not allowed for indentation` };
      }
    }
    return { valid: true };
  }

  private static validateCsv(value: string): ValidationResult {
    const lines = value.split('\n').filter(l => l.trim() !== '');
    if (lines.length === 0) return { valid: true };

    const firstCols = Text.countCsvColumns(lines[0]);
    for (let i = 1; i < lines.length; i++) {
      const cols = Text.countCsvColumns(lines[i]);
      if (cols !== firstCols) {
        return { valid: false, error: `Invalid CSV at line ${i + 1}: expected ${firstCols} columns, found ${cols}` };
      }
    }
    return { valid: true };
  }

  private static countCsvColumns(line: string): number {
    let count = 1;
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') inQuotes = !inQuotes;
      if (line[i] === ',' && !inQuotes) count++;
    }
    return count;
  }

  private static prettifyJson(value: string): string {
    return JSON.stringify(JSON.parse(value), null, 2);
  }

  private static prettifyXml(value: string): string {
    let result = '';
    let indent = 0;
    const parts = value
      .replace(/>\s*</g, '>\n<')
      .split('\n');

    for (const rawLine of parts) {
      const line = rawLine.trim();
      if (!line) continue;

      const isClosing = line.startsWith('</');
      const isSelfClosing = line.endsWith('/>') || line.startsWith('<!');
      const isOpening = !isClosing && !isSelfClosing && line.startsWith('<');

      if (isClosing) indent = Math.max(0, indent - 1);

      result += '  '.repeat(indent) + line + '\n';

      if (isOpening && !isSelfClosing) indent++;
    }

    return result.trimEnd();
  }

  private static prettifyHtml(value: string): string {
    return Text.prettifyXml(value);
  }

  private static prettifyCss(value: string): string {
    let result = '';
    let indent = 0;
    let inString = false;
    let stringChar = '';
    let buffer = '';

    for (let i = 0; i < value.length; i++) {
      const char = value[i];

      if (inString) {
        buffer += char;
        if (char === stringChar && value[i - 1] !== '\\') inString = false;
        continue;
      }
      if (char === '"' || char === "'") {
        inString = true;
        stringChar = char;
        buffer += char;
        continue;
      }

      if (char === '{') {
        result += '  '.repeat(indent) + buffer.trim() + ' {\n';
        buffer = '';
        indent++;
      } else if (char === '}') {
        if (buffer.trim()) {
          result += '  '.repeat(indent) + buffer.trim() + '\n';
        }
        buffer = '';
        indent = Math.max(0, indent - 1);
        result += '  '.repeat(indent) + '}\n';
      } else {
        buffer += char;
      }
    }

    if (buffer.trim()) {
      result += '  '.repeat(indent) + buffer.trim();
    }

    return result.trimEnd();
  }

  private static prettifyJavascript(value: string): string {
    let result = '';
    let indent = 0;
    let inString = false;
    let stringChar = '';
    let inLineComment = false;
    let inBlockComment = false;
    let buffer = '';

    const flush = () => {
      const trimmed = buffer.trim();
      if (trimmed) {
        result += '  '.repeat(indent) + trimmed + '\n';
      }
      buffer = '';
    };

    for (let i = 0; i < value.length; i++) {
      const char = value[i];
      const next = value[i + 1];

      if (inLineComment) {
        buffer += char;
        if (char === '\n') { inLineComment = false; flush(); }
        continue;
      }
      if (inBlockComment) {
        buffer += char;
        if (char === '*' && next === '/') { buffer += '/'; i++; inBlockComment = false; }
        continue;
      }
      if (inString) {
        buffer += char;
        if (char === stringChar && value[i - 1] !== '\\') inString = false;
        continue;
      }

      if (char === '/' && next === '/') { inLineComment = true; buffer += char; continue; }
      if (char === '/' && next === '*') { inBlockComment = true; buffer += char; continue; }
      if (char === '"' || char === "'" || char === '`') { inString = true; stringChar = char; buffer += char; continue; }

      if (char === '{' || char === '(' || char === '[') {
        buffer += char;
        flush();
        indent++;
      } else if (char === '}' || char === ')' || char === ']') {
        indent = Math.max(0, indent - 1);
        flush();
        buffer = char;
      } else if (char === ';') {
        buffer += char;
        flush();
      } else {
        buffer += char;
      }
    }

    flush();
    return result.trimEnd();
  }

  static getUnitLabels(): Record<string, string> {
    return {
      auto: '(auto)',
      json: 'JSON',
      xml: 'XML',
      html: 'HTML',
      css: 'CSS',
      javascript: 'JavaScript',
      yaml: 'YAML',
      csv: 'CSV',
    };
  }
}

export default Text;
