// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { StatePropertyAccessor, TurnContext, UserState } from 'botbuilder';
import {CLU,QnA} from '../helper/languageApi'
import {
    ChoicePrompt,
    ComponentDialog,
    DialogSet,
    DialogTurnStatus,
    WaterfallDialog,
    WaterfallStepContext
} from 'botbuilder-dialogs';

const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';

export class MainDialog extends ComponentDialog {

    constructor() {
        super('MainDialog');

        // Define the main dialog and its related components.
        this.addDialog(new ChoicePrompt('cardPrompt'));
        this.addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
            this.intentRecognizer.bind(this),
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
    public async run(turnContext: TurnContext, accessor: StatePropertyAccessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
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
    public async   intentRecognizer(stepContext,next) {
        console.log('MainDialog.intentRecognizer');
        let input = stepContext.context.activity.text
        const intent:any = await CLU(input)
        console.log(intent);
        if(intent.topIntent==='Welcome' && intent.intents[0].confidenceScore >= 0.90){
           await stepContext.context.sendActivity('¿En qué te puedo ayudar? ');
          return await stepContext.endDialog();
        }else {
          return await stepContext.next();
      }
        
    }
    public async qnaSearch(stepContext,next) {
        console.log('MainDialog.qnaSearch');
        let input = stepContext.context.activity.text
        const resQNA = await QnA(input)
        console.log(resQNA);
        return  await stepContext.context.sendActivity(resQNA);

        

    }

}
