// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { StatePropertyAccessor, TurnContext, UserState } from 'botbuilder';

import axios from 'axios'
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
    public async   intenteRecognizer(stepContext,next) {
        console.log('MainDialog.intentRecognizer');
        try {
            let input = stepContext.context.activity.text

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
                data : data
              };
              
              await axios(config)
              .then(function (response) {
                console.log(JSON.stringify(response.data.result.prediction));
                // return response.data.result.prediction
              })
              .catch(function (error) {
                console.log(error);
              });
              
        } catch (error) {
            console.log(error);
            
        }

        return await stepContext.next();

    }
    public async qnaSearch(stepContext,next) {
        console.log('MainDialog.qnaSearch');
        
        try {
            let input = stepContext.context.activity.text
            var data = JSON.stringify({'question':input})
            
            var config = {
              method: 'post',
              url: `${process.env.LanguageStudioEndpoint}/language/:query-knowledgebases?api-version=2021-10-01&deploymentName=qna-chatbot&projectName=qna-chatbot`,
              headers: { 
                'Content-Type': 'application/json', 
                'Ocp-Apim-Subscription-Key': process.env.LanguageStudioAPIKey
              },
              data :data
            };
            
            const res =await axios(config)
            .then( (response)=> {
                // JSON.stringify(response.data)
               return  response.data.answers[0]
    
            })
            .catch( (error) => {
              console.log(error);
            });
             return await stepContext.context.sendActivity(res.answer)
            } catch (error) {
                console.log(error);
            }
    }

}
