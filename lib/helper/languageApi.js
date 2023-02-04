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
exports.QnA = exports.CLU = void 0;
const axios_1 = __importDefault(require("axios"));
// export async function CLU(input) {
//     try {
//         var data = JSON.stringify({
//             "kind": "Conversation",
//             "analysisInput": {
//               "conversationItem": {
//                 "id": "1",
//                 "text": input,
//                 "participantId": "1"
//               }
//             },
//             "parameters": {
//               "projectName": "CLI-bot",
//               "verbose": true,
//               "deploymentName": "CLU",
//               "stringIndexType": "TextElement_V8"
//             }
//           });
//           var config = {
//             method: 'post',
//             url: `${process.env.LanguageStudioEndpoint}/language/:analyze-conversations?api-version=2022-10-01-preview`,
//             headers: { 
//               'Ocp-Apim-Subscription-Key': process.env.LanguageStudioAPIKey, 
//               'Apim-Request-Id': '4ffcac1c-b2fc-48ba-bd6d-b69d9942995a', 
//               'Content-Type': 'application/json'
//             },
//             data : data
//           };
//           let intent = await axios(config)
//           .then(function (response) {
//             return response.data.result.prediction;
//             // return response.data.result.prediction
//           })
//           .catch(function (error) {
//             console.log(error);
//           });
//         return intent  
//     } catch (error) {
//         console.log(error);
//     }
// }
// export async function QnA(input) {
//   try {
//     var data = JSON.stringify({'question':input})
//     var config = {
//       method: 'post',
//       url: `${process.env.LanguageStudioEndpoint}/language/:query-knowledgebases?api-version=2021-10-01&deploymentName=qna-chatbot&projectName=qna-chatbot`,
//       headers: { 
//         'Content-Type': 'application/json', 
//         'Ocp-Apim-Subscription-Key': process.env.LanguageStudioAPIKey
//       },
//       data :data
//     };
//     const res =await axios(config)
//     .then( (response)=> {
//         // JSON.stringify(response.data)
//        return  response.data.answers[0]
//     })
//      return res.answer
//     } catch (error) {
//         console.log(error);
//     }
// }
function CLU(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!process.env.LanguageStudioEndpoint || !process.env.LanguageStudioAPIKey) {
                throw new Error("No se han establecido las variables de entorno necesarias");
            }
            const data = JSON.stringify({
                kind: "Conversation",
                analysisInput: {
                    conversationItem: {
                        id: "1",
                        text: input,
                        participantId: "1"
                    }
                },
                parameters: {
                    projectName: "CLI-bot",
                    verbose: true,
                    deploymentName: "CLU",
                    stringIndexType: "TextElement_V8"
                }
            });
            const config = {
                method: 'post',
                url: `${process.env.LanguageStudioEndpoint}/language/:analyze-conversations?api-version=2022-10-01-preview`,
                headers: {
                    'Ocp-Apim-Subscription-Key': process.env.LanguageStudioAPIKey,
                    'Apim-Request-Id': '4ffcac1c-b2fc-48ba-bd6d-b69d9942995a',
                    'Content-Type': 'application/json'
                },
                data
            };
            const { data: response } = yield axios_1.default(config);
            return response.result.prediction;
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.CLU = CLU;
function QnA(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!process.env.LanguageStudioEndpoint || !process.env.LanguageStudioAPIKey) {
                throw new Error("No se han establecido las variables de entorno necesarias");
            }
            const data = JSON.stringify({ question: input });
            const headers = {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': process.env.LanguageStudioAPIKey
            };
            const url = `${process.env.LanguageStudioEndpoint}/language/:query-knowledgebases?api-version=2021-10-01&deploymentName=qna-chatbot&projectName=qna-chatbot`;
            const response = yield axios_1.default.post(url, data, { headers });
            if (!response.data || !response.data.answers || !response.data.answers[0]) {
                throw new Error("No se obtuvo una respuesta válida");
            }
            return response.data.answers[0].answer;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
exports.QnA = QnA;
//# sourceMappingURL=languageApi.js.map