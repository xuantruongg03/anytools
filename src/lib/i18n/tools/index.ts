import { uuidGeneratorTranslations } from "./uuid-generator";
import { jwtDecoderTranslations } from "./jwt-decoder";
import { timestampConverterTranslations } from "./timestamp-converter";
import { regexTesterTranslations } from "./regex-tester";
import { cssUnitConverterTranslations } from "./css-unit-converter";
import { htmlEntityEncoderTranslations } from "./html-entity-encoder";
import { numberConverterTranslations } from "./number-converter";
import { passwordGeneratorTranslations } from "./password-generator";
import { gpaCalculatorTranslations } from "./gpa-calculator";
import { newToolsTranslations } from "./new-tools";

export const toolsTranslations = {
    en: {
        ...newToolsTranslations.en,
        uuidGenerator: uuidGeneratorTranslations.en,
        jwtDecoder: jwtDecoderTranslations.en,
        timestampConverter: timestampConverterTranslations.en.timestampConverter,
        regexTester: regexTesterTranslations.en.regexTester,
        cssUnitConverter: cssUnitConverterTranslations.en.cssUnitConverter,
        htmlEntityEncoder: htmlEntityEncoderTranslations.en.htmlEntityEncoder,
        numberConverter: numberConverterTranslations.en.numberConverter,
        passwordGenerator: passwordGeneratorTranslations.en.passwordGenerator,
        gpaCalculator: gpaCalculatorTranslations.en.gpaCalculator,
    },
    vi: {
        ...newToolsTranslations.vi,
        uuidGenerator: uuidGeneratorTranslations.vi,
        jwtDecoder: jwtDecoderTranslations.vi,
        timestampConverter: timestampConverterTranslations.vi.timestampConverter,
        regexTester: regexTesterTranslations.vi.regexTester,
        cssUnitConverter: cssUnitConverterTranslations.vi.cssUnitConverter,
        htmlEntityEncoder: htmlEntityEncoderTranslations.vi.htmlEntityEncoder,
        numberConverter: numberConverterTranslations.vi.numberConverter,
        passwordGenerator: passwordGeneratorTranslations.vi.passwordGenerator,
        gpaCalculator: gpaCalculatorTranslations.vi.gpaCalculator,
    },
};
