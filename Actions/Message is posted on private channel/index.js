var action = {
    post: function (response) {
       var result = __Lib.checkError(response);
        if (result.isErrorFound) {
            return __Lib.returnError(result, response);
        }else {
            var responseBody = JSON.parse(response.Body);
            if (responseBody.messages) {
                for (var i = 0; i < responseBody.messages.length; i++) {
                    var message=responseBody.messages[i];
                    if (message.files) {
                            message.files.forEach(function(file) {
                                if (file.url_private_download) {
                                    var name = app.getFilenameFromUrl(file.url_private_download);
                                    responseBody.messages[i].attachment = dehydrateFile(name, JSON.stringify({
                                        url: file.url_private_download,
                                        method: 'GET',
                                        headers: {
                                            'Authorization': 'Bearer ' + response.AuthFields.access_token
                                        }
                                    }));
                                }
                                if (file.plain_text) {
                                    responseBody.messages[i].text = file.plain_text;
                                }
                            });
                            delete responseBody.messages[i].files;

                        }
                    responseBody.messages[i]= app.checkSupportStandardDateFormat(response,responseBody.messages[i]);
					if(responseBody.messages[i].text&&responseBody.messages[i].text=="This content can't be displayed."){
						if(responseBody.messages[i].blocks&&responseBody.messages[i].blocks[0]){
							var message=responseBody.messages[i].blocks[responseBody.messages[i].blocks.length-1].text.text;
							message=message.replace(/&gt;/g, "");
							//message=message.replace(/<.*|/, "");
							//message=message.replace(">", " ");
							responseBody.messages[i].text=message;
						}
					}
					if(responseBody.messages[i].attachments&&responseBody.messages[i].attachments[0]&&responseBody.messages[i].attachments[0].fields&&responseBody.messages[i].attachments[0].fields[0]){
					    responseBody.messages[i].attachments[0].field=responseBody.messages[i].attachments[0].fields[0];
					    delete responseBody.messages[i].attachments[0].fields;
					}
                }
            }
            /*Post: Injected code begins*/
            var keysToProcess = ["blocks",
                "attachments"];
            responseBody['messages'] = __Lib.simplifyArrayKeys(keysToProcess, responseBody['messages']);
            /*Post: Injected code ends*/
            return success(JSON.stringify(responseBody));
        }
    },
    outputFields: function (request, supportsStandardDateFormat) {
        return app.returnOutputFields(request, supportsStandardDateFormat);
    }
};