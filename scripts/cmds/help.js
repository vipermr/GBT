const { GoatWrapper } = require("fca-liane-utils");



const fs = require("fs-extra");



const axios = require("axios");



const path = require("path");



const { getPrefix } = global.utils;



const { commands, aliases } = global.GoatBot;



const doNotDelete = "[NAFIJ]"; 




module.exports = {



  config: {



    name: "help",



    version: "1.17",



    author: "PRO",



    usePrefix: false,



    countDown: 5,



    role: 0,



    shortDescription: {



      en: "View command usage and list all commands directly",



    },



    longDescription: {



      en: "View command usage and list all commands directly",



    },



    category: "pro",



    guide: {



      en: "{pn} / help cmdName ",



    },



    priority: 1,



  },




  onStart: async function ({ message, args, event, threadsData, role }) {



    const { threadID } = event;



    const threadData = await threadsData.get(threadID);



    const prefix = getPrefix(threadID);




    if (args.length === 0) {



      const categories = {};



      let msg = "";




      msg += ``; // replace with your name 




      for (const [name, value] of commands) {



        if (value.config.role > 1 && role < value.config.role) continue;




        const category = value.config.category || "Uncategorized";



        categories[category] = categories[category] || { commands: [] };



        categories[category].commands.push(name);



      }




      Object.keys(categories).forEach((category) => {



        if (category !== "info") {



          msg += `\n╭─────❃『 🍼 ${category.toUpperCase()}  』`;




          const names = categories[category].commands.sort();



          for (let i = 0; i < names.length; i += 3) {



            const cmds = names.slice(i, i + 2).map((item) => `🌷${item}`);



            msg += `\n│${cmds.join(" ".repeat(Math.max(1, 5 - cmds.join("").length)))}`;



          }




          msg += `\n╰────────────✦`;



        }



      });




const totalCommands = commands.size;



msg += `\n\n╭───❃[⚡ 𝙴𝙽𝙹𝙾𝚈 ⚡] | [⭐ 𝙽𝙰𝙵𝙸𝙹_𝙿𝚁𝙾_✅ ⭐]


│📊 𝚃𝙾𝚃𝙰𝙻 𝙲𝙼𝙳𝚂: [ ${totalCommands} 🎈]


│ℹ️ 𝚃𝙔𝙿𝙴: [ ${prefix}help <command> ] 𝚃𝙾 𝙻𝙴𝙰𝚁𝙽 𝚄𝚂𝙰𝙶𝙴


╰────────────✦`;



msg += `\n╭───❃


│😺 𝙱𝙾𝚃 𝙱𝚈: 𝙽𝙰𝙵𝙸𝙹_𝙿𝚁𝙾_✅


│📘 𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺: https://www.facebook.com/nafijrahaman2023


╰────────────✦`;



await message.reply({


  body: msg,


});


      



    } else {



      const commandName = args[0].toLowerCase();



      const command = commands.get(commandName) || commands.get(aliases.get(commandName));




      if (!command) {



        await message.reply(`Command "${commandName}" not found.`);



      } else {



        const configCommand = command.config;



        const roleText = roleTextToString(configCommand.role);



        const otherName=(configCommand.aliases);



        const author = configCommand.author || "Unknown";




        const longDescription = (configCommand.longDescription) ? (configCommand.longDescription.en) || "No description" : "No description";




        const guideBody = configCommand.guide?.en || "No guide available.";



        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);




        const response = `╭── ✨𝐍𝐀𝐌𝐄✨ ────⭓



 │ ${configCommand.name}



 ├── 🦥𝐈𝐧𝐟𝐨🦥



 │ 😾 𝙾𝚃𝙷𝙴𝚁 𝙽𝙰𝙼𝙴𝚂: ${otherName}



 │ 😾𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗: ${longDescription}



 │ 😾𝙾𝚃𝙷𝙴𝚁 𝙽𝙰𝙼𝙴𝚂 𝙸𝙽 𝚈𝙾𝚄𝚁 𝙶𝚁𝙾𝚄𝙿: ${configCommand.aliases ? configCommand.aliases.join(", ") : "𝙳𝙾 𝙽𝙾𝚃 𝙷𝙰𝚅𝙴"}



 │ 🗄️𝚅𝚎𝚛𝚜𝚒𝚘𝚗: ${configCommand.version || "1.0"}



 │ 😾𝚁𝚘𝚕𝚎: ${roleText}



 │⚡𝚃𝚒𝚖𝚎 𝚙𝚎𝚛 𝚌𝚘𝚖𝚖𝚊𝚗𝚍: ${configCommand.countDown || 1}s



 │ 😼𝙰𝚞𝚝𝚑𝚘𝚛: ${author}



 ├── ✨𝐔𝐬𝐚𝐠𝐞✨



 │ ${usage}



 ├──✨𝐍𝐨𝐭𝐞𝐬✨



 │ ⚡𝚃𝚑𝚎 𝚌𝚘𝚗𝚝𝚎𝚗𝚝 inside <NAFIJ> 𝚌𝚊𝚗 𝚋𝚎 𝚌𝚑𝚊𝚗𝚐𝚎𝚍



 │ ⚡𝚃𝚑𝚎 𝚌𝚘𝚗𝚝𝚎𝚗𝚝 inside [𝙰|𝙱|𝙲] 𝚒𝚜 𝚊 𝚘𝚛 𝚋 𝚘𝚛 𝚌



 ╰━━━━━━━❖`;




        await message.reply(response);



      }



    }



  },



};




function roleTextToString(roleText) {



  switch (roleText) {



    case 0:



      return ("0 (All users)");



    case 1:



      return ("1 (Group administrators)");



    case 2:



      return ("2 (Admin bot)");



    default:



      return ("Unknown role");



  }



  const wrapper = new GoatWrapper(module.exports);



wrapper.applyNoPrefix({ allowPrefix: true });



                                                   }
