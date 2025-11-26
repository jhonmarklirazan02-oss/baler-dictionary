const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });
const Word = require('../models/Word');

const grammarData = {
  'Adyu': {
    verbForms: { present: 'aadyu', past: 'umadyu' }
  },
  'Arapaw': {
    verbForms: { present: 'aarapaw', past: 'umarapaw' }
  },
  'Atab': {
    verbForms: { present: 'aatab', past: 'umatab' }
  },
  'Bangi': {
    verbForms: { present: 'babangi', past: 'bumangi' }
  },
  'Bumurayray': {
    verbForms: { present: 'magburayray', past: 'nagburayray' }
  },
  'Bungsuran': {
    verbForms: { present: 'bumungsuran', past: 'nagbungsuran' }
  },
  'Damsak': {
    verbForms: { present: 'magdadamsak', past: 'nagdamsak' }
  },
  'Dep-pot': {
    verbForms: { present: 'dedep-pot', past: 'dumep-pot' }
  },
  'Doprak': {
    verbForms: { present: 'magdoprak', past: 'dumoprak' }
  },
  'Intin': {
    verbForms: { present: 'iinten', past: 'umintin' }
  },
  'Isamual': {
    verbForms: { present: 'iisamual', past: 'inisamual' }
  },
  'Isapwal': {
    verbForms: { present: 'iisapwal', past: 'umisapwal' }
  },
  'Isimpan': {
    verbForms: { present: 'iisimpan', past: 'umisimpan' }
  },
  'Keng-keng': {
    verbForms: { present: 'mag keng-keng', past: 'nagkeng-keng' }
  },
  'Kerebsaw': {
    verbForms: { present: 'kekerebsaw', past: 'kumerebsaw' }
  },
  'Kot-teb': {
    verbForms: { present: 'kokot-teb', past: 'kumokot-teb' }
  },
  'Lino': {
    verbForms: { present: 'lilino', past: 'lumino' }
  },
  'Lisgay': {
    verbForms: { present: 'lilisgay', past: 'lumisgay' }
  },
  'Lo-u': {
    verbForms: { present: 'lolo-u', past: 'umolo-u' }
  },
  'Maggama': {
    verbForms: { present: 'manggagama', past: 'nanggama' }
  },
  'Narogsat': {
    verbForms: { present: 'nanarogsat', past: 'umorogsat' }
  },
  'Ne-ut': {
    verbForms: { present: 'nene-ut', past: 'nume-ut' }
  },
  'Ngoy-ngoy': {
    verbForms: { present: 'ngiongoy-ngoy', past: 'nagngoy-ngoy' }
  },
  'Ok-kob': {
    verbForms: { present: 'ook-kob', past: 'umok-kob' }
  },
  'Olabsak': {
    verbForms: { present: 'olabsak', past: 'umolabsak' }
  },
  'Om-mog': {
    verbForms: { present: 'oom-mog', past: 'umo-mog' }
  },
  'Paleklek': {
    verbForms: { present: 'papaleklek', past: 'pumaleklek' }
  },
  'Peslet': {
    verbForms: { present: 'pepeslet', past: 'pumeslet' }
  },
  'Peyok': {
    verbForms: { present: 'pepeyok', past: 'pumeyok' }
  },
  'Rebuk': {
    verbForms: { present: 'rerebuk', past: 'rumebuk' }
  },
  'Sagongsong': {
    verbForms: { present: 'sasagongsong', past: 'sumagongaong' }
  },
  'Sapuretret': {
    verbForms: { present: 'sasapuretret', past: 'sumapuretret' }
  },
  'Sapyot': {
    verbForms: { present: 'sasapyot', past: 'sumapyot' }
  },
  'Saredsed': {
    verbForms: { present: 'sasaredsed', past: 'sumaredsed' }
  },
  'Subdit': {
    verbForms: { present: 'susubdit', past: 'nagsubdit' }
  },
  'Tabsung': {
    verbForms: { present: 'tatabsung', past: 'tumabsung' }
  },
  'Takad': {
    verbForms: { present: 'tatakad', past: 'tumakad' }
  },
  'Takmul': {
    verbForms: { present: 'tatakmul', past: 'tinakmul' }
  },
  'Teptep': {
    verbForms: { present: 'teteptep', past: 'tumeptep' }
  },
  'Tipakok': {
    verbForms: { present: 'titipakok', past: 'tumipakok' }
  },

  // ADJECTIVES - Descriptive, Demonstrative, Quantitative in Baler
  'Arupahup': {
    adjectiveForms: {
      descriptive: 'arupahup',
      demonstrative: 'ya arupahup',
      quantitative: 'tadu ya arupahup'
    }
  },
  'Barikungkung': {
    adjectiveForms: {
      descriptive: 'barikungkung',
      demonstrative: 'ya barikungkung',
      quantitative: 'tadu ya barikungkung'
    }
  },
  'Bes-sog': {
    adjectiveForms: {
      descriptive: 'bes-sog',
      demonstrative: 'ya bes-sog',
      quantitative: 'tadu ya bes-sog'
    }
  },
  'Bulagyat': {
    adjectiveForms: {
      descriptive: 'bulagyat',
      demonstrative: 'ya bulagyat',
      quantitative: 'tadu ya bulagyat'
    }
  },
  'Bungelngel': {
    adjectiveForms: {
      descriptive: 'bungelngel',
      demonstrative: 'ya bungelngel',
      quantitative: 'tadu ya bungelngel'
    }
  },
  'Dapil': {
    adjectiveForms: {
      descriptive: 'dapil',
      demonstrative: 'ya dapil',
      quantitative: 'tadu ya dapil'
    }
  },
  'Ereg': {
    adjectiveForms: {
      descriptive: 'ereg',
      demonstrative: 'ya ereg',
      quantitative: 'tadu ya ereg'
    }
  },
  'Gas-sok': {
    adjectiveForms: {
      descriptive: 'gas-sok',
      demonstrative: 'ya gas-sok',
      quantitative: 'tadu ya gas-sok'
    }
  },
  'Gutur-gutur': {
    adjectiveForms: {
      descriptive: 'gutur-gutur',
      demonstrative: 'ya gutur-gutur',
      quantitative: 'tadu ya gutur-gutur'
    }
  },
  'Hagobel': {
    adjectiveForms: {
      descriptive: 'hagobel',
      demonstrative: 'ya hagobel',
      quantitative: 'tadu ya hagobel'
    }
  },
  'Hidhid': {
    adjectiveForms: {
      descriptive: 'hidhid',
      demonstrative: 'ya hidhid',
      quantitative: 'tadu ya hidhid'
    }
  },
  'Hiridu': {
    adjectiveForms: {
      descriptive: 'hiridu',
      demonstrative: 'ya hiridu',
      quantitative: 'tadu ya hiridu'
    }
  },
  'Kere-kerewe': {
    adjectiveForms: {
      descriptive: 'kere-kerewe',
      demonstrative: 'ya kere-kerewe',
      quantitative: 'tadu ya kere-kerewe'
    }
  },
  'Labsak': {
    adjectiveForms: {
      descriptive: 'labsak',
      demonstrative: 'ya labsak',
      quantitative: 'tadu ya labsak'
    }
  },
  'Log-okin': {
    adjectiveForms: {
      descriptive: 'log-okin',
      demonstrative: 'ya log-okin',
      quantitative: 'tadu ya log-okin'
    }
  },
  'Lumun': {
    adjectiveForms: {
      descriptive: 'lumun',
      demonstrative: 'ya lumun',
      quantitative: 'tadu ya lumun'
    }
  },
  'Lupek': {
    adjectiveForms: {
      descriptive: 'lupek',
      demonstrative: 'ya lupek',
      quantitative: 'tadu ya lupek'
    }
  },
  'Mabang-i': {
    adjectiveForms: {
      descriptive: 'mabang-i',
      demonstrative: 'ya mabang-i',
      quantitative: 'tadu ya mabang-i'
    }
  },
  'Maka-otla': {
    adjectiveForms: {
      descriptive: 'maka-otla',
      demonstrative: 'ya maka-otla',
      quantitative: 'tadu ya maka-otla'
    }
  },
  'Maker-reg': {
    adjectiveForms: {
      descriptive: 'maker-reg',
      demonstrative: 'ya maker-reg',
      quantitative: 'tadu ya maker-reg'
    }
  },
  'Malangeg': {
    adjectiveForms: {
      descriptive: 'malangeg',
      demonstrative: 'ya malangeg',
      quantitative: 'tadu ya malangeg'
    }
  },
  'Ngopngop': {
    adjectiveForms: {
      descriptive: 'ngopngop',
      demonstrative: 'ya ngopngop',
      quantitative: 'tadu ya ngopngop'
    }
  },
  'Pakloy': {
    adjectiveForms: {
      descriptive: 'pakloy',
      demonstrative: 'ya pakloy',
      quantitative: 'tadu ya pakloy'
    }
  },
  'Pelpel': {
    adjectiveForms: {
      descriptive: 'pelpel',
      demonstrative: 'ya pelpel',
      quantitative: 'tadu ya pelpel'
    }
  },
  'Puluteput': {
    adjectiveForms: {
      descriptive: 'puluteput',
      demonstrative: 'ya puluteput',
      quantitative: 'tadu ya puluteput'
    }
  },
  'Ramusak': {
    adjectiveForms: {
      descriptive: 'ramusak',
      demonstrative: 'ya ramusak',
      quantitative: 'tadu ya ramusak'
    }
  },
  'Rapot-rapot': {
    adjectiveForms: {
      descriptive: 'rapot-rapot',
      demonstrative: 'ya rapot-rapot',
      quantitative: 'tadu ya rapot-rapot'
    }
  },
  'Suliling': {
    adjectiveForms: {
      descriptive: 'suliling',
      demonstrative: 'ya suliling',
      quantitative: 'tadu ya suliling'
    }
  },

  // NOUNS - Singular and Plural in Baler
  'Alintodong': {
    nounForms: { singular: 'alintodong', plural: 'mga alintodong' }
  },
  'Babag': {
    nounForms: { singular: 'babag', plural: 'mga babag' }
  },
  'Badeyo': {
    nounForms: { singular: 'badeyo', plural: 'mga badeyo' }
  },
  'Biningkit': {
    nounForms: { singular: 'biningkit', plural: 'mga biningkit' }
  },
  'Bulastug': {
    nounForms: { singular: 'bulastug', plural: 'mga bulastug' }
  },
  'Dagasa': {
    nounForms: { singular: 'dagasa', plural: 'mga dagasa' }
  },
  'Dayidi': {
    nounForms: { singular: 'dayidi', plural: 'mga dayidi' }
  },
  'Donghe': {
    nounForms: { singular: 'donghe', plural: 'mga donghe' }
  },
  'Epuhin': {
    nounForms: { singular: 'epuhin', plural: 'mga epuhin' }
  },
  'Gangu': {
    nounForms: { singular: 'gangu', plural: 'mga gangu' }
  },
  'Imoy': {
    nounForms: { singular: 'imoy', plural: 'mga imoy' }
  },
  'Kalaghara': {
    nounForms: { singular: 'kalaghara', plural: 'mga kalaghara' }
  },
  'Kalapnit': {
    nounForms: { singular: 'kalapnit', plural: 'mga kalapnit' }
  },
  'Kapukit': {
    nounForms: { singular: 'kapukit', plural: 'mga kapukit' }
  },
  'Kogkog': {
    nounForms: { singular: 'kogkog', plural: 'mga kogkog' }
  },
  'Kurudupdup': {
    nounForms: { singular: 'kurudupdup', plural: 'mga kurudupdup' }
  },
  'Ngarotngot': {
    nounForms: { singular: 'ngarotngot', plural: 'mga ngarotngot' }
  },
  'Palongso': {
    nounForms: { singular: 'palongso', plural: 'mga palongso' }
  },
  'Palpuk': {
    nounForms: { singular: 'palpuk', plural: 'mga palpuk' }
  },
  'Poypoy': {
    nounForms: { singular: 'poypoy', plural: 'mga poypoy' }
  },
  'Puropur': {
    nounForms: { singular: 'puropur', plural: 'mga puropur' }
  },
  'Ramotmot': {
    nounForms: { singular: 'ramotmot', plural: 'mga ramotmot' }
  },
  'Rarug': {
    nounForms: { singular: 'rarug', plural: 'mga rarug' }
  },
  'Rasewat': {
    nounForms: { singular: 'rasewat', plural: 'rasewat' }
  },
  'Tagenggong': {
    nounForms: { singular: 'tagenggong', plural: 'mga tagenggong' }
  },
  'Tagiti': {
    nounForms: { singular: 'tagiti', plural: 'mga tagiti' }
  },
  'Tagupak': {
    nounForms: { singular: 'tagupak', plural: 'mga tagupak' }
  },
  'Tangkung': {
    nounForms: { singular: 'tangkung', plural: 'mga tangkung' }
  },
  'Tapalang': {
    nounForms: { singular: 'tapalang', plural: 'mga tapalang' }
  },
  'Tarkado': {
    nounForms: { singular: 'tarkado', plural: 'mga tarkado' }
  }
};

const addGrammarForms = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    const words = await Word.find();
    let verbsUpdated = 0;
    let adjectivesUpdated = 0;
    let nounsUpdated = 0;

    console.log('📚 Adding Baler grammar forms...\n');

    for (const word of words) {
      const balerKey = Object.keys(grammarData).find(
        key => key.toLowerCase() === word.baler.toLowerCase().replace(/\s+/g, '')
      );

      if (balerKey && grammarData[balerKey]) {
        const updateData = {};
        
        if (grammarData[balerKey].verbForms) {
          updateData.verbForms = grammarData[balerKey].verbForms;
          console.log(`⚡ ${word.baler.padEnd(20)} → present: ${updateData.verbForms.present}, past: ${updateData.verbForms.past}`);
          verbsUpdated++;
        }
        if (grammarData[balerKey].adjectiveForms) {
          updateData.adjectiveForms = grammarData[balerKey].adjectiveForms;
          console.log(`🎨 ${word.baler.padEnd(20)} → ${updateData.adjectiveForms.descriptive}`);
          adjectivesUpdated++;
        }
        
        if (grammarData[balerKey].nounForms) {
          updateData.nounForms = grammarData[balerKey].nounForms;
          console.log(`📦 ${word.baler.padEnd(20)} → singular: ${updateData.nounForms.singular}, plural: ${updateData.nounForms.plural}`);
          nounsUpdated++;
        }

        if (Object.keys(updateData).length > 0) {
          await Word.findByIdAndUpdate(word._id, updateData);
        }
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log(`✅ Updated ${verbsUpdated} verbs with Baler conjugations`);
    console.log(`✅ Updated ${adjectivesUpdated} adjectives with Baler forms`);
    console.log(`✅ Updated ${nounsUpdated} nouns with Baler singular/plural`);
    console.log('='.repeat(70));
    console.log('\n💡 All grammar forms are now in BALER language!');
    console.log('   Test on Translate page: adyu, arupahup, babag\n');
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

addGrammarForms();