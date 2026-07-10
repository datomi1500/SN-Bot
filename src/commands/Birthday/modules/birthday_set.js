import { EmbedBuilder } from 'discord.js';
import { setBirthday } from '../../../services/birthdayService.js';
import { logger } from '../../../utils/logger.js';
import { handleInteractionError } from '../../../utils/errorHandler.js';

import { InteractionHelper } from '../../../utils/interactionHelper.js';
export default {
    async execute(interaction, config, client) {
        try {
            await InteractionHelper.safeDefer(interaction);

            const month = interaction.options.getInteger("month");
            const day = interaction.options.getInteger("day");
            const userId = interaction.user.id;
            const guildId = interaction.guildId;

            const result = await setBirthday(client, guildId, userId, month, day);
            
            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('¡Lote de cumpleaños!')
                .setDescription(`¡Tu fecha de nacimiento se ha fijado en **${result.data.day} ${result.data.monthName}**!`);
            
            await InteractionHelper.safeEditReply(interaction, {
                embeds: [embed]
            });
        } catch (error) {
            logger.error("Error al ejecutar el comando Birthday set", {
                error: error.message,
                stack: error.stack,
                userId: interaction.user.id,
                guildId: interaction.guildId,
                commandName: 'birthday_set'
            });
            await handleInteractionError(interaction, error, {
                commandName: 'birthday_set',
                source: 'birthday_set_module'
            });
        }
    }
};
