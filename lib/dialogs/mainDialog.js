"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainDialog = void 0;
const axios_1 = __importDefault(require("axios"));
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';
class MainDialog extends botbuilder_dialogs_1.ComponentDialog {
    constructor() {
        super('MainDialog');
        // Define the main dialog and its related components.
        this.addDialog(new botbuilder_dialogs_1.ChoicePrompt('cardPrompt'));
        this.addDialog(new botbuilder_dialogs_1.WaterfallDialog(MAIN_WATERFALL_DIALOG, [
            this.intenteRecognizer.bind(this),
            this.qnaSearch.bind(this),
        ]));
        // The initial child Dialog to run.
        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }
    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    run(turnContext, accessor) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialogSet = new botbuilder_dialogs_1.DialogSet(accessor);
            dialogSet.add(this);
            const dialogContext = yield dialogSet.createContext(turnContext);
            const results = yield dialogContext.continueDialog();
            if (results.status === botbuilder_dialogs_1.DialogTurnStatus.empty) {
                yield dialogContext.beginDialog(this.id);
            }
        });
    }
    /**
     * 1. Prompts the user if the user is not in the middle of a dialog.
     * 2. Re-prompts the user when an invalid input is received.
     *
     * @param {WaterfallStepContext} stepContext
     */
    /**
     * name
     */
    intenteRecognizer(stepContext, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('MainDialog.intentRecognizer');
            try {
                let input = stepContext.context.activity.text;
                var data = JSON.stringify({
                    "kind": "Conversation",
                    "analysisInput": {
                        "conversationItem": {
                            "id": "1",
                            "text": input,
                            "participantId": "1"
                        }
                    },
                    "parameters": {
                        "projectName": "CLI-bot",
                        "verbose": true,
                        "deploymentName": "CLU",
                        "stringIndexType": "TextElement_V8"
                    }
                });
                var config = {
                    method: 'post',
                    url: `${process.env.LanguageStudioEndpoint}/language/:analyze-conversations?api-version=2022-10-01-preview`,
                    headers: {
                        'Ocp-Apim-Subscription-Key': process.env.LanguageStudioAPIKey,
                        'Apim-Request-Id': '4ffcac1c-b2fc-48ba-bd6d-b69d9942995a',
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                yield axios_1.default(config)
                    .then(function (response) {
                    console.log(JSON.stringify(response.data.result.prediction));
                    // return response.data.result.prediction
                })
                    .catch(function (error) {
                    console.log(error);
                });
            }
            catch (error) {
            }
            return yield stepContext.next();
        });
    }
    qnaSearch(stepContext, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('MainDialog.qnaSearch');
            try {
                let input = stepContext.context.activity.text;
                var data = JSON.stringify({ 'question': input });
                var config = {
                    method: 'post',
                    url: `${process.env.LanguageStudioEndpoint}/language/:query-knowledgebases?api-version=2021-10-01&deploymentName=qna-chatbot&projectName=qna-chatbot`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Ocp-Apim-Subscription-Key': process.env.LanguageStudioAPIKey
                    },
                    data: data
                };
                const res = yield axios_1.default(config)
                    .then((response) => {
                    // JSON.stringify(response.data)
                    return response.data.answers[0];
                })
                    .catch((error) => {
                    console.log(error);
                });
                return yield stepContext.context.sendActivity(res.answer);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.MainDialog = MainDialog;
//# sourceMappingURL=mainDialog.js.map