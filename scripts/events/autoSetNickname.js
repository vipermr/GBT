module.exports = {
	config: {
		name: "autoSetNickname",
		version: "1.0",
		author: "nafijninja + chatgpt",
		category: "events"
	},

	onStart: async ({ api, event }) => {
		const { logMessageType, logMessageData, threadID } = event;

		// Only trigger when the bot is added to a group
		if (
			logMessageType === "log:subscribe" &&
			logMessageData.addedParticipants.some(p => p.userFbId == api.getCurrentUserID())
		) {
			const botName = "😼ANGRY CAT😾";

			try {
				await api.changeNickname(botName, threadID, api.getCurrentUserID());
				console.log(`[autoSetNickname] Nickname set to "${botName}" in thread ${threadID}`);
			} catch (err) {
				console.warn(`[autoSetNickname] Failed to set nickname in thread ${threadID}:`, err);
			}
		}
	}
};
