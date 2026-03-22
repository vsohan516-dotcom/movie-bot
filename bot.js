const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const token = "8760472118:AAEIIfFtV4st1wvzzco8zPRAciOuCuW5730";
const bot = new TelegramBot(token, { polling: true });

console.log("🤖 Bot started...");

let movieStore = {};

// START
bot.onText(/\/start/, (msg)=>{
  bot.sendMessage(msg.chat.id,"🎬 Send /movie movie_name\nExample: /movie kgf");
});

// MOVIE SEARCH
bot.onText(/\/movie (.+)/, async (msg, match)=>{
  const chatId = msg.chat.id;
  const movie = match[1];

  bot.sendMessage(chatId,"🔍 Searching...");

  try{
    const res = await axios.get(`http://localhost:3000/search/${encodeURIComponent(movie)}`);
    const movies = res.data.Movies;

    if(!movies || movies.length===0){
      bot.sendMessage(chatId,"❌ Movie not found");
      return;
    }

    movieStore[chatId] = movies;

    const buttons = movies.slice(0,5).map((m,i)=>[{
      text: m.title,
      callback_data: i.toString()
    }]);

    bot.sendMessage(chatId,"🎬 Select Movie",{
      reply_markup:{ inline_keyboard: buttons }
    });

  }catch(e){
    console.log(e.message);
    bot.sendMessage(chatId,"⚠️ Server error");
  }
});

// CLICK HANDLER
bot.on("callback_query", (query)=>{
  const chatId = query.message.chat.id;
  const index = query.data;

  const movie = movieStore[chatId][index];

  if(!movie){
    bot.sendMessage(chatId,"❌ Error loading movie");
    return;
  }

  const title = movie.title;

  // 🔥 Smart Links
  const watchLink = `https://www.google.com/search?q=${encodeURIComponent(title+" watch online")}`;
  const download720 = `https://www.google.com/search?q=${encodeURIComponent(title+" 720p download")}`;
  const download1080 = `https://www.google.com/search?q=${encodeURIComponent(title+" 1080p download")}`;

  bot.sendPhoto(chatId, movie.poster,{
    caption:`🎬 ${title}\n\n⭐ IMDb: ${movie.imdb}`,
    reply_markup:{
      inline_keyboard:[
        [{text:"▶ Watch Online", url: watchLink}],
        [
          {text:"📥 720p", url: download720},
          {text:"📥 1080p", url: download1080}
        ]
      ]
    }
  });
});


