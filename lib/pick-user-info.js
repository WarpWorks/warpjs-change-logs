module.exports = (user) => {
    if (user) {
        return Object.freeze({
            id: user.id,
            type: user.type,
            name: user.Name,
            username: user.UserName
        });
    } else {
        return null;
    }
};
