const axios = require("axios");
const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent) global.temp.welcomeEvent = {};

module.exports = {
  config: {
    name: "welcome2",
    version: "2.0",
    author: "nafijninja",
    category: "events"
  },

  langs: {
    en: {
      session1: "morning",
      session2: "noon",
      session3: "afternoon",
      session4: "evening",
      multiple1: "you",
      multiple2: "you all",
      defaultWelcomeMessage: "Hello {userName}!\nWelcome {multiple} to {boxName}.\nEnjoy your {session}!"
    }
  },

  onStart: async ({ threadsData, message, event, api, getLang }) => {
    if (event.logMessageType != "log:subscribe")
      return;

    const hours = getTime("HH");
    const { threadID } = event;
    const { nickNameBot } = global.GoatBot.config;
    const prefix = global.utils.getPrefix(threadID);
    const dataAddedParticipants = event.logMessageData.addedParticipants;

/*    // If the bot was added
    if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
      if (nickNameBot)
        api.changeNickname("😾 ANGRY CAT 😼", threadID, api.getCurrentUserID());
      return;
    }
*/
    // React to join message
    api.setMessageReaction("👋", event.messageID, () => {}, true);

    if (!global.temp.welcomeEvent[threadID])
      global.temp.welcomeEvent[threadID] = {
        joinTimeout: null,
        dataAddedParticipants: []
      };

    global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
    clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

    global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
      const threadData = await threadsData.get(threadID);
      if (threadData.settings.sendWelcomeMessage == false)
        return;
      const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
      const dataBanned = threadData.data.banned_ban || [];
      const threadName = threadData.threadName;
      const userName = [], mentions = [];
      let multiple = false;

      if (dataAddedParticipants.length > 1)
        multiple = true;

      for (const user of dataAddedParticipants) {
        if (dataBanned.some((item) => item.id == user.userFbId))
          continue;
        userName.push(user.fullName);
        mentions.push({
          tag: user.fullName,
          id: user.userFbId
        });
      }

      if (userName.length == 0) return;

      let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;
      const form = {
        mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
      };

      welcomeMessage = welcomeMessage
     //   .replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
        .replace(/\{boxName\}|\{threadName\}/g, threadName)
        .replace(
          /\{multiple\}/g,
          multiple ? getLang("multiple2") : getLang("multiple1")
        )
        .replace(
          /\{session\}/g,
          hours <= 10
            ? getLang("session1")
            : hours <= 12
              ? getLang("session2")
              : hours <= 18
                ? getLang("session3")
                : getLang("session4")
        );

      // Add rules from GitHub
      try {
        const res = await axios.get("https://raw.githubusercontent.com/alkama844/GB2/refs/heads/main/rules.txt");
        welcomeMessage += `\n\nRules:\n${res.data}`;
      } catch (err) {
        welcomeMessage += `\n\n[!] Couldn't load rules.`;
      }

      form.body = welcomeMessage;

      // Add funny sticker if available
      try {
        const file = drive.getFile("funny-welcome.png", "stream");
        form.attachment = [file];
      } catch (err) {}

      message.send(form);
      delete global.temp.welcomeEvent[threadID];
    }, 1500);
  }
};
