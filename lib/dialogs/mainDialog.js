"use strict";
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
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const adaptiveCard_json_1 = __importDefault(require("../resources/adaptiveCard.json"));
const botbuilder_1 = require("botbuilder");
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';
class MainDialog extends botbuilder_dialogs_1.ComponentDialog {
    constructor() {
        super('MainDialog');
        // Define the main dialog and its related components.
        this.addDialog(new botbuilder_dialogs_1.ChoicePrompt('cardPrompt'));
        this.addDialog(new botbuilder_dialogs_1.WaterfallDialog(MAIN_WATERFALL_DIALOG, [
            this.choiceCardStep.bind(this),
            this.showCardStep.bind(this)
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
    choiceCardStep(stepContext) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('MainDialog.choiceCardStep');
            // Create the PromptOptions which contain the prompt and re-prompt messages.
            // PromptOptions also contains the list of choices available to the user.
            const options = {
                choices: this.getChoices(),
                prompt: 'What card would you like to see? You can click or type the card name',
                retryPrompt: 'That was not a valid choice, please select a card or number from 1 to 9.'
            };
            // Prompt the user with the configured PromptOptions.
            return yield stepContext.prompt('cardPrompt', options);
        });
    }
    /**
     * Send a Rich Card response to the user based on their choice.
     * This method is only called when a valid prompt response is parsed from the user's response to the ChoicePrompt.
     * @param {WaterfallStepContext} stepContext
     */
    showCardStep(stepContext) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('MainDialog.showCardStep');
            switch (stepContext.result.value) {
                case 'Adaptive Card':
                    yield stepContext.context.sendActivity({ attachments: [this.createAdaptiveCard()] });
                    break;
                case 'Animation Card':
                    yield stepContext.context.sendActivity({ attachments: [this.createAnimationCard()] });
                    break;
                case 'Audio Card':
                    yield stepContext.context.sendActivity({ attachments: [this.createAudioCard()] });
                    break;
                case 'OAuth Card':
                    yield stepContext.context.sendActivity({ attachments: [this.createOAuthCard()] });
                    break;
                case 'Hero Card':
                    yield stepContext.context.sendActivity({ attachments: [this.createHeroCard()] });
                    break;
                case 'Receipt Card':
                    yield stepContext.context.sendActivity({ attachments: [this.createReceiptCard()] });
                    break;
                case 'Signin Card':
                    yield stepContext.context.sendActivity({ attachments: [this.createSignInCard()] });
                    break;
                case 'Thumbnail Card':
                    yield stepContext.context.sendActivity({ attachments: [this.createThumbnailCard()] });
                    break;
                case 'Video Card':
                    yield stepContext.context.sendActivity({ attachments: [this.createVideoCard()] });
                    break;
                default:
                    yield stepContext.context.sendActivity({
                        attachmentLayout: botbuilder_1.AttachmentLayoutTypes.Carousel,
                        attachments: [
                            this.createAdaptiveCard(),
                            this.createAnimationCard(),
                            this.createAudioCard(),
                            this.createOAuthCard(),
                            this.createHeroCard(),
                            this.createReceiptCard(),
                            this.createSignInCard(),
                            this.createThumbnailCard(),
                            this.createVideoCard()
                        ]
                    });
                    break;
            }
            // Give the user instructions about what to do next
            yield stepContext.context.sendActivity('Type anything to see another card.');
            return yield stepContext.endDialog();
        });
    }
    /**
     * Create the choices with synonyms to render for the user during the ChoicePrompt.
     * (Indexes and upper/lower-case variants do not need to be added as synonyms)
     */
    getChoices() {
        const cardOptions = [
            {
                synonyms: ['adaptive'],
                value: 'Adaptive Card'
            },
            {
                synonyms: ['animation'],
                value: 'Animation Card'
            },
            {
                synonyms: ['audio'],
                value: 'Audio Card'
            },
            {
                synonyms: ['hero'],
                value: 'Hero Card'
            },
            {
                synonyms: ['oauth'],
                value: 'OAuth Card'
            },
            {
                synonyms: ['receipt'],
                value: 'Receipt Card'
            },
            {
                synonyms: ['signin'],
                value: 'Signin Card'
            },
            {
                synonyms: ['thumbnail', 'thumb'],
                value: 'Thumbnail Card'
            },
            {
                synonyms: ['video'],
                value: 'Video Card'
            },
            {
                synonyms: ['all'],
                value: 'All Cards'
            }
        ];
        return cardOptions;
    }
    // ======================================
    // Helper functions used to create cards.
    // ======================================
    createAdaptiveCard() {
        return botbuilder_1.CardFactory.adaptiveCard(adaptiveCard_json_1.default);
    }
    createAnimationCard() {
        return botbuilder_1.CardFactory.animationCard('Microsoft Bot Framework', [
            { url: 'https://i.giphy.com/Ki55RUbOV5njy.gif' }
        ], [], {
            subtitle: 'Animation Card'
        });
    }
    createAudioCard() {
        return botbuilder_1.CardFactory.audioCard('I am your father', ['https://www.mediacollege.com/downloads/sound-effects/star-wars/darthvader/darthvader_yourfather.wav'], botbuilder_1.CardFactory.actions([
            {
                title: 'Read more',
                type: 'openUrl',
                value: 'https://en.wikipedia.org/wiki/The_Empire_Strikes_Back'
            }
        ]), {
            image: { url: 'https://upload.wikimedia.org/wikipedia/en/3/3c/SW_-_Empire_Strikes_Back.jpg', alt: '' },
            subtitle: 'Star Wars: Episode V - The Empire Strikes Back',
            text: 'The Empire Strikes Back (also known as Star Wars: Episode V – The Empire Strikes Back) is a 1980 American epic space opera film directed by Irvin Kershner. Leigh Brackett and Lawrence Kasdan wrote the screenplay, with George Lucas writing the film\'s story and serving as executive producer. The second installment in the original Star Wars trilogy, it was produced by Gary Kurtz for Lucasfilm Ltd. and stars Mark Hamill, Harrison Ford, Carrie Fisher, Billy Dee Williams, Anthony Daniels, David Prowse, Kenny Baker, Peter Mayhew and Frank Oz.'
        });
    }
    createOAuthCard() {
        return botbuilder_1.CardFactory.oauthCard('OAuth connection', // Replace with the name of your Azure AD connection
        'Sign In', 'BotFramework OAuth Card');
    }
    createHeroCard() {
        return botbuilder_1.CardFactory.heroCard('BotFramework Hero Card', botbuilder_1.CardFactory.images(['https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg']), botbuilder_1.CardFactory.actions([
            {
                title: 'Get started',
                type: 'openUrl',
                value: 'https://docs.microsoft.com/en-us/azure/bot-service/'
            }
        ]));
    }
    createReceiptCard() {
        return botbuilder_1.CardFactory.receiptCard({
            buttons: botbuilder_1.CardFactory.actions([
                {
                    title: 'More information',
                    type: 'openUrl',
                    value: 'https://azure.microsoft.com/en-us/pricing/details/bot-service/'
                }
            ]),
            facts: [
                {
                    key: 'Order Number',
                    value: '1234'
                },
                {
                    key: 'Payment Method',
                    value: 'VISA 5555-****'
                }
            ],
            items: [
                {
                    image: { url: 'https://github.com/amido/azure-vector-icons/raw/master/renders/traffic-manager.png' },
                    price: '$38.45',
                    quantity: '368',
                    subtitle: '',
                    tap: { text: '', title: '', type: '', value: '' },
                    text: '',
                    title: 'Data Transfer'
                },
                {
                    image: { url: 'https://github.com/amido/azure-vector-icons/raw/master/renders/cloud-service.png' },
                    price: '$45.00',
                    quantity: '720',
                    subtitle: '',
                    tap: { text: '', title: '', type: '', value: '' },
                    text: '',
                    title: 'App Service'
                }
            ],
            tap: { text: '', title: '', type: '', value: '' },
            tax: '$7.50',
            title: 'John Doe',
            total: '$90.95',
            vat: '$0.02'
        });
    }
    createSignInCard() {
        return botbuilder_1.CardFactory.signinCard('BotFramework Sign in Card', 'https://login.microsoftonline.com', 'Sign in');
    }
    createThumbnailCard() {
        return botbuilder_1.CardFactory.thumbnailCard('BotFramework Thumbnail Card', [{ url: 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg' }], [{
                title: 'Get started',
                type: 'openUrl',
                value: 'https://docs.microsoft.com/en-us/azure/bot-service/'
            }], {
            subtitle: 'Your bots — wherever your users are talking.',
            text: 'Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.'
        });
    }
    createVideoCard() {
        return botbuilder_1.CardFactory.videoCard('2018 Imagine Cup World Championship Intro', [{ url: 'https://sec.ch9.ms/ch9/783d/d57287a5-185f-4df9-aa08-fcab699a783d/IC18WorldChampionshipIntro2.mp4' }], [{
                title: 'Lean More',
                type: 'openUrl',
                value: 'https://channel9.msdn.com/Events/Imagine-Cup/World-Finals-2018/2018-Imagine-Cup-World-Championship-Intro'
            }], {
            subtitle: 'by Microsoft',
            text: 'Microsoft\'s Imagine Cup has empowered student developers around the world to create and innovate on the world stage for the past 16 years. These innovations will shape how we live, work and play.'
        });
    }
}
exports.MainDialog = MainDialog;
//# sourceMappingURL=mainDialog.js.map