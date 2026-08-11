export type MonthlyEvolutionPointDto = {
  month: string;

  income: string;

  expense: string;
};

export type MonthlyEvolutionChartDto = MonthlyEvolutionPointDto[];
