
async function CLU(input) {
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
}


function QnA(input) {
    
}
