const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

// 🔥 IMPORTANT: static folder enable
app.use(express.static("public"));

// ================= API KEYS =================
const API_KEYS = ["3e8227fb","c88010c8","a05a97f","5cda3d54"];
let keyIndex = 0;

function getApiKey(){
  const key = API_KEYS[keyIndex];
  keyIndex = (keyIndex+1)%API_KEYS.length;
  return key;
}

// ================= SEARCH FUNCTION =================
async function searchOMDB(name){
  for(let i=0;i<API_KEYS.length;i++){
    const key = getApiKey();
    try{
      const res = await axios.get(`https://www.omdbapi.com/?apikey=${key}&s=${encodeURIComponent(name)}`);
      if(res.data.Response==="True"){
        return res.data.Search.map(m=>({
          title: m.Title,
          poster: m.Poster !== "N/A" ? m.Poster : "https://via.placeholder.com/300x450",
          imdb: `https://www.imdb.com/title/${m.imdbID}`,
          watch: `https://www.google.com/search?q=${encodeURIComponent(m.Title+" watch online")}`
        }));
      }
    }catch(e){}
  }
  return [];
}

// ================= ROUTE =================
app.get("/search/:name", async (req,res)=>{
  const movies = await searchOMDB(req.params.name);
  res.json({Movies: movies});
});

// ================= START =================
app.listen(PORT,()=>console.log("✅ API running on port 3000"));

