export interface Car {
    _id: string,
    make: string,
    model: string,
    year: string,
    fuelType: string,
    motor: string,
    diagnosis: Diagnosis[]
}

export interface Diagnosis {
    _id: string,
    carId: string,
    issues: {
      category: string,
      description: string,
      issue: string
    }[],
    detail: string,
    date: Date
}
