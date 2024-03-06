import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { Command } from ".";

export async function registerCommands(commands: Command[]) {
    const rest = new REST().setToken(process.env.BOT_TOKEN!);

    // on construit notre tableau de commandes slash
    const slashCommands = commands.map((c) => {
        const builder = new SlashCommandBuilder()
            .setName(c.commandName)
        return c.builder(builder);
    });

    await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID!), {
        body: slashCommands
    });
}
