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
import { eventReminderTranslations } from "./event-reminder";
import { stopwatchTranslations } from "./stopwatch";
import { apiTesterTranslations } from "./api-tester";
import { microphoneTestTranslations } from "./microphone-test";
import { randomToolsTranslations } from "./random-tools";
import { weatherTranslations } from "./weather";
import { slideshareDownloaderTranslations } from "./slideshare-downloader";
import { studocuDownloaderTranslations } from "./studocu-downloader";
import { speechToTextTranslations } from "./speech-to-text";
import { removeBackgroundTranslations } from "./remove-background";
import { latexEditorTranslations } from "./latex-editor";
import { markdownEditorTranslations } from "./markdown-editor";
import { mockApiGeneratorTranslations } from "./mock-api-generator";
import { placeholderImageTranslations } from "./placeholder-image";
import { ipLookupTranslations } from "./ip-lookup";
import { fiveNewToolsTranslations } from "./five-new-tools";

export const toolsTranslations = {
    en: {
        ...newToolsTranslations.en,
        ...randomToolsTranslations.en,
        ...fiveNewToolsTranslations.en,
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
        eventReminder: eventReminderTranslations.en.eventReminder,
        stopwatch: stopwatchTranslations.en.stopwatch,
        apiTester: apiTesterTranslations.en.apiTester,
        microphoneTest: microphoneTestTranslations.en.microphoneTest,
        weather: weatherTranslations.en.weather,
        slideshareDownloader: slideshareDownloaderTranslations.en,
        studocuDownloader: studocuDownloaderTranslations.en,
        speechToText: speechToTextTranslations.en,
        removeBackground: removeBackgroundTranslations.en,
        latexEditor: latexEditorTranslations.en.latexEditor,
        markdownEditor: markdownEditorTranslations.en.markdownEditor,
        mockApiGenerator: mockApiGeneratorTranslations.en.mockApiGenerator,
        placeholderImage: placeholderImageTranslations.en.placeholderImage,
        ipLookup: ipLookupTranslations.en.ipLookup,
    },
    vi: {
        ...newToolsTranslations.vi,
        ...randomToolsTranslations.vi,
        ...fiveNewToolsTranslations.vi,
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
        eventReminder: eventReminderTranslations.vi.eventReminder,
        stopwatch: stopwatchTranslations.vi.stopwatch,
        apiTester: apiTesterTranslations.vi.apiTester,
        microphoneTest: microphoneTestTranslations.vi.microphoneTest,
        weather: weatherTranslations.vi.weather,
        slideshareDownloader: slideshareDownloaderTranslations.vi,
        studocuDownloader: studocuDownloaderTranslations.vi,
        speechToText: speechToTextTranslations.vi,
        removeBackground: removeBackgroundTranslations.vi,
        latexEditor: latexEditorTranslations.vi.latexEditor,
        markdownEditor: markdownEditorTranslations.vi.markdownEditor,
        mockApiGenerator: mockApiGeneratorTranslations.vi.mockApiGenerator,
        placeholderImage: placeholderImageTranslations.vi.placeholderImage,
        ipLookup: ipLookupTranslations.vi.ipLookup,
    },
};
