"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv_1 = require("dotenv");
const path = __importStar(require("path"));
const restify = __importStar(require("restify"));
// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const botbuilder_1 = require("botbuilder");
// This bot's main dialog.
const dialogBot_1 = require("./bots/dialogBot");
const mainDialog_1 = require("./dialogs/mainDialog");
// Read environment variables from .env file
const ENV_FILE = path.join(__dirname, '..', '.env');
dotenv_1.config({ path: ENV_FILE });
const botFrameworkAuthentication = new botbuilder_1.ConfigurationBotFrameworkAuthentication(process.env);
// Create the adapter. See https://aka.ms/about-bot-adapter to learn more about using information from
// the .bot file when configuring your adapter.
const adapter = new botbuilder_1.CloudAdapter(botFrameworkAuthentication);
// Catch-all for errors.
adapter.onTurnError = (context, error) => __awaiter(void 0, void 0, void 0, function* () {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError] unhandled error: ${error}`);
    // Send a trace activity, which will be displayed in Bot Framework Emulator
    yield context.sendTraceActivity('OnTurnError Trace', `${error}`, 'https://www.botframework.com/schemas/error', 'TurnError');
    // Send a message to the user
    yield context.sendActivity('The bot encounted an error or bug.');
    yield context.sendActivity('To continue to run this bot, please fix the bot source code.');
    // Clear out state
    yield conversationState.delete(context);
});
// Define the state store for your bot.
// See https://aka.ms/about-bot-state to learn more about using MemoryStorage.
// A bot requires a state storage system to persist the dialog and user state between messages.
const memoryStorage = new botbuilder_1.MemoryStorage();
// Create conversation state with in-memory storage provider.
const conversationState = new botbuilder_1.ConversationState(memoryStorage);
const userState = new botbuilder_1.UserState(memoryStorage);
// Create the main dialog.
const dialog = new mainDialog_1.MainDialog();
const bot = new dialogBot_1.DialogBot(conversationState, userState, dialog);
// Create HTTP server.
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${server.name} listening to ${server.url}.`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});
// Listen for incoming activities and route them to your bot main dialog.
server.post('/api/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Route received a request to adapter for processing
    yield adapter.process(req, res, (context) => bot.run(context));
}));
//# sourceMappingURL=index.js.map