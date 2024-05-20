const client = require("../../index");

module.exports = {
    name: "/commands",
    run: async (req, res) => {
        delete require.cache[require.resolve("../html/commands.ejs")];

        const commands = [];
        client.commands.forEach(command => {
            commands.push({
                name: command.name,
                description: command.description,
                usage: command.usage,
                details: command.details
            });
        });

        const args = {
            commands: commands
        };

        res.render("./dashboard/html/commands.ejs", args);
    }
};
