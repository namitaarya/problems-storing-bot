const { Client, Intents } = require('discord.js');
const token = process.env.token;
const mongoPass = process.env.mongoPass;
const Mongoose = require('mongoose');


var userIDDiscord;
var userNameDiscord;
let links = [];
let ToDo =[];
// const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
	console.log('Ready!');
});
Mongoose.connect(`mongodb+srv://namita123:${mongoPass}@cluster0.b6ahf.mongodb.net/DiscordBot?retryWrites=true&w=majority`, 
{
  //${mongoPass}
  useNewUrlParser: true,
});



// async function checkEmail(varObj) {
//     console.log('Extracting Data');
//     const obj = await db.collection("DiscordUsers").find({"userID": varObj.idd})
//     var emailInDatabase = obj.userID;
//     console.log(emailInDatabase);
//     if(emailInDatabase===varObj.idd)
//         varObj.bool = 1;
//     else 
//         varObj.bool = 0;

//     console.log(varObj.bool);
//   }

var db = Mongoose.connection;

let prefix = "$";

client.on('messageCreate', message => {

    async function findsmthin(checkthis){
        let obj = await db.collection("DiscordUsers").findOne({"_id": checkthis});
        const obj2 = obj.linksOfSolvedQuestions;
        console.log(obj2);
        console.log(obj2.join('\n'));
        message.channel.send('User name: '+ obj.userName+'\n' + 'The problems solved by you: \n');
        for(let i=0; i<obj2.length;i++)
        message.channel.send( i+1 +'. '+ obj2[i]+ ('\n'));
    }

    async function showToday(checkthisMessage, checkThisUser){
        let obj = await db.collection("DiscordUsers").findOne({"_id": checkThisUser});
        console.log(checkthisMessage);
        message.channel.send('User name: '+ obj.userName+'\n' + 'Todays taks: \n');
        for(let i=0; i<obj.linksToDoToday.length;i++){
            console.log(obj.linksToDoToday[i]);
        if(obj.linksToDoToday[i]===checkthisMessage){
        message.channel.send( i+1 +'. '+ obj.linksToDoToday[i]+  ' ✅');
        }
        else 
        message.channel.send( i+1 +'. '+ obj.linksToDoToday[i]+  ' ❎');
        }
    }

    if(!message.content.startsWith(prefix))
        return;

    if (message.content==='$ping'){
         message.channel.send('pong');
     }

    const args = message.content.slice(prefix.length).trim().split(' ');
    const args2 = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    console.log(command);
    console.log(args[0]);

    if(command === 'help'){
        message.channel.send(
            "To use any command,  use prefix $ \n 1. To get help use: $help \n 2. To register yourself use: $register \n 3. To add a problem link use: $add <problemlink> \n 4. To show all the problems solved use: $showall \n 5. To add problem's to today's list: $dotoday \n 6. To mark an item in today's list as done: $done \n 7. To show today's list: $showtoday \n 8. To clear today's list: $clearday \n 9. To change prefix use: $change <newprefix>"
             
        )
    }

    if(command === 'change'){
        //prefix = args[0];
        let prefixf = args.join(' ');
        prefix = prefixf
        console.log(prefix);
        console.log("Prefix is: "+prefixf);
        message.channel.send(`Changed prefix to : ${prefixf}`);
    }

    if(command==='register'){
                    userNameDiscord= message.author.username;
                    userIDDiscord = message.author.id;

                    // let varObj = {
                    //     bool: -1,
                    //     idd : userIDDiscord
                    // };

                    // checkEmail(varObj);

                    // console.log(varObj.bool);

                    // if(varObj.bool===0){
                    //     message.channel.send("Record already in DB");
                    //     return;
                    // }

                   console.log(userIDDiscord);
                   console.log(userNameDiscord);
        
                  
                var dataOfUser = {
                    userName : userNameDiscord,
                    _id : userIDDiscord,
                    linksOfSolvedQuestions: links,
                    linksToDoToday: ToDo,
                                }

                  db.collection("DiscordUsers").insertOne(dataOfUser, (err, collection) => {
                    if (err) {
                      throw err;
                    }
                    console.log("Record Inserted Successfully");
                  });
        
                  message.channel.send("Record added in database");
    }

        if(command === 'dotoday'){
            db.collection("DiscordUsers").updateOne(
                { "_id": message.author.id },
                { $push: { "linksToDoToday": args[0] } }
             )
             message.channel.send("Added link to today's list");
        }

    

        if(command === 'showtoday'){
            // db.collection("DiscordUsers").updateOne(
            //     { "_id": message.author.id };
            //  )
            console.log(args);
            showToday(args[0], message.author.id);

             message.channel.send("showing list of today's work: ")
        }

        if(command == 'done')
        {
            db.collection("DiscordUsers").updateOne(
                { "_id": message.author.id },
                { $pull: { "linksToDoToday": args[0] } }
             );

            db.collection("DiscordUsers").updateOne(
                { "_id": message.author.id },
                { $push: { "linksOfSolvedQuestions": args[0] } }
             )

             message.channel.send("Removed the entered task");
        }

        if(command==='add'){
                    // links.push(args);
                    //console.log(links);
                    // console.log(args);
                    // var linkkk = [];
                    // ExtractData(message,linkkk);
                    // console.log(linkkk);
                    // linkkk.push(args); 
                    // console.log(linkkk);
                    // db.collection("DiscordUsers").updateOne({"userID" : message.author.id},
                    // {$set: { "linksOfSolvedQuestions" : linkkk}});

                    db.collection("DiscordUsers").updateOne(
                        { "_id": message.author.id },
                        { $push: { "linksOfSolvedQuestions": args[0] } }
                     )
         
                     message.channel.send("Activity added");
        }

        if(command==='showall'){
           findsmthin(message.author.id);}

        if(command === 'clearday'){
            let emptyarr=[];
            console.log("Day clear");
            db.collection("DiscordUsers").updateOne(
                { "_id": message.author.id },
                { $set: { "linksToDoToday": emptyarr } }
             )
             console.log("Day clear 2");
             message.channel.sendTyping("Clearing day!")
             message.channel.send("Day clear");
        }
        
     });

client.login(token);
