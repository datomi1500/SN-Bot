import { EmbedBuilder } from 'discord.js';
import { getUpcomingBirthdays } from '../../../services/birthdayService.js';
import { deleteBirthday } from '../../../utils/database.js';
import { logger } from '../../../utils/logger.js';
import { handleInteractionError } from '../../../utils/errorHandler.js';

import { InteractionHelper } from '../../../utils/interactionHelper.js';
export default {
    async execute(interaction, config, client) {
        try {
            await InteractionHelper.safeDefer(interaction);

            const next5 = await getUpcomingBirthdays(client, interaction.guildId, 5);

            if (next5.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('No se han encontrado cumpleaños')
                    .setDescription('Aún no se ha configurado ningún cumpleaños en este servidor. ¡Utiliza `/birthday set` para añadir cumpleaños!');
                return await InteractionHelper.safeEditReply(interaction, {
                    embeds: [embed]
                });
            }

            let displayIndex = 0;
            for (const birthday of next5) {
                const member = await interaction.guild.members.fetch(birthday.userId).catch(() => null);
                if (!member) {
                    deleteBirthday(client, interaction.guildId, birthday.userId).catch(() => null);
                    continue;
                }
                displayIndex++;

                let timeUntil = '';
                if (birthday.daysUntil === 0) {
                    timeUntil = '🎉 **¡Hoy!**';
                } else if (birthday.daysUntil === 1) {
                    timeUntil = '📅 **¡Mañana!**';
                } else {
                    timeUntil = `En ${birthday.daysUntil} dias${birthday.daysUntil > 1 ? 's' : ''}`;
                }
            }

            if (displayIndex === 0) {
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('No hay cumpleaños próximos')
                    .setDescription('No se han encontrado cumpleaños próximos de los miembros actuales del servidor.');
                return await InteractionHelper.safeEditReply(interaction, {
                    embeds: [embed]
                });
            }

            let birthdayList = `🎂 **Los próximos 5 cumpleaños**\n\nEstos son los próximos 5 cumpleaños en ${interaction.guild.name}:\n\n`;
            displayIndex = 0;
            for (const birthday of next5) {
                const member = await interaction.guild.members.fetch(birthday.userId).catch(() => null);
                if (!member) {
                    continue;
                }
                displayIndex++;

                let timeUntil = '';
                if (birthday.daysUntil === 0) {
                    timeUntil = '🎉 **¡Hoy!**';
                } else if (birthday.daysUntil === 1) {
                    timeUntil = '📅 **¡Mañana!**';
                } else {
                    timeUntil = `En ${birthday.daysUntil} dia${birthday.daysUntil > 1 ? 's' : ''}`;
                }

                birthdayList += `${displayIndex}. **${member.displayName}**\n<@${birthday.userId}>\n📅 **Fecha:** ${birthday.day} ${birthday.monthName}\n⏰ **Hora:** ${timeUntil}\n\n`;
            }

            birthdayList += `¡Utiliza el conjunto /birthday para añadir tu fecha de nacimiento!`;

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('Los próximos 5 cumpleaños')
                .setDescription(birthdayList);

            await InteractionHelper.safeEditReply(interaction, {
                embeds: [embed]
            });
            
            logger.info('Se han recuperado correctamente los próximos cumpleaños', {
                userId: interaction.user.id,
                guildId: interaction.guildId,
                upcomingCount: displayIndex,
                commandName: 'next_birthdays'
            });
        } catch (error) {
            logger.error('No se ha podido ejecutar el comando Next birthdays', {
                error: error.message,
                stack: error.stack,
                userId: interaction.user.id,
                guildId: interaction.guildId,
                commandName: 'next_birthdays'
            });
            await handleInteractionError(interaction, error, {
                commandName: 'next_birthdays',
                source: 'next_birthdays_module'
            });
        }
    }
};
