class Temperature {
  private value: number;
  private unit: string;

  private static readonly UNITS = ['celsius', 'fahrenheit', 'kelvin', 'rankine'];

  constructor(value: number, unit: string) {
    this.value = value;
    this.unit = unit;
  }

  private toCelsius(): number {
    switch (this.unit) {
      case 'celsius':
        return this.value;
      case 'fahrenheit':
        return (this.value - 32) * (5 / 9);
      case 'kelvin':
        return this.value - 273.15;
      case 'rankine':
        return (this.value - 491.67) * (5 / 9);
      default:
        throw new Error(`Unknown unit: ${this.unit}`);
    }
  }

  private static fromCelsius(celsius: number, unit: string): number {
    switch (unit) {
      case 'celsius':
        return celsius;
      case 'fahrenheit':
        return celsius * (9 / 5) + 32;
      case 'kelvin':
        return celsius + 273.15;
      case 'rankine':
        return (celsius + 273.15) * (9 / 5);
      default:
        throw new Error(`Unknown unit: ${unit}`);
    }
  }

  convertTo(targetUnit: string): number {
    if (this.unit === targetUnit) {
      return this.value;
    }
    const celsius = this.toCelsius();
    return Temperature.fromCelsius(celsius, targetUnit);
  }

  static convert(value: number, fromUnit: string, toUnit: string): number {
    const temp = new Temperature(value, fromUnit);
    return temp.convertTo(toUnit);
  }

  static getUnitLabels(): Record<string, string> {
    return {
      celsius: 'Celsius',
      fahrenheit: 'Fahrenheit',
      kelvin: 'Kelvin',
      rankine: 'Rankine',
    };
  }
}

export default Temperature;
