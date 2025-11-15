"use client";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { numberConverterTranslations } from "@/lib/i18n/tools/number-converter";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

interface StepExplanation {
    step: string;
    description?: string;
    binary?: string;
    result?: string;
}

interface CalculationExplanation {
    operation: string;
    operand1: number;
    operand2?: number;
    result: number;
    steps: StepExplanation[];
    bitLevel?: string[];
}

export default function BitwiseExplainer() {
    const { locale } = useLanguage();
    const t = numberConverterTranslations[locale].numberConverter.ui;
    const [base, setBase] = useState<2 | 8 | 10 | 16>(10);
    const [num1Input, setNum1Input] = useState("");
    const [num2Input, setNum2Input] = useState("");
    const [operation, setOperation] = useState<"add" | "subtract" | "multiply" | "divide" | "and" | "or" | "xor" | "not" | "leftShift" | "rightShift">("add");
    const [bitWidth, setBitWidth] = useState<8 | 16 | 32>(8);
    const [explanation, setExplanation] = useState<CalculationExplanation | null>(null);

    // Convert to binary with fixed width
    const toBinary = (num: number, width: number): string => {
        if (num < 0) {
            // Two's complement for negative numbers
            return (num >>> 0).toString(2).slice(-width).padStart(width, "0");
        }
        return num.toString(2).padStart(width, "0");
    };

    // Convert to two's complement
    const toTwosComplement = (num: number, width: number): string => {
        if (num >= 0) return toBinary(num, width);

        // For negative: invert bits and add 1
        const positive = Math.abs(num);
        const binary = toBinary(positive, width);
        const inverted = binary
            .split("")
            .map((b) => (b === "0" ? "1" : "0"))
            .join("");
        const invertedNum = parseInt(inverted, 2);
        const twosComp = (invertedNum + 1) & ((1 << width) - 1);
        return toBinary(twosComp, width);
    };

    const parseInput = (input: string, base: number): number => {
        const parsed = parseInt(input, base);
        return isNaN(parsed) ? 0 : parsed;
    };

    const explainAddition = (a: number, b: number): CalculationExplanation => {
        const binA = toBinary(a, bitWidth);
        const binB = toBinary(b, bitWidth);
        const result = a + b;
        const binResult = toBinary(result, bitWidth);

        const steps: StepExplanation[] = [
            {
                step: "1. Convert to Binary",
                description: `${a} = ${binA}\n${b} = ${binB}`,
                binary: `  ${binA}\n+ ${binB}`,
            },
            {
                step: "2. Add bit by bit (right to left)",
                description: "Using binary addition rules:\n0+0=0, 0+1=1, 1+0=1, 1+1=10 (carry 1)",
                binary: binResult,
            },
            {
                step: "3. Handle Overflow",
                description: result > (1 << bitWidth) - 1 ? `Result exceeds ${bitWidth}-bit range. Overflow occurred!` : `Result fits in ${bitWidth}-bit range`,
                result: `${result} (${binResult})`,
            },
        ];

        // Bit-level explanation
        const bitLevel: string[] = [];
        let carry = 0;
        for (let i = bitWidth - 1; i >= 0; i--) {
            const bitA = parseInt(binA[i]);
            const bitB = parseInt(binB[i]);
            const sum = bitA + bitB + carry;
            const resultBit = sum % 2;
            carry = Math.floor(sum / 2);
            bitLevel.push(`Bit ${bitWidth - 1 - i}: ${bitA} + ${bitB} + carry(${carry === 1 && i < bitWidth - 1 ? "1" : "0"}) = ${resultBit}${carry ? " (carry 1)" : ""}`);
        }

        return { operation: "Addition", operand1: a, operand2: b, result, steps, bitLevel };
    };

    const explainSubtraction = (a: number, b: number): CalculationExplanation => {
        const binA = toBinary(a, bitWidth);
        const negB = -b;
        const binNegB = toTwosComplement(negB, bitWidth);
        const result = a - b;
        const binResult = toBinary(result, bitWidth);

        const steps: StepExplanation[] = [
            {
                step: "1. Convert to Binary",
                description: `${a} = ${binA}`,
                binary: binA,
            },
            {
                step: "2. Two's Complement of subtrahend",
                description:
                    `To subtract ${b}, we add -${b} (two's complement)\n` +
                    `${b} = ${toBinary(b, bitWidth)}\n` +
                    `Invert bits: ${toBinary(b, bitWidth)
                        .split("")
                        .map((b) => (b === "0" ? "1" : "0"))
                        .join("")}\n` +
                    `Add 1: ${binNegB}`,
                binary: binNegB,
            },
            {
                step: "3. Add using two's complement",
                description: `${a} + (-${b}) = ${result}`,
                binary: `  ${binA}\n+ ${binNegB}\n= ${binResult}`,
                result: `${result}`,
            },
        ];

        return { operation: "Subtraction (using 2's complement)", operand1: a, operand2: b, result, steps };
    };

    const explainMultiplication = (a: number, b: number): CalculationExplanation => {
        const binA = toBinary(a, bitWidth);
        const binB = toBinary(b, bitWidth);
        const result = a * b;
        const binResult = toBinary(result, bitWidth * 2);

        const steps: StepExplanation[] = [
            {
                step: "1. Convert to Binary",
                description: `${a} = ${binA}\n${b} = ${binB}`,
            },
            {
                step: "2. Shift and Add method",
                description: "For each bit in multiplier:\n- If bit is 1: add shifted multiplicand\n- If bit is 0: skip\n- Shift multiplicand left for next bit",
            },
        ];

        // Show partial products
        let partialProducts: string[] = [];
        for (let i = 0; i < bitWidth; i++) {
            const bit = binB[bitWidth - 1 - i];
            if (bit === "1") {
                const shifted = toBinary(a << i, bitWidth * 2);
                partialProducts.push(`Bit ${i}: ${shifted} (${a} << ${i})`);
            }
        }

        steps.push({
            step: "3. Partial Products",
            description: partialProducts.join("\n") || "No partial products",
        });

        steps.push({
            step: "4. Sum all partial products",
            description: `Result: ${result}`,
            binary: binResult,
            result: `${result} (may overflow ${bitWidth}-bit)`,
        });

        return { operation: "Multiplication (Shift-Add)", operand1: a, operand2: b, result, steps };
    };

    const explainDivision = (a: number, b: number): CalculationExplanation => {
        if (b === 0) {
            return {
                operation: "Division",
                operand1: a,
                operand2: b,
                result: 0,
                steps: [{ step: "Error", description: "Division by zero!" }],
            };
        }

        const quotient = Math.floor(a / b);
        const remainder = a % b;
        const binA = toBinary(a, bitWidth);
        const binB = toBinary(b, bitWidth);

        const steps: StepExplanation[] = [
            {
                step: "1. Setup",
                description: `Dividend: ${a} (${binA})\nDivisor: ${b} (${binB})`,
            },
            {
                step: "2. Restoring Division Algorithm",
                description: "1. Shift dividend left\n2. Subtract divisor\n3. If result >= 0: set quotient bit to 1\n4. If result < 0: restore (add divisor back), set bit to 0\n5. Repeat for each bit",
            },
            {
                step: "3. Result",
                description: `Quotient: ${quotient} (${toBinary(quotient, bitWidth)})\nRemainder: ${remainder} (${toBinary(remainder, bitWidth)})`,
                result: `${quotient} R ${remainder}`,
            },
        ];

        return { operation: "Division (Restoring)", operand1: a, operand2: b, result: quotient, steps };
    };

    const explainBitwiseAnd = (a: number, b: number): CalculationExplanation => {
        const binA = toBinary(a, bitWidth);
        const binB = toBinary(b, bitWidth);
        const result = a & b;
        const binResult = toBinary(result, bitWidth);

        const bitLevel: string[] = [];
        for (let i = 0; i < bitWidth; i++) {
            const bitA = binA[i];
            const bitB = binB[i];
            const resBit = binResult[i];
            bitLevel.push(`Bit ${bitWidth - 1 - i}: ${bitA} AND ${bitB} = ${resBit}`);
        }

        return {
            operation: "Bitwise AND",
            operand1: a,
            operand2: b,
            result,
            steps: [
                { step: "1. Binary representation", description: `A = ${binA}\nB = ${binB}` },
                { step: "2. AND each bit", description: "1 AND 1 = 1\nAll other combinations = 0", binary: binResult },
                { step: "3. Result", result: `${result} (${binResult})` },
            ],
            bitLevel,
        };
    };

    const explainBitwiseOr = (a: number, b: number): CalculationExplanation => {
        const binA = toBinary(a, bitWidth);
        const binB = toBinary(b, bitWidth);
        const result = a | b;
        const binResult = toBinary(result, bitWidth);

        const bitLevel: string[] = [];
        for (let i = 0; i < bitWidth; i++) {
            const bitA = binA[i];
            const bitB = binB[i];
            const resBit = binResult[i];
            bitLevel.push(`Bit ${bitWidth - 1 - i}: ${bitA} OR ${bitB} = ${resBit}`);
        }

        return {
            operation: "Bitwise OR",
            operand1: a,
            operand2: b,
            result,
            steps: [
                { step: "1. Binary representation", description: `A = ${binA}\nB = ${binB}` },
                { step: "2. OR each bit", description: "0 OR 0 = 0\nAll other combinations = 1", binary: binResult },
                { step: "3. Result", result: `${result} (${binResult})` },
            ],
            bitLevel,
        };
    };

    const explainBitwiseXor = (a: number, b: number): CalculationExplanation => {
        const binA = toBinary(a, bitWidth);
        const binB = toBinary(b, bitWidth);
        const result = a ^ b;
        const binResult = toBinary(result, bitWidth);

        const bitLevel: string[] = [];
        for (let i = 0; i < bitWidth; i++) {
            const bitA = binA[i];
            const bitB = binB[i];
            const resBit = binResult[i];
            bitLevel.push(`Bit ${bitWidth - 1 - i}: ${bitA} XOR ${bitB} = ${resBit}`);
        }

        return {
            operation: "Bitwise XOR",
            operand1: a,
            operand2: b,
            result,
            steps: [
                { step: "1. Binary representation", description: `A = ${binA}\nB = ${binB}` },
                { step: "2. XOR each bit", description: "Different bits = 1\nSame bits = 0", binary: binResult },
                { step: "3. Result", result: `${result} (${binResult})` },
            ],
            bitLevel,
        };
    };

    const calculate = () => {
        const num1 = parseInput(num1Input, base);
        const num2 = parseInput(num2Input, base);

        let exp: CalculationExplanation;
        switch (operation) {
            case "add":
                exp = explainAddition(num1, num2);
                break;
            case "subtract":
                exp = explainSubtraction(num1, num2);
                break;
            case "multiply":
                exp = explainMultiplication(num1, num2);
                break;
            case "divide":
                exp = explainDivision(num1, num2);
                break;
            case "and":
                exp = explainBitwiseAnd(num1, num2);
                break;
            case "or":
                exp = explainBitwiseOr(num1, num2);
                break;
            case "xor":
                exp = explainBitwiseXor(num1, num2);
                break;
            default:
                return;
        }

        setExplanation(exp);
    };

    return (
        <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors'>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>{t.explainerTitle}</h3>

            <div className='space-y-4'>
                {/* Settings */}
                <div className='grid md:grid-cols-3 gap-4'>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>{t.inputBase}</label>
                        <Select value={base} onChange={(e) => setBase(Number(e.target.value) as 2 | 8 | 10 | 16)}>
                            <option value={2}>{t.binary2}</option>
                            <option value={8}>{t.octal8}</option>
                            <option value={10}>{t.decimal10}</option>
                            <option value={16}>{t.hex16}</option>
                        </Select>
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>{t.bitWidth}</label>
                        <Select value={bitWidth} onChange={(e) => setBitWidth(Number(e.target.value) as 8 | 16 | 32)}>
                            <option value={8}>8-bit</option>
                            <option value={16}>16-bit</option>
                            <option value={32}>32-bit</option>
                        </Select>
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>{t.operation}</label>
                        <Select value={operation} onChange={(e) => setOperation(e.target.value as any)}>
                            <optgroup label={t.arithmeticGroup}>
                                <option value='add'>{t.addOp}</option>
                                <option value='subtract'>{t.subtractOp}</option>
                                <option value='multiply'>{t.multiplyOp}</option>
                                <option value='divide'>{t.divideOp}</option>
                            </optgroup>
                            <optgroup label={t.bitwiseGroup}>
                                <option value='and'>{t.andOp}</option>
                                <option value='or'>{t.orOp}</option>
                                <option value='xor'>{t.xorOp}</option>
                            </optgroup>
                        </Select>
                    </div>
                </div>

                {/* Inputs */}
                <div className='grid md:grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                            {t.firstNumber} ({locale === "en" ? "Base" : "Cơ số"} {base})
                        </label>
                        <input type='text' value={num1Input} onChange={(e) => setNum1Input(e.target.value)} placeholder={base === 2 ? "1010" : base === 16 ? "A" : base === 8 ? "12" : "10"} className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 font-mono focus:ring-2 focus:ring-blue-500 transition-colors' />
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                            {t.secondNumber} ({locale === "en" ? "Base" : "Cơ số"} {base})
                        </label>
                        <input type='text' value={num2Input} onChange={(e) => setNum2Input(e.target.value)} placeholder={base === 2 ? "0110" : base === 16 ? "6" : base === 8 ? "6" : "6"} className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 font-mono focus:ring-2 focus:ring-blue-500 transition-colors' />
                    </div>
                </div>

                <Button onClick={calculate} variant='dark' size='lg' fullWidth className='shadow-sm hover:shadow-md'>
                    {t.explainDetail}
                </Button>

                {/* Explanation */}
                {explanation && (
                    <div className='mt-6 space-y-4'>
                        <div className='bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-lg border-l-4 border-indigo-500'>
                            <h4 className='font-bold text-lg text-indigo-900 dark:text-indigo-100 mb-2'>{explanation.operation}</h4>
                            <p className='text-indigo-800 dark:text-indigo-200 font-mono'>
                                {explanation.operand1} {operation === "subtract" ? "-" : operation === "multiply" ? "×" : operation === "divide" ? "÷" : operation} {explanation.operand2} = {explanation.result}
                            </p>
                        </div>

                        {explanation.steps.map((step, idx) => (
                            <div key={idx} className='bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                                <h5 className='font-bold text-gray-900 dark:text-gray-100 mb-2'>{step.step}</h5>
                                <pre className='text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono'>{step.description}</pre>
                                {step.binary && <pre className='mt-2 text-sm text-blue-600 dark:text-blue-400 font-mono bg-blue-50 dark:bg-blue-900/20 p-2 rounded'>{step.binary}</pre>}
                                {step.result && <p className='mt-2 text-green-600 dark:text-green-400 font-mono font-bold'>→ {step.result}</p>}
                            </div>
                        ))}

                        {explanation.bitLevel && explanation.bitLevel.length > 0 && (
                            <div className='bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500'>
                                <h5 className='font-bold text-yellow-900 dark:text-yellow-100 mb-3'>📊 {t.bitLevelDetail}</h5>
                                <div className='space-y-1'>
                                    {explanation.bitLevel.map((bit, idx) => (
                                        <p key={idx} className='text-sm text-yellow-800 dark:text-yellow-200 font-mono'>
                                            {bit}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CPU Explanation */}
                        <div className='bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border-l-4 border-cyan-500'>
                            <h5 className='font-bold text-cyan-900 dark:text-cyan-100 mb-2'>🖥️ {t.cpuExecution}</h5>
                            <div className='text-sm text-cyan-800 dark:text-cyan-200 space-y-2'>
                                {operation === "add" && (
                                    <>
                                        <p>• {t.cpuAdd1}</p>
                                        <p>• {t.cpuAdd2}</p>
                                        <p>
                                            • {bitWidth} {t.cpuAdd3}
                                        </p>
                                        <p>• {t.cpuAdd4}</p>
                                    </>
                                )}
                                {operation === "subtract" && (
                                    <>
                                        <p>• {t.cpuSubtract1}</p>
                                        <p>• {t.cpuSubtract2}</p>
                                        <p>• {t.cpuSubtract3}</p>
                                        <p>• {t.cpuSubtract4}</p>
                                    </>
                                )}
                                {operation === "multiply" && (
                                    <>
                                        <p>• {t.cpuMultiply1}</p>
                                        <p>• {t.cpuMultiply2}</p>
                                        <p>• {t.cpuMultiply3}</p>
                                        <p>• {t.cpuMultiply4}</p>
                                        <p>• {t.cpuMultiply5}</p>
                                    </>
                                )}
                                {operation === "divide" && (
                                    <>
                                        <p>• {t.cpuDivide1}</p>
                                        <p>• {t.cpuDivide2}</p>
                                        <p>• {t.cpuDivide3}</p>
                                        <p>• {t.cpuDivide4}</p>
                                    </>
                                )}
                                {["and", "or", "xor"].includes(operation) && (
                                    <>
                                        <p>• {t.cpuBitwise1}</p>
                                        <p>
                                            • {bitWidth} {t.cpuBitwise2}
                                        </p>
                                        <p>• {t.cpuBitwise3}</p>
                                        <p>• {t.cpuBitwise4}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
