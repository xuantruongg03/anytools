"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { numberConverterTranslations } from "@/lib/i18n/tools/number-converter";
import BitwiseExplainer from "./BitwiseExplainer";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

export default function NumberConverterClient() {
    const { locale } = useLanguage();
    const t = numberConverterTranslations[locale].numberConverter.ui;

    const [decimal, setDecimal] = useState("");
    const [binary, setBinary] = useState("");
    const [hex, setHex] = useState("");
    const [octal, setOctal] = useState("");

    // Bitwise operations
    const [operation, setOperation] = useState("and");
    const [operand1, setOperand1] = useState("");
    const [operand2, setOperand2] = useState("");
    const [shiftAmount, setShiftAmount] = useState("1");
    const [bitwiseResult, setBitwiseResult] = useState<number | null>(null);

    const convertFromDecimal = (value: string) => {
        if (!value) {
            setDecimal("");
            setBinary("");
            setHex("");
            setOctal("");
            return;
        }
        const num = parseInt(value);
        if (isNaN(num)) return;
        setDecimal(value);
        setBinary(num.toString(2));
        setHex(num.toString(16).toUpperCase());
        setOctal(num.toString(8));
    };

    const convertFromBinary = (value: string) => {
        if (!value) {
            setDecimal("");
            setBinary("");
            setHex("");
            setOctal("");
            return;
        }
        const num = parseInt(value, 2);
        if (isNaN(num)) return;
        setBinary(value);
        setDecimal(num.toString());
        setHex(num.toString(16).toUpperCase());
        setOctal(num.toString(8));
    };

    const convertFromHex = (value: string) => {
        if (!value) {
            setDecimal("");
            setBinary("");
            setHex("");
            setOctal("");
            return;
        }
        const num = parseInt(value, 16);
        if (isNaN(num)) return;
        setHex(value.toUpperCase());
        setDecimal(num.toString());
        setBinary(num.toString(2));
        setOctal(num.toString(8));
    };

    const convertFromOctal = (value: string) => {
        if (!value) {
            setDecimal("");
            setBinary("");
            setHex("");
            setOctal("");
            return;
        }
        const num = parseInt(value, 8);
        if (isNaN(num)) return;
        setOctal(value);
        setDecimal(num.toString());
        setBinary(num.toString(2));
        setHex(num.toString(16).toUpperCase());
    };

    const calculateBitwise = () => {
        const num1 = parseInt(operand1) || 0;
        const num2 = operation === "not" ? 0 : parseInt(operand2) || 0;
        const shift = parseInt(shiftAmount) || 0;

        let result: number;
        switch (operation) {
            case "and":
                result = num1 & num2;
                break;
            case "or":
                result = num1 | num2;
                break;
            case "xor":
                result = num1 ^ num2;
                break;
            case "not":
                result = ~num1;
                break;
            case "leftShift":
                result = num1 << shift;
                break;
            case "rightShift":
                result = num1 >> shift;
                break;
            case "unsignedRightShift":
                result = num1 >>> shift;
                break;
            case "add":
                result = num1 + num2;
                break;
            case "subtract":
                result = num1 - num2;
                break;
            case "multiply":
                result = num1 * num2;
                break;
            case "divide":
                result = Math.floor(num1 / num2);
                break;
            case "modulo":
                result = num1 % num2;
                break;
            default:
                result = 0;
        }
        setBitwiseResult(result);
    };

    const clearAll = () => {
        setDecimal("");
        setBinary("");
        setHex("");
        setOctal("");
    };

    return (
        <div className='space-y-6'>
            {/* Number System Converter */}
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>Number Systems</h3>
                    <Button onClick={clearAll} variant='gray' size='sm'>
                        {t.clearButton}
                    </Button>
                </div>

                <div className='grid md:grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>{t.decimalLabel}</label>
                        <input type='text' value={decimal} onChange={(e) => convertFromDecimal(e.target.value)} placeholder='255' className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors' />
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>{t.binaryLabel}</label>
                        <input type='text' value={binary} onChange={(e) => convertFromBinary(e.target.value)} placeholder='11111111' className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors' />
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>{t.hexLabel}</label>
                        <input type='text' value={hex} onChange={(e) => convertFromHex(e.target.value)} placeholder='FF' className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors' />
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>{t.octalLabel}</label>
                        <input type='text' value={octal} onChange={(e) => convertFromOctal(e.target.value)} placeholder='377' className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors' />
                    </div>
                </div>
            </div>

            {/* Bitwise Operations */}
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors'>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>{t.bitwiseTitle}</h3>

                <div className='space-y-4'>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>{t.operation}</label>
                        <Select value={operation} onChange={(e) => setOperation(e.target.value)}>
                            <optgroup label={t.bitwiseTitle}>
                                <option value='and'>{t.and}</option>
                                <option value='or'>{t.or}</option>
                                <option value='xor'>{t.xor}</option>
                                <option value='not'>{t.not}</option>
                                <option value='leftShift'>{t.leftShift}</option>
                                <option value='rightShift'>{t.rightShift}</option>
                                <option value='unsignedRightShift'>{t.unsignedRightShift}</option>
                            </optgroup>
                            <optgroup label={t.arithmeticTitle}>
                                <option value='add'>{t.add}</option>
                                <option value='subtract'>{t.subtract}</option>
                                <option value='multiply'>{t.multiply}</option>
                                <option value='divide'>{t.divide}</option>
                                <option value='modulo'>{t.modulo}</option>
                            </optgroup>
                        </Select>
                    </div>{" "}
                    <div className='grid md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>{operation === "not" ? "Number" : t.operand1}</label>
                            <input type='text' value={operand1} onChange={(e) => setOperand1(e.target.value)} placeholder='10' className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 font-mono focus:ring-2 focus:ring-blue-500 transition-colors' />
                        </div>

                        {!["not", "leftShift", "rightShift", "unsignedRightShift"].includes(operation) && (
                            <div>
                                <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>{t.operand2}</label>
                                <input type='text' value={operand2} onChange={(e) => setOperand2(e.target.value)} placeholder='6' className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 font-mono focus:ring-2 focus:ring-blue-500 transition-colors' />
                            </div>
                        )}

                        {["leftShift", "rightShift", "unsignedRightShift"].includes(operation) && (
                            <div>
                                <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                                    {t.shiftAmount} ({t.bits})
                                </label>
                                <input type='text' value={shiftAmount} onChange={(e) => setShiftAmount(e.target.value)} placeholder='1' className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 font-mono focus:ring-2 focus:ring-blue-500 transition-colors' />
                            </div>
                        )}
                    </div>
                    <Button onClick={calculateBitwise} variant='primary' size='lg' fullWidth className='shadow-sm hover:shadow-md'>
                        {t.calculate}
                    </Button>
                    {bitwiseResult !== null && (
                        <div className='mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500'>
                            <p className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>{t.result}:</p>
                            <div className='space-y-2'>
                                <p className='font-mono text-lg text-gray-900 dark:text-gray-100'>
                                    <span className='text-gray-600 dark:text-gray-400'>{t.decimalValue}:</span> {bitwiseResult}
                                </p>
                                <p className='font-mono text-sm text-blue-600 dark:text-blue-400'>
                                    <span className='text-gray-600 dark:text-gray-400'>{t.binaryRep}:</span> {bitwiseResult.toString(2)}
                                </p>
                                <p className='font-mono text-sm text-purple-600 dark:text-purple-400'>
                                    <span className='text-gray-600 dark:text-gray-400'>{t.hexValue}:</span> {bitwiseResult.toString(16).toUpperCase()}
                                </p>
                                <p className='font-mono text-sm text-orange-600 dark:text-orange-400'>
                                    <span className='text-gray-600 dark:text-gray-400'>{t.octalValue}:</span> {bitwiseResult.toString(8)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bitwise Explainer Component */}
            <BitwiseExplainer />
        </div>
    );
}
