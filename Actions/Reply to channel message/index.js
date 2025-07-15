var action = {
    post: function (response) {
        var result = __Lib.checkError(response);
        if (result.message == "The channel is archived") {
            result.fn = "softError";
            result.message="Please enter valid channel ID"
        }
        let rawBody = JSON.parse(response.RawBody);

        if (result.isErrorFound) {
            if (rawBody.channel) {
                let specialChars = /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/;
                if (specialChars.test(rawBody.channel)) {
                    result.fn = "softError";
                    result.message = "Channel id is invalid";
                }
            }

            if (result.message && result.message == "[ERROR] 0 is not a valid thread_ts") {
                result.message = "Thread ts is invalid";
                result.fn = "softError";
            }
            return __Lib.returnError(result, response);
        }
        var responseBody = JSON.parse(response.Body);
        /*Post: Injected code begins*/
        /*Post: Injected code ends*/
        return success(JSON.stringify(responseBody));
    }
};