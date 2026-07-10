import { EmbedBuilder } from 'discord.js';
import { getUserBirthday } from '../../../services/birthdayService.js';
import { logger } from '../../../utils/logger.js';
import { handleInteractionError } from '../../../utils/errorHandler.js';

import { InteractionHelper } from '../../../utils/interactionHelper.js';
export default {
    async execute(interaction, config, client) {
        try {
            await InteractionHelper.safeDefer(interaction);

            const targetUser = interaction.options.getUser("user") || interaction.user;
            const userId = targetUser.id;
            const guildId = interaction.guildId;

            const birthdayData = await getUserBirthday(client, guildId, userId);

            if (!birthdayData) {
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('No se ha encontrado ningún cumpleaños')
                    .setDescription(targetUser.id === interaction.user.id 
                        ? "Aún no has configurado tu fecha de nacimiento. ¡Utiliza `/birthday set` para añadirla!"
                        : `${targetUser.username} Aún no ha fijado su fecha de nacimiento.`);
                return await InteractionHelper.safeEditReply(interaction, {
                    embeds: [embed]
                });
            }
            
            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('Birthday Information')
                .setDescription(`**Fecha:** ${birthdayData.day} ${birthdayData.monthName}\n**Usuario:** ${targetUser.toString()}`);
            
            await InteractionHelper.safeEditReply(interaction, {
                embeds: [embed]
            });
            
            logger.info('La información sobre el cumpleaños se ha recuperado correctamente', {
                userId: interaction.user.id,
                targetUserId: targetUser.id,
                guildId,
                commandName: 'birthday_info'
            });
        } catch (error) {
            logger.error("Error al ejecutar el comando de información de cumpleaños", {
                error: error.message,
                stack: error.stack,
                userId: interaction.user.id,
                guildId: interaction.guildId,
                commandName: 'birthday_info'
            });
            await handleInteractionError(interaction, error, {
                commandName: 'birthday_info',
                source: 'birthday_info_module'
            });
        }
    }
};
