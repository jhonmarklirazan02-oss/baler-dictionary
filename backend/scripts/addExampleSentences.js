const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });
const Word = require('../models/Word');

const exampleSentences = {
  'Adyu': 'Adyu ako sa puno para kumuha ng mangga.',
  'Adyos': 'Adyos hindi ka pumunta sa party?',
  'Akkaw': 'Akkaw! Ang laki ng isda na nakuha mo!',
  'Alintodong': 'Magdala ng alintodong dahil mainit ngayon.',
  'Anin': 'Anin lang yan, kaya mo yan!',
  'Arapaw': 'Arapaw ka sa kabayo.',
  'Arupahop': 'Arupahop ang damit mo, magpalit ka.',
  'Atab': 'Huwag kang atab, sabihin mo ang totoo.',
  'Ates': 'Ates! Ang pangit ng lasa nito!',
  'Ateys': 'Ateys! Bakit mo ginawa yan?',
  'Babag': 'May babag sa kalsada kagabi.',
  'Badeyo': 'Magkano ang badeyo papuntang isla?',
  'Bangi': 'Bangi natin ang kamote mamaya.',
  'Barikungkung': 'Natulog siya ng barikungkung.',
  'Bes-sog': 'Bes-sog na siya dahil sa maraming kinakain.',
  'Biningkit': 'Bumili kami ng biningkit sa palengke.',
  'Bulastug': 'Siya ay bulastug, huwag kang maniniwala.',
  'Bulagyat': 'Bulagyat ang mata niya dahil sa puyat.',
  'Bumurayray': 'Bumurayray siya pauwi.',
  'Bungelngel': 'Bungelngel ang bata dahil gutom.',
  'Bungsuran': 'Naghihintay kami sa bungsuran ng bahay.',
  'Dagasa': 'Umuulan ng dagasa ngayon.',
  'Damsak': 'Huwag mong damsak ang tubig.',
  'Dapil': 'Dapil na ako, kailan tayo kakain?',
  'Dayidi': 'Dayidi ang ulan kagabi.',
  'Dep-pot': 'Dep-pot mo ang tinapay sa kape.',
  'Donghe': 'May donghe sa kasal kagabi.',
  'Doprak': 'Huwag kang doprak dito.',
  'Epuhin': 'Gamitin mo ang epuhin para sa apoy.',
  'Ereg': 'Ereg ang pagkakalagay ng larawan.',
  'Gangu': 'Mahirap buksan ang gangu.',
  'Gas-sok': 'Gas-sok na ako, kumain na tayo.',
  'Gutur-gutor': 'Gutur-gutor ang daan dito.',
  'Hagobel': 'Hagobel ang bundok na iyon.',
  'Hidhid': 'Hidhid siya kumain.',
  'Hirido': 'Hirido siya kagabi sa party.',
  'Imoy': 'Imoy na siya, umuwi na tayo.',
  'Intin': 'May intin ka ba? Pautang naman.',
  'Isamual': 'Isamual mo ako sa meeting mamaya.',
  'Isapwal': 'Isapwal mo na yan sa labas.',
  'Isimpan': 'Isimpan mo ang basura sa labas.',
  'Kalaghara': 'Kalaghara mo muna ang damit na yan.',
  'Kalapnit': 'May kalapnit siya sa lalamunan.',
  'Kapukit': 'May kapukit sa kweba.',
  'Kengkeng': 'Bigyan mo lang ako ng kengkeng na pagkain.',
  'Kerebsaw': 'Kerebsaw ang mesa dahil sa lindol.',
  'Kere-kerewe': 'Kere-kerewe ang linya na ginawa mo.',
  'Kogkog': 'Kogkog siya sa laro kagabi.',
  'Kot-teb': 'Kot-teb mo lang ng kaunti ang papel.',
  'Kurupdupdup': 'Kurupdupdup lang ang ilaw dito.',
  'Labsak': 'Labsak ang sabaw, dagdagan mo ng tubig.',
  'Lino': 'Lino mo na ang mga pinggan.',
  'Lisngay': 'Lisngay ang sahig, mag-ingat ka.',
  'Log-okin': 'Log-okin siya, kailangan magpahinga.',
  'Lo-u': 'Lo-u na lang tayo para mabilis.',
  'Lumun': 'Lumun na ang mangga, kainin mo na.',
  'Lupek': 'Lupek ang tinapay na nahulog.',
  'Luway-luway': 'Luway-luway lang, huwag magmadali.',
  'Mabang-i': 'Mabang-i ang isda na yan.',
  'Maggama': 'Maggama kami sa ilog mamaya.',
  'Maka-otla': 'Maka-otla ang tamis ng dessert.',
  'Maker-reg': 'Maker-reg siya sa mga lalaki.',
  'Malangeg': 'Malangeg ang kuwarto mo, maglinis ka.',
  'Narogsat': 'Narogsat ang bahay dahil sa lindol.',
  'Ne-ut': 'Ne-ut niya ang pera ko!',
  'Ngarotngot': 'Ngarotngot ng pintuan kagabi.',
  'Ngopngop': 'Ngopngop na ang lolo ko.',
  'Ngoy-ngoy': 'Ngoy-ngoy siya dahil nasaktan.',
  'Ole-kob': 'Ole-kob siya sa likod ng puno.',
  'Olabsak': 'Olabsak siya habang nanonood ng TV.',
  'Om-mog': 'Om-mog ang matanda sa kanto.',
  'Pakloy': 'Pakloy siya dahil sa sakit.',
  'Paleklek': 'Paleklek tayo para maiwasan ang traffic.',
  'Palongso': 'May palongso sa dagat na yan.',
  'Palpok': 'Gumawa sila ng palpok para sa lamok.',
  'Pelpel': 'Pelpel ang mesa na binili natin.',
  'Peslet': 'Peslet mo ang lata para madali.',
  'Piyok': 'Piyok mo ang sanga para maabot.',
  'Poypoy': 'May poypoy ngayong hapon.',
  'Pululeput': 'Pululeput lang ang saging na yan.',
  'Purupur': 'Purupur lang ang ulan ngayon.',
  'Ramotmot': 'May ramotmot sa tela.',
  'Ramusak': 'Ramusak ang kuwarto mo.',
  'Raput-raput': 'Raput-raput lang ang trabaho niya.',
  'Rarug': 'May rarug pa ng pagkain.',
  'Rasewat': 'Gumamit ng rasewat para sa apoy.',
  'Rebuk': 'Huwag mong rebuk ang tubig.',
  'Sagongsong': 'Sagongsong siya umalis kagabi.',
  'Sapuretret': 'Sapuretret ang tubig sa gripo.',
  'Sapyot': 'Sapyot niya ang tubig sa halaman.',
  'Saredsed': 'Saredsed siya dahil pagod.',
  'Suliling': 'Suliling ang mata niya.',
  'Subdit': 'Subdit niya ang plema.',
  'Tabsong': 'Tabsong siya sa dagat.',
  'Tagenggong': 'Maraming tagenggong sa tenga niya.',
  'Tagiti': 'Tagiti lang ang ulan ngayong umaga.',
  'Tagupak': 'Tagupak ang mga tao pagkatapos ng performance.',
  'Takad': 'Takad natin kung gaano kalalim ang tubig.',
  'Tekmol': 'Tekmol niya ang buong mansanas.',
  'Tangkung': 'Mahirap tanggalin ang tangkung ng alimango.',
  'Tapalang': 'Maraming tapalang sa dalampasigan.',
  'Tarkado': 'Tarkado na ako sa trabaho ngayon.',
  'Teptep': 'Teptep ang mga bata sa tubig.',
  'Tipakok': 'Tipakok mo kung sino ang nanalo.'
};

const addExampleSentences = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    const words = await Word.find();
    let updated = 0;
    let notFound = [];

    console.log('📝 Adding example sentences...\n');

    for (const word of words) {
      const balerKey = Object.keys(exampleSentences).find(
        key => key.toLowerCase() === word.baler.toLowerCase().replace(/\s+/g, '')
      );

      if (balerKey && exampleSentences[balerKey]) {
        await Word.findByIdAndUpdate(word._id, { 
          exampleSentence: exampleSentences[balerKey] 
        });
        console.log(`✅ ${word.baler.padEnd(20)} → "${exampleSentences[balerKey]}"`);
        updated++;
      } else {
        console.log(`⚠️  ${word.baler.padEnd(20)} → No example found`);
        notFound.push(word.baler);
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log(`✅ Added example sentences to ${updated} words`);
    if (notFound.length > 0) {
      console.log(`⚠️  Words without examples (${notFound.length}): ${notFound.join(', ')}`);
    }
    console.log('='.repeat(70));
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

addExampleSentences();