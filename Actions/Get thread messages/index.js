var action = {
    pre: function (request) {
        var requestBody;
        if (request.Body != "") {
            requestBody = __Lib.removeNullOrEmptyFields(JSON.parse(request.Body));
        } else {
            requestBody = {};
        }
        /*Pre: Injected code begins*/
        /*Pre: Injected code ends*/
        return {
            Body: JSON.stringify(requestBody)
        };
    },
    post: function (response) {
        var result = __Lib.checkError(response);
        if (result.isErrorFound) {
            if (result.message == "The channel is archived") {
                result.message = "Invalid channel ID.";
            } else if (result.message == "thread_not_found") {
                result.message = "Invalid TS ID";
            }
            return __Lib.returnError(result, response);
        }
        var responseBody = JSON.parse(response.Body);
        /*Post: Injected code begins*/
        /*Post: Injected code ends*/
        return success(JSON.stringify(responseBody));
    }
};