import { AutocompleteInteraction, Client, CommandInteraction, GatewayIntentBits, Routes, SlashCommandBuilder } from 'discord.js';
import { REST } from 'discord.js';
import { readdir } from 'fs/promises';
import { registerCommands } from './register-commands';

// structure d'une commande
export interface Command {
    commandName: string;
    // fonction qui renvoie un builder
    autocomplete?: (autocomplete: AutocompleteInteraction) => Promise<unknown>;
    builder: (b: SlashCommandBuilder) => SlashCommandBuilder;
    execute: (interaction: CommandInteraction) => Promise<unknown>;
}

export async function initBot() {
    const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ] });

    const commands: Command[] = [];

    const commandFiles = await readdir(__dirname + "/Commands");

    for (const file of commandFiles) {
        const imp = await import(`${__dirname}/Commands/${file}`);
        commands.push(imp);
    }
    
    await registerCommands(commands);

    client.on('ready', () => {
        console.log("Le bot est connecté à Discord");
    });

    // lorsqu'une commande interragit avec notre bot
    client.on('interactionCreate', async (interaction) => {
        if (interaction.isAutocomplete()) {
            const command = commands.find((c) => c.commandName === interaction.commandName);

            if (!command) {
                return interaction.respond([]);
            }

            if (!command.autocomplete) {
                console.error("Un autocomplete n'a pas été trouvé pour la commande : ", command.commandName);
                return interaction.respond([]);
            }

            await command.autocomplete(interaction);

            return;
        }

        if (interaction.isCommand()) {
            const command = commands.find((c) => c.commandName === interaction.commandName);

            if (command) {
                await command.execute(interaction);
                return;
            }
            
            await interaction.reply("Command Not found :(");
        }
    });

    await client.login(process.env.BOT_TOKEN);
}