const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Word = require('../models/Word');

const batchUpdateAudio = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    //audiofiles directory - dito kayo mag upload ng files
    const audioFolder = path.join(__dirname, '../uploads/audio');
    
    if (!fs.existsSync(audioFolder)) {
      console.log('❌ Audio folder not found. Creating it...');
      fs.mkdirSync(audioFolder, { recursive: true });
      console.log('✅ Audio folder created at:', audioFolder);
      console.log('📁 Please add your MP3 files to this folder and run the script again.');
      process.exit(0);
    }

    const audioFiles = fs.readdirSync(audioFolder).filter(file => file.endsWith('.mp3'));
    
    if (audioFiles.length === 0) {
      console.log('⚠️ No MP3 files found in uploads/audio/');
      console.log('📁 Folder location:', audioFolder);
      process.exit(0);
    }

    console.log(`\n📁 Found ${audioFiles.length} audio files:\n`);
    audioFiles.forEach(file => console.log(`   - ${file}`));

    let updated = 0;
    let notFound = 0;
    const notFoundFiles = [];

    console.log('\n🔄 Starting batch update...\n');

    for (const audioFile of audioFiles) {
      const balerWord = audioFile.replace('.mp3', '');
      const word = await Word.findOneAndUpdate(
        { baler: new RegExp(`^${balerWord}$`, 'i') },
        { audio: audioFile },
        { new: true }
      );

      if (word) {
        updated++;
        console.log(`✅ Updated: ${word.baler} → ${audioFile}`);
      } else {
        notFound++;
        notFoundFiles.push(audioFile);
        console.log(`❌ Not found in DB: ${audioFile}`);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Batch Update Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Successfully updated: ${updated}`);
    console.log(`❌ Not found in database: ${notFound}`);
    
    if (notFoundFiles.length > 0) {
      console.log('\n⚠️ Files not matched to any word:');
      notFoundFiles.forEach(file => console.log(`   - ${file}`));
      console.log('\n💡 Tip: Make sure filenames match Baler words exactly (case-insensitive)');
    }

    console.log('\n✨ Batch update completed!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

batchUpdateAudio();