class Area {
  private value: number;
  private unit: string;

  private static readonly TO_SQMETERS: Record<string, number> = {
    square_meters: 1,
    square_kilometers: 1e6,
    square_centimeters: 1e-4,
    square_millimeters: 1e-6,
    square_miles: 2.59e6,
    square_yards: 0.836127,
    square_feet: 0.092903,
    square_inches: 6.4516e-4,
    hectares: 10000,
    acres: 4046.86,
  };

  constructor(value: number, unit: string) {
    this.value = value;
    this.unit = unit;
  }

  private toSquareMeters(): number {
    const factor = Area.TO_SQMETERS[this.unit];
    if (factor === undefined) {
      throw new Error(`Unknown unit: ${this.unit}`);
    }
    return this.value * factor;
  }

  private static fromSquareMeters(sqmeters: number, unit: string): number {
    const factor = Area.TO_SQMETERS[unit];
    if (factor === undefined) {
      throw new Error(`Unknown unit: ${unit}`);
    }
    return sqmeters / factor;
  }

  convertTo(targetUnit: string): number {
    if (this.unit === targetUnit) {
      return this.value;
    }
    const sqmeters = this.toSquareMeters();
    return Area.fromSquareMeters(sqmeters, targetUnit);
  }

  static convert(value: number, fromUnit: string, toUnit: string): number {
    const area = new Area(value, fromUnit);
    return area.convertTo(toUnit);
  }

  static getUnitLabels(): Record<string, string> {
    return {
      square_meters: 'm²',
      square_kilometers: 'km²',
      square_centimeters: 'cm²',
      square_millimeters: 'mm²',
      square_miles: 'mi²',
      square_yards: 'yd²',
      square_feet: 'ft²',
      square_inches: 'in²',
      hectares: 'Hectares',
      acres: 'Acres',
    };
  }
}

export default Area;
