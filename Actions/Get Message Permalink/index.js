var action = {
    post: function (response) {
        var result = __Lib.checkError(response);
        if (result.isErrorFound) {
            if(result.fn == "expiredAuth"){
                return __Lib.returnError(result, response);
            }
            return success('{}');
        } else {
            return success(response.Body);
        }
    }
};