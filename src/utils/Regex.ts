class Regex {
  static readonly EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  static readonly BR_PHONE = /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/;

  static readonly GLOBAL_PHONE = /^\+?[\d\s().-]{7,20}$/;

  static readonly CPF = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;

  static readonly CNPJ = /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/;

  static readonly WEBSITE = /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(?:\/[^\s]*)?$/;

  static validateCpf(cpf: string): boolean {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleaned)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned[i]) * (10 - i);
    }
    let rest = (sum * 10) % 11;
    if (rest === 10) rest = 0;
    if (rest !== parseInt(cleaned[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned[i]) * (11 - i);
    }
    rest = (sum * 10) % 11;
    if (rest === 10) rest = 0;
    return rest === parseInt(cleaned[10]);
  }

  static validateCnpj(cnpj: string): boolean {
    const cleaned = cnpj.replace(/\D/g, '');
    if (cleaned.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cleaned)) return false;

    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleaned[i]) * weights1[i];
    }
    let remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;
    if (parseInt(cleaned[12]) !== digit1) return false;

    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleaned[i]) * weights2[i];
    }
    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;
    return parseInt(cleaned[13]) === digit2;
  }

  static getPattern(name: string): RegExp | null {
    switch (name) {
      case 'regex_email': return Regex.EMAIL;
      case 'regex_br_phone': return Regex.BR_PHONE;
      case 'regex_global_phone': return Regex.GLOBAL_PHONE;
      case 'regex_cpf': return Regex.CPF;
      case 'regex_cnpj': return Regex.CNPJ;
      case 'regex_website': return Regex.WEBSITE;
      default: return null;
    }
  }

  static validate(value: string, regexName: string): boolean {
    const pattern = Regex.getPattern(regexName);
    if (!pattern) return false;
    if (!pattern.test(value)) return false;

    if (regexName === 'regex_cpf') return Regex.validateCpf(value);
    if (regexName === 'regex_cnpj') return Regex.validateCnpj(value);
    return true;
  }

  static getLabel(name: string): string {
    switch (name) {
      case 'regex_email': return 'Email';
      case 'regex_br_phone': return 'BR Phone';
      case 'regex_global_phone': return 'Global Phone';
      case 'regex_cpf': return 'CPF';
      case 'regex_cnpj': return 'CNPJ';
      case 'regex_website': return 'Website';
      default: return 'Unknown';
    }
  }

  static checkAll(value: string): { label: string; pattern: string }[] {
    const allPatterns: [string, RegExp][] = [
      ['Email', Regex.EMAIL],
      ['BR Phone', Regex.BR_PHONE],
      ['Global Phone', Regex.GLOBAL_PHONE],
      ['CPF', Regex.CPF],
      ['CNPJ', Regex.CNPJ],
      ['Website', Regex.WEBSITE],
    ];

    const matches: { label: string; pattern: string }[] = [];
    for (const [label, pattern] of allPatterns) {
      if (pattern.test(value)) {
        if (label === 'CPF' && !Regex.validateCpf(value)) continue;
        if (label === 'CNPJ' && !Regex.validateCnpj(value)) continue;
        matches.push({ label, pattern: pattern.source });
      }
    }
    return matches;
  }
}

export default Regex;
