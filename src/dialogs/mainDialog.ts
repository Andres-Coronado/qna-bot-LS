// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { StatePropertyAccessor, TurnContext, UserState } from 'botbuilder';
const { MessageFactory,CardFactory } = require('botbuilder');

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
            // this.welcome.bind(this),
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

    //En caso de no contar con CLU puedes usar esta funcion
    // public async  welcome(step: WaterfallStepContext, next: () => Promise<void>) {
    //     console.log('MainDialog.welcome');
        
    //     const userInput = step.context.activity.text.trim().toLowerCase();
    //     const WELCOMES = ['hola', 'hi', 'hello', 'eit', 'whats up', 'que onda', 'sup', 'buenos dias', 'buenas', 'ola', 'watzup'];
    //     if (WELCOMES.indexOf(userInput) !== -1) {
    //         await step.context.sendActivity('??En qu?? puedo ayudarte hoy?');
    //         return await step.endDialog();
    //     } else {
    //         return await step.next();
    //     }
    // }

    //----
    public async   intentRecognizer(stepContext,next) {
        console.log('MainDialog.intentRecognizer');
        let input = stepContext.context.activity.text
        const intent:any = await CLU(input)
        console.log(intent);
        if( intent.intents[intent.intents.length-1].confidenceScore >= 1){
            return await stepContext.next()
        }
    //     if(intent.topIntent==='Welcome' && intent.intents[0].confidenceScore >= 0.99 ){
    //        await stepContext.context.sendActivity('??En qu?? te puedo ayudar? ');
    //       return await stepContext.endDialog();
    //     }
    //     else if(intent.topIntent==='GoodBye' && intent.intents[0].confidenceScore >= 0.99 ){
    //        await stepContext.context.sendActivity('Adios ???????? ');
    //       return await stepContext.endDialog();
    //     }
    //     else {
    //       return await stepContext.next();
    //   }


    const intents = {
        Welcome: { confidenceScore: 0.99, message: '??En qu?? te puedo ayudar? ' },
        GoodBye: { confidenceScore: 0.99, message: 'Adios ???????? ' },
      };
      
      const { topIntent, intents: [{ confidenceScore }] } = intent;
      
      if (!intents[topIntent] || confidenceScore < intents[topIntent].confidenceScore) {
        return await stepContext.next();
      }
      
      await stepContext.context.sendActivity(intents[topIntent].message);
      return await stepContext.endDialog();
      


        
    }
    public async qnaSearch(stepContext,next) {
        console.log('MainDialog.qnaSearch');
        let input = stepContext.context.activity.text
        const resQNA = await QnA(input)
        console.log(resQNA);

        const card  =CardFactory.adaptiveCard({
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "1.0",
                "body": [
                    {
                        "type": "TextBlock",
                        "text": resQNA,
                        "wrap": true
                    }
                ],
                "actions": [
                    {
                        "type": "Action.Submit",
                        "title": "????????" ,
                        "data": {
                            "like": true
                        }
                    },
                    {
                        "type": "Action.Submit",
                        "title": "????????",
                        "data": {
                            "like": false
                        }
                    }
                ]
        })
        const message = MessageFactory.attachment(card);

      return await stepContext.context.sendActivity(message);

        

    }

}
