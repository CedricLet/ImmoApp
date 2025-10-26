export type Cost = {
  id: number;
  label: string;
  costCategory: string;
  currency: string;
  amount: number;
  date: string;
  costType: string;
  notes: string;
};

export type CostAccounting = {
  earnings: number;
  expenses: number;
  balance: number;
};

export enum CostType {
  EXPENSES,
  EARNINGS,
}

export enum CostCategory {
  ELECTRICITY,
  GAS,
  WATER,
  INTERNET,
  INSURANCE,
  TAX,
  MAINTENANCE,
  WORK,
  PHOTOVOLTAIC,
  FUEL,
  OTHER_EXPENSES,
  RENT,
  RENT_PARKING,
  RENT_STORAGE,
  SERVICE_CHARGE,
  UTILITY_REBILL_ELECTRICITY,
  UTILITY_REBILL_GAS,
  UTILITY_REBILL_WATER,
  LATE_FEE,
  DEPOSIT_WITHHELD,
  INSURANCE_PAYOUT,
  ENERGY_FEED_IN,
  SUBSIDY,
  OTHER_EARNINGS,
  WASTE,
  INSURANCE_HOME,
  INSURANCE_LANDLORD,
  TAX_PROPERTY,
  TAX_CITY,
  CONDO_FEES,
  REPAIRS,
  RENOVATION,
  GARDENING,
  CLEANING,
  ELEVATOR_SERVICE,
  BOILER_SERVICE,
  PEST_CONTROL,
  SECURITY,
  LEGAL_FEES,
  INTEREST,
  SUPPLIES,
}
