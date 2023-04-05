import axios  from 'axios'
import appInsights = require('applicationinsights');

export async function CLU(input: string): Promise<string | undefined> {
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

    const { data: response } = await axios(config);
    return response.result.prediction;
  } catch (error) {
    console.error(error);
  }
}

export async function QnA(input: string): Promise<string> {
  try {
      const { LanguageStudioEndpoint, LanguageStudioAPIKey } = process.env;

      if (!LanguageStudioEndpoint || !LanguageStudioAPIKey) {
          throw new Error("No se han establecido las variables de entorno necesarias");
      }

      const data = JSON.stringify({ question: input });
      const headers = {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': LanguageStudioAPIKey
      };

      const url = `${LanguageStudioEndpoint}/language/:query-knowledgebases?api-version=2021-10-01&deploymentName=qna-chatbot&projectName=qna-chatbot`;

      const response = await axios.post(url, data, { headers });

      if (!response.data || !response.data.answers || !response.data.answers[0]) {
          throw new Error("No se obtuvo una respuesta válida");
      }

      const { answer, confidenceScore, questions } = response.data.answers[0];

      // Registra un evento personalizado
      appInsights.defaultClient.trackEvent({
          name: 'QNALogs',
          properties: { question: questions[0] }
      });

      // Si la puntuación de confianza es menor o igual a 40, se puede manejar como desee (por ejemplo, mostrar un mensaje diferente o realizar otra acción)
      if (confidenceScore <= 40) {
          // Realiza un seguimiento del evento cuando la puntuación de confianza es menor o igual a 40
          appInsights.defaultClient.trackEvent({
              name: 'NotFound',
              properties: { question: input }
          });
          // ...
      }

      return answer;
  } catch (error) {
      console.error(error);
      throw error;
  }
}