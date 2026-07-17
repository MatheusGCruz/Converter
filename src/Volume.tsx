class Volume {
  private value: number;
  private unit: string;

  private static readonly TO_LITERS: Record<string, number> = {
    liters: 1,
    milliliters: 0.001,
    cubic_meters: 1000,
    cubic_centimeters: 0.001,
    cubic_decimeters: 1,
    gallons: 3.78541,
    quarts: 0.946353,
    pints: 0.473176,
    cups: 0.236588,
    fluid_ounces: 0.0295735,
    tablespoons: 0.0147868,
    teaspoons: 0.00492892,
  };

  constructor(value: number, unit: string) {
    this.value = value;
    this.unit = unit;
  }

  private toLiters(): number {
    const factor = Volume.TO_LITERS[this.unit];
    if (factor === undefined) {
      throw new Error(`Unknown unit: ${this.unit}`);
    }
    return this.value * factor;
  }

  private static fromLiters(liters: number, unit: string): number {
    const factor = Volume.TO_LITERS[unit];
    if (factor === undefined) {
      throw new Error(`Unknown unit: ${unit}`);
    }
    return liters / factor;
  }

  convertTo(targetUnit: string): number {
    if (this.unit === targetUnit) {
      return this.value;
    }
    const liters = this.toLiters();
    return Volume.fromLiters(liters, targetUnit);
  }

  static convert(value: number, fromUnit: string, toUnit: string): number {
    const volume = new Volume(value, fromUnit);
    return volume.convertTo(toUnit);
  }

  static getUnitLabels(): Record<string, string> {
    return {
      liters: 'Liters',
      milliliters: 'Milliliters',
      cubic_meters: 'm³',
      cubic_centimeters: 'cm³',
      cubic_decimeters: 'dm³',
      gallons: 'Gallons',
      quarts: 'Quarts',
      pints: 'Pints',
      cups: 'Cups',
      fluid_ounces: 'Fluid Ounces',
      tablespoons: 'Tablespoons',
      teaspoons: 'Teaspoons',
    };
  }
}

export default Volume;
