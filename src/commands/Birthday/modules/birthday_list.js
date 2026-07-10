import { EmbedBuilder } from 'discord.js';
import { getAllBirthdays } from '../../../services/birthdayService.js';
import { deleteBirthday } from '../../../utils/database.js';
import { logger } from '../../../utils/logger.js';
import { handleInteractionError } from '../../../utils/errorHandler.js';

import { InteractionHelper } from '../../../utils/interactionHelper.js';
export default {
    async execute(interaction, config, client) {
        try {
            await InteractionHelper.safeDefer(interaction);

            const guildId = interaction.guildId;

            const sortedBirthdays = await getAllBirthdays(client, guildId);

            if (sortedBirthdays.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('Sin cumpleaños')
                    .setDescription('Todavía no se ha fijado ninguna fecha de cumpleaños en este servidor.');
                return await InteractionHelper.safeEditReply(interaction, {
                    embeds: [embed]
                });
            }

            const userIds = sortedBirthdays.map(b => b.userId);
            const fetchedMembers = await interaction.guild.members.fetch({ user: userIds }).catch(() => null);

            let birthdayList = '';
            let displayIndex = 0;
            const staleUserIds = [];

            for (const birthday of sortedBirthdays) {
                if (fetchedMembers && !fetchedMembers.has(birthday.userId)) {
                    staleUserIds.push(birthday.userId);
                    continue;
                }
                displayIndex++;
                birthdayList += `${displayIndex}. <@${birthday.userId}> - ${birthday.monthName} ${birthday.day}\n`;
            }

            if (fetchedMembers && staleUserIds.length > 0) {
                for (const userId of staleUserIds) {
                    deleteBirthday(client, guildId, userId).catch(() => null);
                }
            }

            if (displayIndex === 0) {
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('Sin cumpleaños')
                    .setDescription('Los miembros actuales del servidor no han fijado ninguna fecha de cumpleaños..');
                return await InteractionHelper.safeEditReply(interaction, {
                    embeds: [embed]
                });
            }

            birthdayList = `**${displayIndex} birthday${displayIndex !== 1 ? 's' : ''} in ${interaction.guild.name}**\n\n` + birthdayList;

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('Cumpleaños server')
                .setDescription(`${birthdayList}\n\nTotal: ${displayIndex} birthday${displayIndex !== 1 ? 's' : ''}`);

            await InteractionHelper.safeEditReply(interaction, {
                embeds: [embed]
            });
            
            logger.info('La lista de cumpleaños se ha recuperado correctamente', {
                userId: interaction.user.id,
                guildId,
                birthdayCount: displayIndex,
                staleRemoved: staleUserIds.length,
                commandName: 'birthday_list'
            });
        } catch (error) {
            logger.error("Error al ejecutar el comando lista de cumpleaños", {
                error: error.message,
                stack: error.stack,
                userId: interaction.user.id,
                guildId: interaction.guildId,
                commandName: 'birthday_list'
            });
            await handleInteractionError(interaction, error, {
                commandName: 'birthday_list',
                source: 'birthday_list_module'
            });
        }
    }
};
