module.exports = {
  config: {
    name: "tag",
    alises:[],
    category: 'tag',
    role:0,
    author: 'dipto',
    description: { en: 'Tags a user to the provided name or message reply.' },
    guide: {
      en: `1. Reply to a message\n2. Use {pm}tag [name]\n3. Use {pm}tag [name] [message] `
    },
  },
  onStart: async ({ api, event, usersData, threadsData, args }) => {
    const { threadID, messageID, messageReply } = event;
    try {
      const d = await threadsData.get(threadID);
      const dd = d.members.map(gud => gud.name);
      const pp = d.members.map(gud => gud.userID);

      const combined = dd.map((name, index) => ({
        Name: name,
        UserId: pp[index]
      }));

      let namesToTag = [];
      let extraMessage = args.join(' ');
      let m = messageReply.messageID;
      if (messageReply) {
        const uid = messageReply.senderID;
        const name = await usersData.getName(uid);
        namesToTag.push({ Name: name, UserId: uid });
      } else {
m = messageID
extraMessage = args.slice(1).join(' ');
        const namesToCheck = args.length > 0 ? [args[0]] : ['dip'];
        namesToTag = combined.filter(member =>
          namesToCheck.some(name => member.Name.toLowerCase().includes(name.toLowerCase()))
        );

        if (namesToTag.length === 0) {
          return api.sendMessage('not found', threadID, messageID);
        }
      }

      const mentions = namesToTag.map(({ Name, UserId }) => ({
        tag: Name,
        id: UserId
      }));
      const body = namesToTag.map(({ Name }) => Name).join(', ');

      const finalBody = extraMessage ? `${body} - ${extraMessage}` : body;
      api.sendMessage({
          body: finalBody,
          mentions
      },
        threadID,m);
    } catch (e) {
      api.sendMessage(e.message, threadID, messageID);
    }
  }
};
