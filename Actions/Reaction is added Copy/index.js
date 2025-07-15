var action = {
    pre: function (request) {
        var rawBody = JSON.parse(request.RawBody);
        var queryParams = {};
        if (rawBody.user) {
            queryParams.user = rawBody.user;
        }
        return {
            QueryParams: queryParams,
            Body: ""
        };
    },
    post: function (response) {
        var result = __Lib.checkError(response);
        if (result.isErrorFound) {
            return __Lib.returnError(result, response);
        } else {
            var resopnseBody = JSON.parse(response.Body);
            var rawBody = JSON.parse(response.RawBody);
            var reactions = [];
             var isExistsC = false;
             var isExists = false;
            if (resopnseBody.items) {
                resopnseBody.items.forEach(function(item) {
                    if (item.message && item.message.reactions) {
                        item.message.reactions.forEach(function(reaction) {
                            var obj = item;
                            if (rawBody.Reaction && rawBody.Channel) {
                                var matchCondition = false;
                                if (rawBody.Reaction && rawBody.Reaction == reaction.name) {
                                    if (rawBody.Channel && rawBody.Channel == item.channel) {
                                        matchCondition = true;
                                    }/*else if (!rawBody.Channel) {
                                        matchCondition = true;
                                    }
                                } else {
                                    if (rawBody.Channel && rawBody.Channel == item.channel) {
                                      console.log( item.channel);
                                        matchCondition = true;
                                    }*/
                                }
                                if (matchCondition) {
                                    obj.reaction_name = reaction.name;
                                    obj.reaction_users = reaction.users.join();
                                    obj.reaction_count = reaction.count;
                                    if (!item.message.client_msg_id) {
                                        item.message.client_msg_id = sha256(item.message.text);
                                    }
                                    obj.reactionid = obj.reaction_name+"-"+item.message.client_msg_id;
                                    isExistsC = false;
                                    reactions.forEach(function(r) {
                                        if (r.reactionid && r.reactionid == obj.reactionid) {
                                            isExistsC = true;
                                        }
                                    });
                                    if (!isExistsC) {
                                        reactions.push(obj);
                                    }
                                }
                            } else if (rawBody.Reaction|| rawBody.Channel) 
                            {
                               if (rawBody.Reaction && rawBody.Reaction == reaction.name)
                               {
                                obj.reaction_name = reaction.name;
                                obj.reaction_users = reaction.users.join();
                                obj.reaction_count = reaction.count;
                                if (!item.message.client_msg_id) {
                                    item.message.client_msg_id = sha256(item.message.text);
                                }
                                obj.reactionid = obj.reaction_name+"-"+item.message.client_msg_id;
                                 isExists = false;
                                reactions.forEach(function(r) {
                                    if (r.reactionid && r.reactionid == obj.reactionid) {
                                        isExists = true;
                                    }
                                });if (!isExists) {
                                    reactions.push(obj);
                                }}
                              if (rawBody.Channel && rawBody.Channel == item.channel) { {
                                obj.reaction_name = reaction.name;
                                obj.reaction_users = reaction.users.join();
                                obj.reaction_count = reaction.count;
                                if (!item.message.client_msg_id) {
                                    item.message.client_msg_id = sha256(item.message.text);
                                }
                                obj.reactionid = obj.reaction_name+"-"+item.message.client_msg_id;
                                var isExists = false;
                                reactions.forEach(function(r) {
                                    if (r.reactionid && r.reactionid == obj.reactionid) {
                                        isExists = true;
                                    }
                                });
                                if (!isExists) {
                                    reactions.push(obj);
                                }}
                            }}
                           
                            else if (!rawBody.Reaction&&!rawBody.Channel) {
                                obj.reaction_name = reaction.name;
                                obj.reaction_users = reaction.users.join();
                                obj.reaction_count = reaction.count;
                                if (!item.message.client_msg_id) {
                                    item.message.client_msg_id = sha256(item.message.text);
                                }
                                obj.reactionid = obj.reaction_name+"-"+item.message.client_msg_id;
                                isExists = false;
                                reactions.forEach(function(r) {
                                    if (r.reactionid && r.reactionid == obj.reactionid) {
                                        isExists = true;
                                    }
                                });
                                if (!isExists) {
                                    reactions.push(obj);
                                }
                            }
                        });
                    }
                });
            }
            return success(JSON.stringify(reactions));
        }
    }
};