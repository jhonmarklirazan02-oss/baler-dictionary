const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });
const Word = require('../models/Word');

const wordClassifications = {
  'Adyu': ['verb'],
  'Adyos': ['adverb', 'interjection'],
  'Akkaw': ['interjection'],
  'Alintodong': ['noun'],
  'Anin': ['interjection'],
  'Arapaw': ['verb'],
  'Arupahop': ['adjective'],
  'Atab': ['verb'],
  'Ates': ['interjection'],
  'Ateys': ['interjection'],
  'Babag': ['noun'],
  'Badeyo': ['noun'],
  'Bangi': ['verb'],
  'Barikungkung': ['adjective'],
  'Bes-sog': ['adjective'],
  'Biningkit': ['noun'],
  'Bulastug': ['noun'],
  'Bulagyat': ['adjective'],
  'Bumurayray': ['verb'],
  'Bungelngel': ['adjective'],
  'Bungsuran': ['noun'],
  'Dagasa': ['noun'],
  'Damsak': ['verb'],
  'Dapil': ['adjective'],
  'Dayidi': ['noun'],
  'Dep-pot': ['verb'],
  'Donghe': ['noun'],
  'Doprak': ['verb'],
  'Epuhin': ['noun'],
  'Ereg': ['adjective'],
  'Gangu': ['noun'],
  'Gas-sok': ['adjective'],
  'Gutur-gutor': ['adjective'],
  'Hagobel': ['adjective'],
  'Hidhid': ['adjective'],
  'Hirido': ['adjective'],
  'Imoy': ['adjective'],
  'Intin': ['noun'],
  'Isamual': ['verb'],
  'Isapwal': ['verb'],
  'Isimpan': ['verb'],
  'Kalaghara': ['noun'],
  'Kalapnit': ['noun'],
  'Kapukit': ['noun'],
  'Kengkeng': ['verb'],
  'Kerebsaw': ['verb'],
  'Kere-kerewe': ['adjective'],
  'Kogkog': ['noun'],
  'Kot-teb': ['verb'],
  'Kurupdupdup': ['noun'],
  'Labsak': ['adjective'],
  'Lino': ['verb'],
  'Lisngay': ['verb'],
  'Log-okin': ['adjective'],
  'Lo-u': ['verb'],
  'Lumun': ['adjective'],
  'Lupek': ['adjective'],
  'Luway-luway': ['adverb'],
  'Mabang-i': ['adjective'],
  'Maggama': ['verb'],
  'Maka-otla': ['adjective'],
  'Maker-reg': ['adjective'],
  'Malangeg': ['adjective'],
  'Narogsat': ['verb'],
  'Ne-ut': ['verb'],
  'Ngarotngot': ['noun'],
  'Ngopngop': ['adjective'],
  'Ngoy-ngoy': ['verb'],
  'Ole-kob': ['verb'],
  'Olabsak': ['verb'],
  'Om-mog': ['verb'],
  'Pakloy': ['adjective'],
  'Paleklek': ['verb'],
  'Palongso': ['noun'],
  'Palpok': ['noun'],
  'Pelpel': ['adjective'],
  'Peslet': ['verb'],
  'Piyok': ['verb'],
  'Poypoy': ['noun'],
  'Pululeput': ['adjective'],
  'Purupur': ['noun'],
  'Ramotmot': ['noun'],
  'Ramusak': ['adjective'],
  'Raput-raput': ['adjective'],
  'Rarug': ['noun'],
  'Rasewat': ['noun'],
  'Rebuk': ['verb'],
  'Sagongsong': ['verb'],
  'Sapuretret': ['verb'],
  'Sapyot': ['verb'],
  'Saredsed': ['verb'],
  'Suliling': ['adjective'],
  'Subdit': ['verb'],
  'Tabsong': ['verb'],
  'Tagenggong': ['noun'],
  'Tagiti': ['noun'],
  'Tagupak': ['noun'],
  'Takad': ['verb'],
  'Tekmol': ['verb'],
  'Tangkung': ['noun'],
  'Tapalang': ['noun'],
  'Tarkado': ['adjective'],
  'Teptep': ['verb'],
  'Tipakok': ['verb']
};

const classifyWords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected\n');

    const words = await Word.find();
    let updated = 0;
    let notFound = [];

    for (const word of words) {
      const balerKey = Object.keys(wordClassifications).find(
        key => key.toLowerCase() === word.baler.toLowerCase().replace(/\s+/g, '')
      );

      if (balerKey && wordClassifications[balerKey]) {
        const types = wordClassifications[balerKey];
        await Word.findByIdAndUpdate(word._id, { wordType: types });
        console.log(`${word.baler.padEnd(20)} -> ${types.join(', ')}`);
        updated++;
      } else {
        notFound.push(word.baler);
      }
    }

    console.log(`\nUpdated ${updated} words`);
    if (notFound.length > 0) {
      console.log(`Not found: ${notFound.join(', ')}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

classifyWords();