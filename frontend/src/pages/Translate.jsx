import { useState, useEffect } from 'react';
import API_URL from '../config/api';
import WordTypeBadge from '../components/WordTypeBadge';

function Translate() {
  const [words, setWords] = useState([]);
  const [inputText, setInputText] = useState('');
  const [fromLang, setFromLang] = useState('tagalog');
  const [toLang, setToLang] = useState('baler');
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchWords();

    // Refresh words when page becomes visible (tab switching, etc)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchWords();
      }
    };

    // Refresh words when window regains focus
    const handleFocus = () => {
      fetchWords();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const fetchWords = async () => {
    try {
      const response = await fetch(`${API_URL}/api/words`);
      const data = await response.json();
      setWords(data);
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  const handleTranslate = () => {
    if (!inputText.trim()) {
      setResults([]);
      return;
    }

    const searchTerm = inputText.toLowerCase().trim();
    
    const matches = words.filter(word => {
      const sourceText = word[fromLang]?.toLowerCase() || '';
      return sourceText.includes(searchTerm) || searchTerm.includes(sourceText);
    });

    setResults(matches);
  };

  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setInputText('');
    setResults([]);
  };

  const playAudio = (audioFile) => {
    if (audioFile) {
      // Check if audio is a full URL (Cloudinary) or just a filename (legacy)
      const audioUrl = audioFile.startsWith('http')
        ? audioFile
        : `${API_URL}/audio/${audioFile}`;
      const audio = new Audio(audioUrl);
      audio.play().catch(err => console.error('Audio play failed:', err));
    }
  };

  const renderVerbForms = (word) => {
    if (!word.wordType?.includes('verb') || !word.verbForms) return null;

    const forms = [];
    if (word.verbForms.present) forms.push({ label: 'present', value: word.verbForms.present });
    if (word.verbForms.past) forms.push({ label: 'past', value: word.verbForms.past });

    if (forms.length === 0) return null;

    return (
      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-themed-muted text-xs mb-2 uppercase tracking-wider font-semibold">Verb Forms (Baler)</p>
        <div className="flex flex-wrap gap-2">
          {forms.map(form => (
            <span key={form.label} className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-full font-medium">
              {form.label}: <span className="font-semibold">{form.value}</span>
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderAdjectiveForms = (word) => {
    if (!word.wordType?.includes('adjective') || !word.adjectiveForms) return null;

    const forms = [];
    if (word.adjectiveForms.descriptive) forms.push({ label: 'descriptive', value: word.adjectiveForms.descriptive });
    if (word.adjectiveForms.demonstrative) forms.push({ label: 'demonstrative', value: word.adjectiveForms.demonstrative });
    if (word.adjectiveForms.quantitative) forms.push({ label: 'quantitative', value: word.adjectiveForms.quantitative });

    if (forms.length === 0) return null;

    return (
      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-themed-muted text-xs mb-2 uppercase tracking-wider font-semibold">Adjective Forms (Baler)</p>
        <div className="flex flex-wrap gap-2">
          {forms.map(form => (
            <span key={form.label} className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1.5 rounded-full font-medium">
              {form.label}: <span className="font-semibold">{form.value}</span>
            </span>
          ))}
        </div>
      </div>
    );
  };
  const renderNounForms = (word) => {
    if (!word.wordType?.includes('noun') || !word.nounForms) return null;

    const forms = [];
    if (word.nounForms.singular) forms.push({ label: 'singular', value: word.nounForms.singular });
    if (word.nounForms.plural) forms.push({ label: 'plural', value: word.nounForms.plural });

    if (forms.length === 0) return null;

    return (
      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-themed-muted text-xs mb-2 uppercase tracking-wider font-semibold">Noun Forms (Baler)</p>
        <div className="flex flex-wrap gap-2">
          {forms.map(form => (
            <span key={form.label} className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-full font-medium">
              {form.label}: <span className="font-semibold">{form.value}</span>
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {}
        <div className="glass rounded-2xl p-6 mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Translate
          </h1>
          <p className="text-themed-secondary">Translate between Tagalog, Baler, and English</p>
        </div>

        {}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {}
            <div>
              <label className="block text-themed-secondary mb-2 text-sm font-medium">From</label>
              <select
                value={fromLang}
                onChange={(e) => setFromLang(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-themed focus:outline-none focus:border-purple-400 transition-colors"
              >
                <option value="tagalog">Tagalog</option>
                <option value="baler">Baler</option>
                <option value="english">English</option>
              </select>
            </div>

            {/* Swap Button */}
            <div className="flex items-end justify-center">
              <button
                onClick={swapLanguages}
                className="glass-hover p-3 rounded-lg hover:text-pink-400 transition-colors text-2xl"
                title="Swap languages"
              >
                ⇄
              </button>
            </div>

            {}
            <div>
              <label className="block text-themed-secondary mb-2 text-sm font-medium">To</label>
              <select
                value={toLang}
                onChange={(e) => setToLang(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-themed focus:outline-none focus:border-purple-400 transition-colors"
              >
                <option value="tagalog">Tagalog</option>
                <option value="baler">Baler</option>
                <option value="english">English</option>
              </select>
            </div>
          </div>

          {}
          <div className="mb-4">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Enter ${fromLang} text...`}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-themed placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors resize-none"
              rows="3"
            />
          </div>

          {}
          <button
            onClick={handleTranslate}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all glow"
          >
            Translate
          </button>
        </div>

        {}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-purple-300 mb-4">
              {results.length} {results.length === 1 ? 'Result' : 'Results'}
            </h2>
            
            {results.map((word) => (
              <div key={word._id} className="glass rounded-2xl p-6 hover:bg-white/10 transition-colors">
                {}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-3xl font-bold text-purple-300">{word.baler}</h3>
                      {word.audio && (
                        <button
                          onClick={() => playAudio(word.audio)}
                          className="glass-hover p-2 rounded-lg hover:text-pink-400 transition-colors"
                          title="Play pronunciation"
                        >
                          🔊
                        </button>
                      )}
                    </div>
                    <WordTypeBadge types={word.wordType} />
                  </div>
                </div>

                {}
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-themed-muted text-xs mb-1 uppercase tracking-wider font-semibold">Tagalog</p>
                    <p className="text-themed font-semibold text-lg">{word.tagalog}</p>
                  </div>
                  <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                    <p className="text-purple-300 text-xs mb-1 uppercase tracking-wider font-semibold">Baler</p>
                    <p className="text-purple-300 font-bold text-lg">{word.baler}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-themed-muted text-xs mb-1 uppercase tracking-wider font-semibold">English</p>
                    <p className="text-themed font-semibold text-lg">{word.english}</p>
                  </div>
                </div>

                {}
                {word.definition && (
                  <div className="mb-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-blue-300 text-xs mb-2 uppercase tracking-wider font-semibold">Definition</p>
                    <p className="text-themed-secondary leading-relaxed">{word.definition}</p>
                  </div>
                )}

                {}
                {renderVerbForms(word)}
                {renderAdjectiveForms(word)}
                {renderNounForms(word)}

                {}
                {word.exampleSentence && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-themed-muted text-xs mb-3 uppercase tracking-wider font-semibold">Example Sentence</p>
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-l-4 border-purple-500 p-4 rounded-r-lg">
                      <p className="text-themed text-base leading-relaxed italic">
                        "{word.exampleSentence}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {}
        {inputText && results.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-themed-muted text-lg mb-2">No translations found for "{inputText}"</p>
            <p className="text-themed-secondary text-sm">Try searching in the Dictionary tab for all words</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Translate;