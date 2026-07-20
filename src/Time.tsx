class Time {
  static convert(value: string, fromUnit: string, toUnit: string): string {
    const ms = Time.toMilliseconds(value.trim(), fromUnit);
    return Time.fromMilliseconds(ms, toUnit);
  }

  private static toMilliseconds(value: string, unit: string): number {
    switch (unit) {
      case 'datetime_short':
        return Time.parseDatetimeToMs(value);
      case 'datetime_medium':
        return Time.parseDatetimeToMs(value);
      case 'datetime_long':
        return Time.parseDatetimeToMs(value);
      case 'epoch':
        return parseFloat(value) * 1000;
      case 'time':
        return Time.parseTimeToMs(value);
      case 'weeks':
        return Time.parseWeeksToMs(value);
      default:
        throw new Error(`Unknown unit: ${unit}`);
    }
  }

  private static fromMilliseconds(ms: number, unit: string): string {
    switch (unit) {
      case 'datetime_short':
        return Time.msToDatetime(ms, false, false);
      case 'datetime_medium':
        return Time.msToDatetime(ms, true, false);
      case 'datetime_long':
        return Time.msToDatetime(ms, true, true);
      case 'epoch':
        return String(ms / 1000);
      case 'time':
        return Time.msToTime(ms);
      case 'weeks':
        return Time.msToWeeks(ms);
      default:
        throw new Error(`Unknown unit: ${unit}`);
    }
  }

  private static parseDatetimeToMs(value: string): number {
    const match = value.match(
      /^(\d{2})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?$/
    );
    if (!match) {
      throw new Error(`Invalid datetime format: ${value}`);
    }

    const year = 2000 + parseInt(match[1]);
    const month = parseInt(match[2]) - 1;
    const day = parseInt(match[3]);
    const hours = parseInt(match[4]);
    const minutes = parseInt(match[5]);
    const seconds = match[6] ? parseInt(match[6]) : 0;
    const ms = match[7] ? parseInt(match[7].padEnd(3, '0')) : 0;

    return Date.UTC(year, month, day, hours, minutes, seconds, ms);
  }

  private static msToDatetime(ms: number, includeSeconds: boolean, includeMs: boolean): string {
    const date = new Date(ms);
    const yy = String(date.getUTCFullYear()).slice(-2);
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(date.getUTCDate()).padStart(2, '0');
    const hh = String(date.getUTCHours()).padStart(2, '0');
    const mi = String(date.getUTCMinutes()).padStart(2, '0');

    let result = `${yy}-${mm}-${dd} ${hh}:${mi}`;
    if (includeSeconds) {
      result += `:${String(date.getUTCSeconds()).padStart(2, '0')}`;
    }
    if (includeMs) {
      result += `.${String(date.getUTCMilliseconds()).padStart(3, '0')}`;
    }
    return result;
  }

  private static parseTimeToMs(value: string): number {
    const match = value.match(/^(\d+):(\d{2}):(\d{2})\.(\d{1,3})$/);
    if (!match) {
      throw new Error(`Invalid time format: ${value}`);
    }

    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const seconds = parseInt(match[3]);
    const ms = parseInt(match[4].padEnd(3, '0'));

    return hours * 3600000 + minutes * 60000 + seconds * 1000 + ms;
  }

  private static msToTime(ms: number): string {
    const negative = ms < 0;
    if (negative) ms = -ms;

    const hours = Math.floor(ms / 3600000);
    ms %= 3600000;
    const minutes = Math.floor(ms / 60000);
    ms %= 60000;
    const seconds = Math.floor(ms / 1000);
    const mls = ms % 1000;

    const result = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(mls).padStart(3, '0')}`;
    return negative ? `-${result}` : result;
  }

  private static parseWeeksToMs(value: string): number {
    const match = value.match(/^(\d+)\s+(\d+)\s+(\d+):(\d{2}):(\d{2})\.(\d{1,3})$/);
    if (!match) {
      throw new Error(`Invalid weeks format: ${value}`);
    }

    const weeks = parseInt(match[1]);
    const days = parseInt(match[2]);
    const hours = parseInt(match[3]);
    const minutes = parseInt(match[4]);
    const seconds = parseInt(match[5]);
    const ms = parseInt(match[6].padEnd(3, '0'));

    return (weeks * 7 + days) * 86400000 + hours * 3600000 + minutes * 60000 + seconds * 1000 + ms;
  }

  private static msToWeeks(ms: number): string {
    const negative = ms < 0;
    if (negative) ms = -ms;

    const totalDays = Math.floor(ms / 86400000);
    const weeks = Math.floor(totalDays / 7);
    const days = totalDays % 7;
    ms %= 86400000;

    const hours = Math.floor(ms / 3600000);
    ms %= 3600000;
    const minutes = Math.floor(ms / 60000);
    ms %= 60000;
    const seconds = Math.floor(ms / 1000);
    const mls = ms % 1000;

    const result = `${String(weeks).padStart(2, '0')} ${String(days).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(mls).padStart(3, '0')}`;
    return negative ? `-${result}` : result;
  }

  static getUnitLabels(): Record<string, string> {
    return {
      datetime_short: 'DateTime (YY-MM-DD hh:mm)',
      datetime_medium: 'DateTime (YY-MM-DD hh:mm:ss)',
      datetime_long: 'DateTime (YY-MM-DD hh:mm:ss.mls)',
      epoch: 'EPOCH',
      time: 'Time (hh:mm:ss.mls)',
      weeks: 'Weeks (WW DD hh:mm:ss.mls)',
    };
  }
}

export default Time;
