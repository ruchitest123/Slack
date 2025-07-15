var action = {
    /*pre:function(request)
    {
        var queryParams={};
        queryParams.query="is:saved";
        return {
            QueryParams:queryParams,
            Body:""
        };
    },*/
    post: function (response) {
        var result = __Lib.checkError(response);
        if (result.isErrorFound) {
            return __Lib.returnError(result, response);
        } else {
            var messages = action.processMessages(response);
            return success(JSON.stringify(messages));
        }
    },
    processMessages: function(response) {
        var responseBody = JSON.parse(response.Body);
        var messages = [];
        if (responseBody.messages && responseBody.messages.matches && Array.isArray(responseBody.messages.matches) && responseBody.messages.matches.length > 0) {
            responseBody.messages.matches.forEach(function(item) {
                if (item.text) {
                    if (item.blocks) {
                        delete item.blocks;
                    }
                    if (item.files) {
                        item.files.forEach(function(file) {
                            if (file.url_private_download) {
                                var name = app.getFilenameFromUrl(file.url_private_download);
                                item.attachment = dehydrateFile(name, JSON.stringify({
                                    url: file.url_private_download,
                                    method: 'GET',
                                    headers: {
                                        'Authorization': 'Bearer ' + response.AuthFields.access_token
                                    }
                                }));
                            }
                        });
                        delete item.files;
                    }
                    messages.push(item);
                }
            });
        }
        return messages;
    }
};