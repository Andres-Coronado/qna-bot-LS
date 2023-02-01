import { ConversationState, UserState } from 'botbuilder';
import { DialogBot } from './dialogBot';
import { MainDialog } from '../dialogs/mainDialog';
/**
 * RichCardsBot prompts a user to select a Rich Card and then returns the card
 * that matches the user's selection.
 */
export declare class RichCardsBot extends DialogBot {
    constructor(conversationState: ConversationState, userState: UserState, dialog: MainDialog);
}
