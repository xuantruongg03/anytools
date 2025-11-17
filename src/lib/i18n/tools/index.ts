import { uuidGeneratorTranslations } from "./uuid-generator";
import { jwtDecoderTranslations } from "./jwt-decoder";
import { timestampConverterTranslations } from "./timestamp-converter";
import { regexTesterTranslations } from "./regex-tester";
import { cssUnitConverterTranslations } from "./css-unit-converter";
import { htmlEntityEncoderTranslations } from "./html-entity-encoder";
import { numberConverterTranslations } from "./number-converter";
import { passwordGeneratorTranslations } from "./password-generator";
import { gpaCalculatorTranslations } from "./gpa-calculator";
import { repoTreeTranslations } from "./repo-tree";
import { newToolsTranslations } from "./new-tools";
import { worldClockTranslations } from "./world-clock";
import { countdownTranslations } from "./countdown";
import { stopwatchTranslations } from "./stopwatch";

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
        repoTree: repoTreeTranslations.en.repoTree,
        worldClock: worldClockTranslations.en.worldClock,
        countdown: countdownTranslations.en.countdown,
        stopwatch: stopwatchTranslations.en.stopwatch,
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
        repoTree: repoTreeTranslations.vi.repoTree,
        worldClock: worldClockTranslations.vi.worldClock,
        countdown: countdownTranslations.vi.countdown,
        stopwatch: stopwatchTranslations.vi.stopwatch,
    },
};
