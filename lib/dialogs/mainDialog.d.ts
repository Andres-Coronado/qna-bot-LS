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
    choiceCardStep(stepContext: WaterfallStepContext): Promise<import("botbuilder-dialogs").DialogTurnResult<any>>;
    /**
     * Send a Rich Card response to the user based on their choice.
     * This method is only called when a valid prompt response is parsed from the user's response to the ChoicePrompt.
     * @param {WaterfallStepContext} stepContext
     */
    showCardStep(stepContext: any): Promise<any>;
    /**
     * Create the choices with synonyms to render for the user during the ChoicePrompt.
     * (Indexes and upper/lower-case variants do not need to be added as synonyms)
     */
    getChoices(): {
        synonyms: string[];
        value: string;
    }[];
    private createAdaptiveCard;
    private createAnimationCard;
    private createAudioCard;
    private createOAuthCard;
    private createHeroCard;
    private createReceiptCard;
    private createSignInCard;
    private createThumbnailCard;
    private createVideoCard;
}
