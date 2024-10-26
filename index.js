const discordJS = require("discord.js");
const { Logger, Priority, WriteLocation } = require("./logger.js");
//const { createCarCommand } = require("./slashcommandbuilder.js");

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "car",
    description: "Carr :3",
  },
  {
    name: "pfp",
    description: "shows your picture for profile",
  }
];

async function main() {
  require("dotenv").config();
  console.log("Hai node!");
  
  var logr = new Logger("main", WriteLocation.ConAndFile);
  logr.start();
  
  const rest = new discordJS.REST({ version: '10' }).setToken(process.env.TOKEN);
  
  try {
    logr.write("Started refreshing application (/) commands.");

    await rest.put(discordJS.Routes.applicationCommands(process.env.CLIENTID), { body: commands });

    logr.write("Successfully reloaded application (/) commands.");
  } catch (error) {
    logr.write(`rest api part is doing something wrong: ${error}`, Priority.Error);
    logr.write(`\nCall Stack:${error.stack}`)
    return;
  }
  
  const client = new discordJS.Client({ intents: [discordJS.GatewayIntentBits.Guilds] });
  
  client.once('ready', () => {
    logr.write(`Logged in as ${client.user.tag}!`);
  });
  
  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    //console.log(interaction);

    try {
      if (interaction.commandName === "ping") {
        logr.write(`command called "ping" by "${interaction.user.globalName}"`);
        await interaction.reply("Pong!");
      }
      else if(interaction.commandName === "car") {
        logr.write(`command called "car" by "${interaction.user.globalName}"`);
        await interaction.reply(`Haii ${interaction.user.globalName} :3\nhttps://cdn.discordapp.com/attachments/1272629631102488597/1273754123065364642/twitter_1796201385211416782.gif?ex=66c06c38&is=66bf1ab8&hm=2b22e299c813fb4fdb5276882571255a20551b77c970c75dfee6ebe3199bba1a&`);
      }
      else if(interaction.commandName === "pfp") {
        
      }
      else
        logr.write(`slash command is unique and can not be handled: ${interaction.commandName}`,Priority.Warn);
    }
    catch(e) {
      logr.write(`slash command wasn't been handled properly: ${e}`, Priority.Error);
      logr.write(`\nCall Stack:${e.stack}`)
    }
  });

  process.on('SIGINT', function() {
    logr.write("logout with CTRL+C");
    
    process.exit();
  });

  client.login(process.env.TOKEN);
}

main();
