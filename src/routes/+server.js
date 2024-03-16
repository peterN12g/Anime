//API call for Anime Information
import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from "$env/static/private";
import { GOOGLE_API_KEY } from "$env/static/private"
import { customsearch_v1 } from 'googleapis';


const genAI = new GoogleGenerativeAI(API_KEY);


export async function GET({url}) {
  const prompt = url.searchParams.get("prompt");
  const genre = url.searchParams.get("genre")
  const text = await run(prompt,genre);
  const titleMatch = text.match(/\*\*(?:\d+\.\d+\/10\s+)?(.*?)(?=\s*\*\*)/);
  const title = titleMatch ? (titleMatch[1].trim() + " poster") : null;
  console.log(title)
   const imgLink = await getImage(title);
   console.log(imgLink)
   const responseInfo = {
    text: text,
    imgLink: imgLink
   };
  return new Response(JSON.stringify(responseInfo));
}


async function run(query,genre) { 
  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro-001" });
  const prompt = "Suggest ONLY one " + genre + " ANIME show with a title and ONLY 3 descriptive short bullet points in a vertical list format WITH the first bullet point the IMDB star rating like " + query;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  console.log(text);
  return text;
}

// API call for Anime Image

async function getImage(title) {
  const search = new customsearch_v1.Customsearch()
  const result = await search.cse.list({
    cx: "f5a3ae6b7bd4f4c69",
    key: GOOGLE_API_KEY,
    q: title,
    searchType: "image",
    imgType: "photo",
    siteSearch: "http://www.kylelambert.com",
    siteSearchFilter: "e",
  });
  let link = (result.data.items[0].link)
  return link;
}


