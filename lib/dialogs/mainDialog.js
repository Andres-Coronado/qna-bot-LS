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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainDialog = void 0;
const languageApi_1 = require("../helper/languageApi");
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';
class MainDialog extends botbuilder_dialogs_1.ComponentDialog {
    constructor() {
        super('MainDialog');
        // Define the main dialog and its related components.
        this.addDialog(new botbuilder_dialogs_1.ChoicePrompt('cardPrompt'));
        this.addDialog(new botbuilder_dialogs_1.WaterfallDialog(MAIN_WATERFALL_DIALOG, [
            // this.intentRecognizer.bind(this),
            this.welcome.bind(this),
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
    //En caso de no contar con CLU puedes usar esta funcion
    welcome(step, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('MainDialog.welcome');
            const userInput = step.context.activity.text.trim().toLowerCase();
            const WELCOMES = ['hola', 'hi', 'hello', 'eit', 'whats up', 'que onda', 'sup', 'buenos dias', 'buenas', 'ola', 'watzup'];
            if (WELCOMES.indexOf(userInput) !== -1) {
                yield step.context.sendActivity('¿En qué puedo ayudarte hoy?');
                return yield step.endDialog();
            }
            else {
                return yield step.next();
            }
        });
    }
    //----
    // public async   intentRecognizer(stepContext,next) {
    //     console.log('MainDialog.intentRecognizer');
    //     let input = stepContext.context.activity.text
    //     const intent:any = await CLU(input)
    //     console.log(intent);
    //     if(intent.topIntent==='Welcome' && intent.intents[0].confidenceScore >= 0.9999999){
    //        await stepContext.context.sendActivity('¿En qué te puedo ayudar? ');
    //       return await stepContext.endDialog();
    //     }else {
    //       return await next();
    //   }
    // }
    qnaSearch(stepContext, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('MainDialog.qnaSearch');
            let input = stepContext.context.activity.text;
            const resQNA = yield languageApi_1.QnA(input);
            console.log(resQNA);
            return yield stepContext.context.sendActivity(resQNA);
        });
    }
}
exports.MainDialog = MainDialog;
//# sourceMappingURL=mainDialog.js.map