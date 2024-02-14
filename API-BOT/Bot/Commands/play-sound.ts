import { NoSubscriberBehavior, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { createReadStream } from "fs";
import { join } from "path";
import { setTimeout } from "timers/promises";
import { DatabaseConnection } from "../../Core/Database/connection";
import { getSoundBy, searchSound } from "../../Core/Database/sounds";

export const commandName = "play";

export const builder = (builder: SlashCommandBuilder) => {
    return builder.setDescription('Joue un son')
        .addStringOption((o) => {
            return o
                .setName('sound')
                .setDescription('Le nom du son')
                .setRequired(true)
                .setAutocomplete(true)
        })
        .addNumberOption((o) => {
            return o
                .setName('volume')
                .setDescription('Le volume')
                .setRequired(false)
        })
}

export async function autocomplete(interaction: AutocompleteInteraction) {
    const autocompleteString = interaction.options.getFocused(true);

    console.log(autocompleteString);
    

    if (autocompleteString.name === "sound") {
        const sounds = await searchSound(autocompleteString.value);

        return interaction.respond(
            sounds.map((s) => ({
                name: s.name,
                value: s.file 
            }))
        )
    }
}

// execution de la commande
export async function execute(interaction: CommandInteraction) {
    const channel = (interaction.member as GuildMember).voice;
    const channelId = channel.channelId;
    const guildId = interaction.guildId;

    // on récupère l'argument
    const soundName = interaction.options.get('sound')?.value as string;
    const volume = interaction.options.get('volume')?.value as number ?? 0.5;

    console.log(volume);
    

    if (!channelId || !guildId) {
        return interaction.reply("Veuillez-vous connecter dans un channel pour cette commande");
    }

    // const sound = await getSoundBy('name', soundName);


    // if (!sound) {
    //     return interaction.reply("Le son n'a pas été trouvé");
    // }

    const voice = joinVoiceChannel({
        channelId,
        guildId,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false
    });

    const audioPlayer = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });

    audioPlayer.on('error', error => {
        console.error(`Error: ${error.message} with resource ${error.resource.metadata}`);
    });

    // ressource audio à jouer
    const audioResource = createAudioResource(
        createReadStream(
            join(process.cwd(), 'uploads' , soundName)
        )
    );

    audioResource.playStream.on("error", (e) => {
        console.log("Une erreur est survenue", e);
    });

    // on set le volume à 50%
    audioResource.volume?.setVolume(volume);

    // dit au son d'être joué
    audioPlayer.play(
        audioResource
    );

    // on dit à la voix du bot d'écouter les sons à jouer de l'audioPlayer
    voice.subscribe(audioPlayer);
    
    await interaction.reply({
        content: ':middle_finger:',
        ephemeral: true
    });
    await setTimeout(1000);
    await interaction.deleteReply();
}