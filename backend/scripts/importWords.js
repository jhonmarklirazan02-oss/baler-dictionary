const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Word = require('../models/Word');

//dictionary data
const balerWords = [
  { tagalog: "Umakyat", baler: "Adyu", english: "To climb / Went up", audio: "" },
  { tagalog: "Bakit", baler: "Adyos", english: "Why", audio: "" },
  { tagalog: "Nagulat / Nabigla", baler: "Akkaw", english: "Surprised / Shocked", audio: "" },
  { tagalog: "Sumbrelo", baler: "Alintodong", english: "Hat", audio: "" },
  { tagalog: "Madaling gawin", baler: "Anin", english: "Easy to do", audio: "" },
  { tagalog: "Tuktok", baler: "Arapaw", english: "Peak / Top", audio: "" },
  { tagalog: "Marumi", baler: "Arupahop", english: "Dirty", audio: "" },
  { tagalog: "Sinundot ng patpat", baler: "Atab", english: "Poked / Touched with a stick", audio: "" },
  { tagalog: "Pagkasuklam", baler: "Ates / Ateys", english: "Disgust", audio: "" },
  { tagalog: "Suntukan", baler: "Babag", english: "Fistfight", audio: "" },
  { tagalog: "Pamasahe sa bangka", baler: "Badeyo", english: "Boat fare", audio: "" },
  { tagalog: "Inihaw", baler: "Bangi", english: "Grilled", audio: "" },
  { tagalog: "Tagilid matulog", baler: "Barikungkung", english: "Sleeping sideways", audio: "" },
  { tagalog: "Mataba", baler: "Bes-sog", english: "Fat", audio: "" },
  { tagalog: "Pinatuyong isda", baler: "Biningkit", english: "Dried fish", audio: "" },
  { tagalog: "Sinungaling", baler: "Bulastug", english: "Liar", audio: "" },
  { tagalog: "Binaliktad", baler: "Bulagyat", english: "Turned upside down / Reversed", audio: "" },
  { tagalog: "Tumakbo", baler: "Bumurayray", english: "Ran", audio: "" },
  { tagalog: "Umiiyak", baler: "Bungelngel", english: "Crying", audio: "" },
  { tagalog: "Pagpasok", baler: "Bungsuran", english: "Entrance", audio: "" },
  { tagalog: "Malakas na ulan", baler: "Dagasa", english: "Heavy rain", audio: "" },
  { tagalog: "Maputik", baler: "Damsak", english: "Muddy", audio: "" },
  { tagalog: "Gutom na gutom", baler: "Dapil", english: "Very hungry / Starving", audio: "" },
  { tagalog: "Malakas na ulan", baler: "Dayidi", english: "Heavy rain", audio: "" },
  { tagalog: "Sawsaw", baler: "Dep-pot", english: "Dip", audio: "" },
  { tagalog: "Gatecrasher", baler: "Donghe", english: "Uninvited guest", audio: "" },
  { tagalog: "Dumura", baler: "Doprak", english: "Spit", audio: "" },
  { tagalog: "Ihipan", baler: "Epuhin", english: "To blow", audio: "" },
  { tagalog: "Tabingi / Kiling", baler: "Ereg", english: "Slanted / Crooked", audio: "" },
  { tagalog: "Matigas na niyog", baler: "Gangu", english: "Hard coconut", audio: "" },
  { tagalog: "Gutom", baler: "Gas-sok", english: "Hungry", audio: "" },
  { tagalog: "Gasgas", baler: "Gutur-gutor", english: "Scratch / Abrasion", audio: "" },
  { tagalog: "Hindi pantay", baler: "Hagobel", english: "Uneven", audio: "" },
  { tagalog: "Napakalaki", baler: "Hidhid", english: "Very big / Huge", audio: "" },
  { tagalog: "Matakaw", baler: "Hirido", english: "Gluttonous / Greedy eater", audio: "" },
  { tagalog: "Lasing", baler: "Imoy", english: "Drunk", audio: "" },
  { tagalog: "Pera", baler: "Intin", english: "Money", audio: "" },
  { tagalog: "Maghintay", baler: "Isamual", english: "Wait", audio: "" },
  { tagalog: "Pilitin", baler: "Isapwal", english: "Force / Insist", audio: "" },
  { tagalog: "Ihagis / Itapon", baler: "Isimpan", english: "Throw", audio: "" },
  { tagalog: "Isantabi", baler: "Kalaghara", english: "Set aside", audio: "" },
  { tagalog: "Plema", baler: "Kalapnit", english: "Phlegm", audio: "" },
  { tagalog: "Paniki", baler: "Kapukit", english: "Bat", audio: "" },
  { tagalog: "Maliit", baler: "Kengkeng", english: "Small", audio: "" },
  { tagalog: "Tumalon", baler: "Kerebsaw", english: "Jump", audio: "" },
  { tagalog: "Lumukso", baler: "Kere-kerewe", english: "Leap / Hop", audio: "" },
  { tagalog: "Baluktot", baler: "Kogkog", english: "Bent / Twisted", audio: "" },
  { tagalog: "Talo", baler: "Kot-teb", english: "Lost / Defeated", audio: "" },
  { tagalog: "Putulin", baler: "Kurupdupdup", english: "Cut", audio: "" },
  { tagalog: "Malambot", baler: "Labsak", english: "Soft", audio: "" },
  { tagalog: "Maghugas ng pinggan", baler: "Lino", english: "Wash dishes", audio: "" },
  { tagalog: "Madulas", baler: "Lisngay", english: "Slippery", audio: "" },
  { tagalog: "May sakit", baler: "Log-okin", english: "Sick", audio: "" },
  { tagalog: "Kumain ng kanin sa palayok", baler: "Lo-u", english: "To eat rice straight from the pot", audio: "" },
  { tagalog: "Hinog", baler: "Lumun", english: "Ripe", audio: "" },
  { tagalog: "Durog / Yupi", baler: "Lupek", english: "Crushed / Flattened", audio: "" },
  { tagalog: "Dahan-dahan", baler: "Luway-luway", english: "Slowly", audio: "" },
  { tagalog: "Mabaho", baler: "Mabang-i", english: "Smelly / Stinky", audio: "" },
  { tagalog: "Mangapa", baler: "Maggama", english: "To grope", audio: "" },
  { tagalog: "Nagungulila", baler: "Maka-otla", english: "Lonely / Grieving", audio: "" },
  { tagalog: "Malandi", baler: "Maker-reg", english: "Flirtatious", audio: "" },
  { tagalog: "Marumi", baler: "Malangeg", english: "Dirty", audio: "" },
  { tagalog: "Gumoho", baler: "Narogsat", english: "Collapse", audio: "" },
  { tagalog: "Magnakaw", baler: "Ne-ut", english: "Steal", audio: "" },
  { tagalog: "Lagitngit", baler: "Ngarotngot", english: "Creaking sound", audio: "" },
  { tagalog: "Walang ngipin", baler: "Ngopngop", english: "Toothless", audio: "" },
  { tagalog: "Umiyak", baler: "Ngoy-ngoy", english: "Cried", audio: "" },
  { tagalog: "Nagtago", baler: "Ole-kob", english: "Hid", audio: "" },
  { tagalog: "Nakabukaka", baler: "Olabsak", english: "Sitting legs spread", audio: "" },
  { tagalog: "Naninigarilyo sa loob ng bibig", baler: "Om-mog", english: "Smoking with cigarette in the mouth", audio: "" },
  { tagalog: "Mahina", baler: "Pakloy", english: "Weak", audio: "" },
  { tagalog: "Lumihis", baler: "Paleklek", english: "Divert / Detour", audio: "" },
  { tagalog: "Mabuhay", baler: "Palongso", english: "Live / Long live", audio: "" },
  { tagalog: "Nagpausok", baler: "Palpok", english: "Made smoke", audio: "" },
  { tagalog: "Patag", baler: "Pelpel", english: "Flat", audio: "" },
  { tagalog: "Dinipgi (pinitas)", baler: "Peslet", english: "Plucked (Fruit/Vegetable)", audio: "" },
  { tagalog: "Binaluktot", baler: "Piyok", english: "Bent", audio: "" },
  { tagalog: "Dahan-dahang hangin", baler: "Poypoy", english: "Gentle breeze", audio: "" },
  { tagalog: "Paglarawan", baler: "Pululeput", english: "Description / Depiction", audio: "" },
  { tagalog: "Ambon", baler: "Purupur", english: "Drizzle", audio: "" },
  { tagalog: "Hibla", baler: "Ramotmot", english: "Fiber / Strand", audio: "" },
  { tagalog: "Hindi maayos", baler: "Ramusak", english: "Messy / Disorderly", audio: "" },
  { tagalog: "Minadali", baler: "Raput-raput", english: "Rushed", audio: "" },
  { tagalog: "Nalalabi", baler: "Rarug", english: "Leftover / Remaining", audio: "" },
  { tagalog: "Tuyong sanga", baler: "Rasewat", english: "Dry branch", audio: "" },
  { tagalog: "Maduming tubig", baler: "Rebuk", english: "Dirty water", audio: "" },
  { tagalog: "Um (expression)", baler: "Sagongsong", english: "Filler", audio: "" },
  { tagalog: "Umapaw", baler: "Sapuretret", english: "Overflow", audio: "" },
  { tagalog: "Tumapon", baler: "Sapyot", english: "Spill", audio: "" },
  { tagalog: "Maingay maglakad", baler: "Saredsed", english: "Walks noisily", audio: "" },
  { tagalog: "Duling", baler: "Suliling", english: "Cross-eyed", audio: "" },
  { tagalog: "Dumura ng malakas", baler: "Subdit", english: "Spit forcefully", audio: "" },
  { tagalog: "Sumisid / Lumubog", baler: "Tabsong", english: "Dived / Sank", audio: "" },
  { tagalog: "Tutuli", baler: "Tagenggong", english: "Earwax", audio: "" },
  { tagalog: "Mahinang ulan", baler: "Tagiti", english: "Light rain", audio: "" },
  { tagalog: "Palakpak", baler: "Tagupak", english: "Clap", audio: "" },
  { tagalog: "Sinukat", baler: "Takad", english: "Measured", audio: "" },
  { tagalog: "Lumunok ng buo", baler: "Tekmol", english: "Swallow whole", audio: "" },
  { tagalog: "Balat ng alimango", baler: "Tangkung", english: "Crab shell", audio: "" },
  { tagalog: "Kabibe", baler: "Tapalang", english: "Seashell", audio: "" },
  { tagalog: "Pagod", baler: "Tarkado", english: "Tired", audio: "" },
  { tagalog: "Tampisaw", baler: "Teptep", english: "Play in the water / Wade", audio: "" },
  { tagalog: "Hulaan", baler: "Tipakok", english: "Guess", audio: "" }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    await Word.deleteMany({});
    console.log('🗑️  Cleared existing words');

    const result = await Word.insertMany(balerWords);
    console.log(`✅ Successfully imported ${result.length} words`);

    console.log('\n📚 Sample imported words:');
    result.slice(0, 5).forEach(word => {
      console.log(`   ${word.baler} - ${word.tagalog} - ${word.english}`);
    });

    console.log('\n🎉 Import completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
};
importData();