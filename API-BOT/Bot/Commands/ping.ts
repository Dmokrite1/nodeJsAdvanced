import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const commandName = "ping";

export const builder = (builder: SlashCommandBuilder) => {
    return builder.setDescription('Makes me ping');
}


// execution de la commande
export async function execute(interaction: CommandInteraction) {
    await interaction.reply({
        content: "Pong",
        // message lisible que par vous
        ephemeral: true
    });
}