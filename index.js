const discord = require("discord.js");
const client = new discord.Client();
const ytdl = require('ytdl-core');

const token = "token";
const prefix = "rkts:";
const quiz = require("./test.json");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
  console.log("--------------------------------")
  console.log("りくりくりーくねっ！")
  client.user.setActivity("りくりくりーくねっ！ | rkts:help")
});

client.on("message", message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return
  const [command, ...args] = message.content.slice(prefix.length).split(' ')

  switch (command) {
    case "tsts":
    message.channel.send("りくりくりーくねっ！");
    break;

    case "hello":
    message.channel.send("はろー！＾＾");
    break;

    case "prng":
    message.channel.send("りくりくりーく！Prngを実行しました。");
    break;

    case "test":
    const random = quiz[Math.floor(Math.random() * quiz.length)];

    const question = new discord.MessageEmbed()
      .setTitle("もんだい！")
      .setDescription(random)
      .setColor("#36b8fa")

    message.channel.send(question);
    break;

    case "help":

    const help = new discord.MessageEmbed()
      .setTitle("ヘルプ")
      .setDescription("はろー！\nこのBotは <@635002934907895826> が作った" + client.user.username + "です！\nすべてのコマンドプレフィックスは `rkts:` です。")
      .addField("test", "りくりくテストの出題予想問題を出します。", true)
      .addField("play", "`play [YouTube動画のURL]` で音楽再生できます。", true)
      .addField("join", "ボイチャに呼び出します。", true)
      .addField("leave", "ボイチャから追い出します。", true)
      .addField("hello", "はろー！", true)
      .addField("tsts", "テステス", true)
      .addField("prng", "pingじゃないよ＾＾")
      .setColor("#36b8fa")
      .setThumbnail(client.user.avatarURL())

    message.channel.send(help);
    break;

    case "eval":
    case "play":
    case "join":
    case "leave":
    console.log(message.content);
    break;

    default:
    message.channel.send("陸ちゃん「コマンド見つからないから裁BANね？」")
    break;
  }
});

//あっちに入れるのめんｄ（は）
client.on('message', async message => {
  if (message.author.bot) return;

  if (message.content.startsWith('rkts:play') && message.guild) {

    const url = message.content.split(' ')[1]

    if (!ytdl.validateURL(url)) return message.reply('陸ちゃん「動画見つからないから訴訟ね？＾＾」')

    const channel = message.member.voice.channel

    if (!channel) return message.reply('陸ちゃん「ボイチャいないから訴訟ね？＾＾」')

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply("接続権限がないです！訴訟！");
    if (!permissions.has("SPEAK"))
      return message.reply("発言権限がないです！訴訟！");

    const connection = await channel.join()
    const stream = ytdl(ytdl.getURLVideoID(url), { filter: 'audioonly' })

    const playe = new discord.MessageEmbed()
      .setTitle("再生")
      .setDescription("**" + url + "**\nを再生します！")
      .setColor("#36b8fa")

    const dispatcher = connection.play(stream).then(message.channel.send(playe))

    dispatcher.once('finish', () => {
      channel.leave()
      message.channel.send("ばいばーい！")
    })
  }

  if (message.content === "rkts:join" && message.guild) {
    message.member.voice.channel.join()
    message.channel.send("はろー！＾＾")
  }

  if (message.content === "rkts:leave" && message.guild) {
    message.member.voice.channel.leave()
    message.channel.send("ばいばーい！\n|彡ｻｯ")
  }

});

const f = msg => {
  if (msg.author.bot) return;
  const str = msg.content.replace(/[-ぉぁぃー!?・！・ｫｧｨ？.,\s]/g, '');
  if (/^(?:こ|コ|ｺ)(?:か|カ|ｶ)(?:い|イ|ｲ)(?:ん|ン|ﾝ)$/.test(str))
    return true;

  return false;
};

// メッセージが来た時に呼ばれる関数を登録
client.on('message', msg => {
  if (f(msg)) {
    const embed = new discord.MessageEmbed()
    .setTitle("なんか見えたぞ＾＾")
    .setDescription("危なそうな語句を検知しました。")
    .setThumbnail(msg.author.displayAvatarURL({dynamic:true}))
    .addField("メッセージ内容", msg.content)
    .addField("送信者", `${msg.author.tag}(${msg.author.id})`)
    .addField("メッセージURL", msg.url)
    .setColor("ORANGE")
    .setFooter("りくりくりーくねっ！")
    .setTimestamp()
  msg.channel.send(msg.author, embed)
  }
});

function clean(text) {
	if (typeof text === 'string')
		return text
			.replace(/`/g, '`' + String.fromCharCode(8203))
			.replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
}

client.on('message', message => {
	const args = message.content.split(' ').slice(1);

	if (message.content.startsWith(prefix + 'eval')) {
		if (message.author.id === '635002934907895826')
			try {
				const code = args.join(' ');
				let evaled = eval(code);

				if (typeof evaled !== 'string')
					evaled = require('util').inspect(evaled);

				message.channel.send(clean(evaled), { code: 'xl' });
			} catch (err) {
				message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
			}
	}
});

client.login(token);