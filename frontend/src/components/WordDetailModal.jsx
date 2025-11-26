import WordTypeBadge from './WordTypeBadge';
import API_URL from '../config/api';

function WordDetailModal({ isOpen, onClose, word }) {
  const playAudio = () => {
    if (word?.audio) {
      // Check if audio is a full URL (Cloudinary) or just a filename (legacy)
      const audioUrl = word.audio.startsWith('http')
        ? word.audio
        : `${API_URL}/audio/${word.audio}`;
      const audio = new Audio(audioUrl);
      audio.play().catch(err => console.error('Audio play failed:', err));
    }
  };

  if (!isOpen || !word) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="glass rounded-2xl p-8 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
        {}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-purple-300 mb-2">{word.baler}</h2>
            <WordTypeBadge types={word.wordType} />
          </div>
          <button
            onClick={onClose}
            className="text-themed-muted hover:text-white text-3xl ml-4"
          >
            ×
          </button>
        </div>

        {}
        <div className="space-y-4 mb-6">
          <div>
            <p className="text-themed-muted text-sm mb-1">Tagalog</p>
            <p className="text-themed text-xl font-medium">{word.tagalog}</p>
          </div>

          <div>
            <p className="text-themed-muted text-sm mb-1">English</p>
            <p className="text-themed text-xl font-medium">{word.english}</p>
          </div>

          {word.definition && (
            <div className="pt-4 border-t border-white/20">
              <p className="text-themed-muted text-sm mb-2">Definition</p>
              <p className="text-themed-secondary text-lg leading-relaxed">
                {word.definition}
              </p>
            </div>
          )}
        </div>

        {}
        {word.audio && (
          <div className="flex items-center justify-center pt-4 border-t border-white/20">
            <button
              onClick={playAudio}
              className="glass-hover px-6 py-3 rounded-lg hover:text-pink-400 transition-all flex items-center gap-3"
            >
              <span className="text-2xl">🔊</span>
              <span className="font-medium">Play Pronunciation</span>
            </button>
          </div>
        )}

        {}
        <div className="mt-6 pt-4 border-t border-white/20">
          <button
            onClick={onClose}
            className="w-full glass-hover py-3 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default WordDetailModal;