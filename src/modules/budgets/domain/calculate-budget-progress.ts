import { type BudgetStatus, budgetStatus } from "./budget-status";

const MONEY_SCALE = 4;

export type CalculateBudgetProgressInput = {
  plannedAmount: string;
  spentAmount: string;
};

export type BudgetProgress = {
  plannedAmount: string;
  spentAmount: string;
  remainingAmount: string;
  percentage: number;
  status: BudgetStatus;
};

export function calculateBudgetProgress({
  plannedAmount,
  spentAmount,
}: CalculateBudgetProgressInput): BudgetProgress {
  const planned = parseMoney(plannedAmount);
  const spent = parseMoney(spentAmount);

  if (planned.negative || isZero(planned.digits)) {
    throw new Error("O valor planejado deve ser maior que zero.");
  }

  if (spent.negative) {
    throw new Error("O valor gasto não pode ser negativo.");
  }

  const remaining = subtractMoney(planned, spent);

  const percentage = calculatePercentage(plannedAmount, spentAmount);

  return {
    plannedAmount: formatMoney(planned),
    spentAmount: formatMoney(spent),
    remainingAmount: formatMoney(remaining),
    percentage,
    status: resolveBudgetStatus(planned, spent),
  };
}

function resolveBudgetStatus(planned: ParsedMoney, spent: ParsedMoney): BudgetStatus {
  if (compareDigits(spent.digits, planned.digits) > 0) {
    return budgetStatus.EXCEEDED;
  }

  const spentTimes100 = multiplyDigitsBySmallInteger(spent.digits, 100);

  const plannedTimes80 = multiplyDigitsBySmallInteger(planned.digits, 80);

  if (compareDigits(spentTimes100, plannedTimes80) >= 0) {
    return budgetStatus.NEAR_LIMIT;
  }

  return budgetStatus.ON_TRACK;
}

function calculatePercentage(plannedAmount: string, spentAmount: string): number {
  const planned = Number(plannedAmount);
  const spent = Number(spentAmount);

  const percentage = (spent / planned) * 100;

  return Number(percentage.toFixed(2));
}

type ParsedMoney = {
  negative: boolean;
  digits: string;
};

function parseMoney(value: string): ParsedMoney {
  const normalized = value.trim();

  if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
    throw new Error("Valor monetário inválido.");
  }

  const negative = normalized.startsWith("-");

  const unsigned = negative ? normalized.slice(1) : normalized;

  const [integerPart = "0", decimalPart = ""] = unsigned.split(".");

  if (decimalPart.length > MONEY_SCALE) {
    throw new Error(`O valor monetário deve possuir no máximo ${MONEY_SCALE} casas decimais.`);
  }

  const normalizedDecimal = decimalPart.padEnd(MONEY_SCALE, "0");

  const digits = removeLeadingZeros(`${integerPart}${normalizedDecimal}`);

  return {
    negative: negative && !isZero(digits),
    digits,
  };
}

function subtractMoney(left: ParsedMoney, right: ParsedMoney): ParsedMoney {
  const comparison = compareDigits(left.digits, right.digits);

  if (comparison === 0) {
    return {
      negative: false,
      digits: "0",
    };
  }

  if (comparison > 0) {
    return {
      negative: false,
      digits: subtractDigits(left.digits, right.digits),
    };
  }

  return {
    negative: true,
    digits: subtractDigits(right.digits, left.digits),
  };
}

function subtractDigits(greater: string, smaller: string): string {
  const maxLength = Math.max(greater.length, smaller.length);

  const left = greater.padStart(maxLength, "0");
  const right = smaller.padStart(maxLength, "0");

  let borrow = 0;
  let result = "";

  for (let index = maxLength - 1; index >= 0; index--) {
    const leftDigit = Number(left[index]) - borrow;

    const rightDigit = Number(right[index]);

    if (leftDigit < rightDigit) {
      result = `${leftDigit + 10 - rightDigit}${result}`;
      borrow = 1;
    } else {
      result = `${leftDigit - rightDigit}${result}`;
      borrow = 0;
    }
  }

  return removeLeadingZeros(result);
}

function multiplyDigitsBySmallInteger(digits: string, multiplier: number): string {
  let carry = 0;
  let result = "";

  for (let index = digits.length - 1; index >= 0; index--) {
    const product = Number(digits[index]) * multiplier + carry;

    result = `${product % 10}${result}`;

    carry = Math.floor(product / 10);
  }

  while (carry > 0) {
    result = `${carry % 10}${result}`;
    carry = Math.floor(carry / 10);
  }

  return removeLeadingZeros(result);
}

function compareDigits(left: string, right: string): number {
  const normalizedLeft = removeLeadingZeros(left);

  const normalizedRight = removeLeadingZeros(right);

  if (normalizedLeft.length !== normalizedRight.length) {
    return normalizedLeft.length > normalizedRight.length ? 1 : -1;
  }

  if (normalizedLeft === normalizedRight) {
    return 0;
  }

  return normalizedLeft > normalizedRight ? 1 : -1;
}

function formatMoney(value: ParsedMoney): string {
  const padded = value.digits.padStart(MONEY_SCALE + 1, "0");

  const integerPart = padded.slice(0, -MONEY_SCALE);

  const decimalPart = padded.slice(-MONEY_SCALE);

  return `${value.negative ? "-" : ""}${integerPart}.${decimalPart}`;
}

function removeLeadingZeros(value: string): string {
  const normalized = value.replace(/^0+/, "");

  return normalized || "0";
}

function isZero(value: string): boolean {
  return removeLeadingZeros(value) === "0";
}
