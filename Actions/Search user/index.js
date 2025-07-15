var action = {
    post: function (response) {
        var users = [];
        try {
            var members = JSON.parse(response.Body);
            var rawBody = JSON.parse(response.RawBody);

            if (rawBody.name && members.members) {
                members.members.forEach(function(member) {
                    var name = rawBody.name.toLowerCase();
                    var memberName = member.name.toLowerCase();
                    if (name == memberName) {
                        users.push(member);
                    } else {
                        var real_name = member.real_name.toLowerCase();
                        if (real_name.includes(name)) {
                            users.push(member);
                        }
                    }
                });
            }
        }catch(e) {}
        return success(JSON.stringify(users));
    }
};