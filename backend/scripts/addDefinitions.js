const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });
const Word = require('../models/Word');

const definitions = {
  'Adyu': 'To climb (a tree)',
  'Adyos': 'Word expressing uncertainty',
  'Akkaw': 'Word expressing surprise, wonder, disgust or objection',
  'Alintodong': 'A piece of cloth for covering the head',
  'Anin': 'Word used to mean that something is easy to do or is small',
  'Arapaw': 'To mount; to straddle; to get on top of',
  'Arupahop': 'Uncouth; dirty',
  'Atab': 'To lie, to make up a story',
  'Ates': 'Word to express disgust',
  'Ateys': 'Word to express disgust',
  'Babag': 'Disturbance; fight',
  'Badeyo': 'Boat fare',
  'Bangi': 'To roast or grill, used only for roots and vegetables',
  'Barikungkung': 'In a fetal position when sleeping',
  'Bes-sog': 'Fat; obese',
  'Biningkit': 'Dried fish',
  'Bulastug': 'Liar',
  'Bulagyat': 'With eyelids turned inside out',
  'Bumurayray': 'To run swiftly',
  'Bungelngel': 'Crying; prone to crying',
  'Bungsuran': 'Entrance; the front part of a house',
  'Dagasa': 'A strong downpour',
  'Damsak': 'To muddy',
  'Dapil': 'Very hungry',
  'Dayidi': 'Heavy rain',
  'Dep-pot': 'To dip one\'s finger in a sauce',
  'Donghe': 'Gatecrasher',
  'Doprak': 'To spit',
  'Epuhin': 'A tube used to blow through to enliven embers in a stove',
  'Ereg': 'Askew',
  'Gangu': 'Hard young coconut',
  'Gas-sok': 'Hungry',
  'Gutur-gutor': 'Uneven',
  'Hagobel': 'Colossal',
  'Hidhid': 'Greedy',
  'Hirido': 'Drunk',
  'Imoy': 'Drunk',
  'Intin': 'Money',
  'Isamual': 'To wait',
  'Isapwal': 'To force something into one\'s mouth',
  'Isimpan': 'To throw something through the window or any opening of a house',
  'Kalaghara': 'To set aside',
  'Kalapnit': 'Phlegm',
  'Kapukit': 'A bat',
  'Kengkeng': 'A small portion',
  'Kerebsaw': 'To hop',
  'Kere-kerewe': 'To shake; to quiver',
  'Kogkog': 'Crooked',
  'Kot-teb': 'Loser',
  'Kurupdupdup': 'To cut a small portion',
  'Labsak': 'Weak light',
  'Lino': 'Watery',
  'Lisngay': 'To wash dishes',
  'Log-okin': 'To slip',
  'Lo-u': 'Sickly',
  'Lumun': 'To eat rice straight from the pot',
  'Lupek': 'Overripe',
  'Luway-luway': 'Crushed; disfigured',
  'Mabang-i': 'Slowly; gingerly',
  'Maggama': 'Stinky',
  'Maka-otla': 'To catch fish with bare hands',
  'Maker-reg': 'Cloying',
  'Malangeg': 'Bitchy; flirty',
  'Narogsat': 'Dirty',
  'Ne-ut': 'To collapse',
  'Ngarotngot': 'To steal',
  'Ngopngop': 'The sound of grinding teeth during sleep',
  'Ngoy-ngoy': 'Toothless',
  'Ole-kob': 'To cry',
  'Olabsak': 'To hide behind an object',
  'Om-mog': 'To sit on the ground with legs spread wide',
  'Pakloy': 'To smoke a cigar with the lit end inside the mouth',
  'Paleklek': 'Weak',
  'Palongso': 'To detour; to take a longer route',
  'Palpok': 'Foul-smelling mud found in around growths of nipa',
  'Pelpel': 'A bonfire of coconut husk to smoke out trees and insects',
  'Peslet': 'Flat',
  'Piyok': 'To crush using hand or feet',
  'Poypoy': 'To reach out and bend a tree branch',
  'Pululeput': 'Gentle wind',
  'Purupur': 'Small, used to describe bananas',
  'Ramotmot': 'Rain with moderate wind',
  'Ramusak': 'Lint',
  'Raput-raput': 'Untidy',
  'Rarug': 'Done hastily',
  'Rasewat': 'Residue',
  'Rebuk': 'A dried piece of tree branch',
  'Sagongsong': 'To muddy the water',
  'Sapuretret': 'To depart abruptly',
  'Sapyot': 'To overflow',
  'Saredsed': 'To throw water or anything liquid',
  'Suliling': 'To walk dragging the feet',
  'Subdit': 'Cross-eyed',
  'Tabsong': 'To spit with force',
  'Tagenggong': 'To dive',
  'Tagiti': 'Earwax',
  'Tagupak': 'Gentle rain',
  'Takad': 'Loud clap',
  'Tekmol': 'To measure the depth of water',
  'Tangkung': 'To swallow whole',
  'Tapalang': 'The shell of a crab or shrimp',
  'Tarkado': 'Clam',
  'Teptep': 'Exhausted',
  'Tipakok': 'To play with water using the hand'
};

const addDefinitions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected\n');

    const words = await Word.find();
    let updated = 0;

    for (const word of words) {
      const balerKey = Object.keys(definitions).find(
        key => key.toLowerCase() === word.baler.toLowerCase().replace(/\s+/g, '')
      );

      if (balerKey && definitions[balerKey]) {
        await Word.findByIdAndUpdate(word._id, { definition: definitions[balerKey] });
        console.log(`${word.baler.padEnd(20)} -> ${definitions[balerKey]}`);
        updated++;
      }
    }

    console.log(`\nAdded definitions to ${updated} words`);
    process.exit(0);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addDefinitions();