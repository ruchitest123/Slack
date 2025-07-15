var app = {
    convertToUTCTimestamp: function (dateString) {
        try {
            var dateObj = new Date(dateString);
            var utcTime = dateObj.getTime();
            var utcTimestamp = Math.floor(utcTime / 1000);
            return utcTimestamp;
        }catch(e) {}
    },
    isChannelExists: function(rawBody) {
        var channelExists = false;
        if (rawBody.startsWith("{")) {
            var rawBodyJson = JSON.parse(rawBody);
            if (rawBodyJson.channel) {
                var executeActionResponse = executeAction("Get Channel", JSON.stringify({
                    channel: rawBodyJson.channel
                }));
                if (executeActionResponse.startsWith("{")) {
                    var executeActionResponseAsJson = JSON.parse(executeActionResponse);
                    if (executeActionResponse.channel) {
                        channelExists = true;
                    }
                }
            }
        }
        return channelExists;
    },
    errorStatusCodeMap: function () {
        return {
            200: "softError",
            401: "expiredAuth",
            429: "rateLimitError",
            500: "retry",
            502: "downTimeError",
            400: "softError",
            403: "expiredAuth",
            404: "softError",
            409: "softError"
        };
    },
    checkErrorMessage: function(responseBodyAsJson, statusCode) {

        var message = "";
        var isError = false;
        var fn = "success";
        var responseBody = JSON.parse(responseBodyAsJson);
        if (responseBody.error) {
            isError = true;
            message = responseBody.error;
            if (responseBody.response_metadata && responseBody.response_metadata.messages && Array.isArray(responseBody.response_metadata.messages)) {
                message = responseBody.response_metadata.messages.join();
            }
        }
        fn = app.errorStatusCodeMap()[statusCode];
        if (responseBody.error && (responseBody.error == "is_archived" || responseBody.error == "channel_not_found")) {
            fn = "stopExecutionError";
            message = "The channel is archived";
        }
        if (message == "token_revoked" || (responseBody.error && (responseBody.error == "not_authed" || responseBody.error == "invalid_auth"))) {
            fn = "expiredAuth";
        }
        if (message && message == "internal_error") {
            fn = "downTimeError";
            messagee = "Failed to get Response from Slack";
        }
        if (message && message == "no_text") {
            message = "Text is not provided! Please provide some text to send message.";
        } //  missing_scope
        if (message && message.includes("missing_scope")) {
            fn = "stopExecutionError";
            message = "Please reauthenticate. Missing required scope:chat:write:bot";
        }
        return {
            isErrorFound: isError,
            message: message,
            fn: fn
        };
    },
    getFilenameFromUrl: function(url) {
        url = url.split('/').pop();
        return url.split("?")[0];
    },
    checkSupportStandardDateFormat: function(response, body) {
        // var responseBody = JSON.parse(response.Body);
        if (response.SupportsStandardDateFormat) {
            if (body.ts) {
                try {
                    body["ts_base"] = new Date(parseInt(body.ts) * 1000).toISOString();
                    body["ts"] = body.ts;
                } catch (e) {}
            }
            if (body.bot_profile && body.bot_profile.updated) {
                try {
                    body.bot_profile.updated_base = new Date(parseInt(body.bot_profile.updated) * 1000).toISOString();
                    body.bot_profile.updated = new Date(parseInt(body.bot_profile.updated) * 1000).toISOString();
                } catch (e) {}
            }

        } else {
            if (body.ts) {
                try {
                    body["ts_base"] = new Date(parseInt(body.ts) * 1000).toISOString();
                } catch (e) {}
            }
            if (body.bot_profile && body.bot_profile.updated) {
                try {
                    body.bot_profile.updated_base = new Date(parseInt(body.bot_profile.updated) * 1000).toISOString();
                } catch (e) {}
            }

        }
        return body;
    },
    returnOutputFields: function(request, supportsStandardDateFormat) {
        var fields = [];
        if (!supportsStandardDateFormat) {
            fields.push({
                name: "ts_base",
                label: "Ts(GMT)",
                type: "String",
                isRequired: false,
                description: "",
                choices: "",
                parentKey: "",
                dynamicDropdownKey: "",
                dynamicSearchKey: ""
            });
            fields.push({
                name: "bot_profile.updated_base",
                label: "Bot Profile Updated(GMT)",
                type: "String",
                isRequired: false,
                description: "",
                choices: "",
                parentKey: "",
                dynamicDropdownKey: "",
                dynamicSearchKey: ""
            });
        }
        return JSON.stringify(fields);
    }

};