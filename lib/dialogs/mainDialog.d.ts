import { StatePropertyAccessor, TurnContext } from 'botbuilder';
import { ComponentDialog, WaterfallStepContext } from 'botbuilder-dialogs';
export declare class MainDialog extends ComponentDialog {
    constructor();
    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    run(turnContext: TurnContext, accessor: StatePropertyAccessor): Promise<void>;
    /**
     * 1. Prompts the user if the user is not in the middle of a dialog.
     * 2. Re-prompts the user when an invalid input is received.
     *
     * @param {WaterfallStepContext} stepContext
     */
    /**
     * name
     */
    welcome(step: WaterfallStepContext, next: () => Promise<void>): Promise<import("botbuilder-dialogs").DialogTurnResult<any>>;
    qnaSearch(stepContext: any, next: any): Promise<any>;
}
