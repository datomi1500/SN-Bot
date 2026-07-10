import { SlashCommandBuilder, MessageFlags, ChannelType } from 'discord.js';
import { createEmbed, successEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { handleInteractionError } from '../../utils/errorHandler.js';

import birthdaySet from './modules/birthday_set.js';
import birthdayInfo from './modules/birthday_info.js';
import birthdayList from './modules/birthday_list.js';
import birthdayRemove from './modules/birthday_remove.js';
import nextBirthdays from './modules/next_birthdays.js';
import birthdaySetchannel from './modules/birthday_setchannel.js';

import { InteractionHelper } from '../../utils/interactionHelper.js';
export default {
    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('Comandos del sistema de cumpleaños')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Introduce tu fecha de nacimiento')
                .addIntegerOption(option =>
                        option
                            .setName('day')
                            .setDescription('Dia del cumpleaños (1-31)')
                            .setRequired(true)
                            .setMinValue(1)
                            .setMaxValue(31)
                    )
                .addIntegerOption(option =>
                    option
                        .setName('month')
                        .setDescription('Mes del cumpleaños(1-12)')
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(12)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Ver información sobre el cumpleaños')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('El usuario debe comprobar la fecha de nacimiento de')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Mostrar todos los cumpleaños del servidor')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Elimina tu fecha de nacimiento')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('next')
                .setDescription('Mostrar los próximos cumpleaños')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setchannel')
                .setDescription('Activar o desactivar el canal de anuncios de cumpleaños. (Se requiere **Gestionar servidor**)')
                .addChannelOption(option =>
                    option
                        .setName('channel')
                        .setDescription('El canal de texto para anuncios. Déjalo en blanco para desactivarlo.')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(false)
                )
        ),

    async execute(interaction, config, client) {
        try {
            const subcommand = interaction.options.getSubcommand();
            
            switch (subcommand) {
                case 'set':
                    return await birthdaySet.execute(interaction, config, client);
                case 'info':
                    return await birthdayInfo.execute(interaction, config, client);
                case 'list':
                    return await birthdayList.execute(interaction, config, client);
                case 'remove':
                    return await birthdayRemove.execute(interaction, config, client);
                case 'next':
                    return await nextBirthdays.execute(interaction, config, client);
                case 'setchannel':
                    return await birthdaySetchannel.execute(interaction, config, client);
                default:
                    return await replyUserError(interaction, { type: ErrorTypes.UNKNOWN, message: 'Subcomando desconocido' });
            }
        } catch (error) {
            logger.error('Error al ejecutar el comando _Birthday_', {
                error: error.message,
                stack: error.stack,
                userId: interaction.user.id,
                guildId: interaction.guildId,
                commandName: 'birthday',
                subcommand: interaction.options.getSubcommand()
            });
            await handleInteractionError(interaction, error, {
                commandName: 'birthday',
                source: 'birthday_command'
            });
        }
    }
};
