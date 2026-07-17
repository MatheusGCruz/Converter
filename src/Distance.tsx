class Distance {
  private value: number;
  private unit: string;

  private static readonly TO_METERS: Record<string, number> = {
    meters: 1,
    kilometers: 1000,
    centimeters: 0.01,
    millimeters: 0.001,
    feet: 0.3048,
    inches: 0.0254,
    miles: 1609.344,
    yards: 0.9144,
  };

  constructor(value: number, unit: string) {
    this.value = value;
    this.unit = unit;
  }

  private toMeters(): number {
    const factor = Distance.TO_METERS[this.unit];
    if (factor === undefined) {
      throw new Error(`Unknown unit: ${this.unit}`);
    }
    return this.value * factor;
  }

  private static fromMeters(meters: number, unit: string): number {
    const factor = Distance.TO_METERS[unit];
    if (factor === undefined) {
      throw new Error(`Unknown unit: ${unit}`);
    }
    return meters / factor;
  }

  convertTo(targetUnit: string): number {
    if (this.unit === targetUnit) {
      return this.value;
    }
    const meters = this.toMeters();
    return Distance.fromMeters(meters, targetUnit);
  }

  static convert(value: number, fromUnit: string, toUnit: string): number {
    const distance = new Distance(value, fromUnit);
    return distance.convertTo(toUnit);
  }

  getUnits(): string[] {
    return Object.keys(Distance.TO_METERS);
  }

  static getUnitLabels(): Record<string, string> {
    return {
      meters: 'Meters',
      kilometers: 'Kilometers',
      centimeters: 'Centimeters',
      millimeters: 'Millimeters',
      feet: 'Feet',
      inches: 'Inches',
      miles: 'Miles',
      yards: 'Yards',
    };
  }
}

export default Distance;
