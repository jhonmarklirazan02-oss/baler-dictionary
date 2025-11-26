import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

function AudioManagement() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }
    fetchWords();
  }, [user]);

  const fetchWords = async () => {
    try {
      const response = await fetch(`${API_URL}/api/words`);
      const data = await response.json();
      setWords(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching words:', error);
      setLoading(false);
    }
  };

  const filteredWords = words.filter(word => {
    if (filter === 'with-audio') return word.audio;
    if (filter === 'without-audio') return !word.audio;
    return true;
  });

  const statsWithAudio = words.filter(w => w.audio).length;
  const statsWithoutAudio = words.filter(w => !w.audio).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-purple-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {}
        <div className="glass rounded-2xl p-6 mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Audio Management
          </h1>
          <p className="text-themed-secondary">Manage audio files for Baler words</p>
        </div>

        {}
        <div className="glass rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4">📝 How to Add Audio Files</h2>
          <div className="space-y-3 text-themed-secondary">
            <div className="flex gap-3">
              <span className="text-purple-400 font-bold">1.</span>
              <p>Record your MP3 audio files for each Baler word (e.g., "adyu.mp3")</p>
            </div>
            <div className="flex gap-3">
              <span className="text-purple-400 font-bold">2.</span>
              <p>Place the MP3 files in the <code className="bg-purple-500/20 px-2 py-1 rounded text-purple-300">backend/uploads/audio/</code> folder</p>
            </div>
            <div className="flex gap-3">
              <span className="text-purple-400 font-bold">3.</span>
              <p>Go to Dictionary page and click "Edit" on the word</p>
            </div>
            <div className="flex gap-3">
              <span className="text-purple-400 font-bold">4.</span>
              <p>Enter the filename (e.g., "adyu.mp3") in the Audio field and save</p>
            </div>
            <div className="flex gap-3">
              <span className="text-purple-400 font-bold">5.</span>
              <p>The audio button (🔊) will now be active for that word!</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500 rounded-lg">
            <p className="text-yellow-200">
              <strong>💡 Tip:</strong> Name your files exactly as the Baler word (lowercase, no spaces) for easy management. Example: "adyu.mp3", "adyos.mp3"
            </p>
          </div>
        </div>

        {}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="glass rounded-2xl p-6 text-center">
            <p className="text-themed-muted text-sm mb-2">Total Words</p>
            <p className="text-4xl font-bold text-purple-400">{words.length}</p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <p className="text-themed-muted text-sm mb-2">With Audio</p>
            <p className="text-4xl font-bold text-green-400">{statsWithAudio}</p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <p className="text-themed-muted text-sm mb-2">Missing Audio</p>
            <p className="text-4xl font-bold text-yellow-400">{statsWithoutAudio}</p>
          </div>
        </div>

        {}
        <div className="glass rounded-2xl p-4 mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'glass-hover'
            }`}
          >
            All ({words.length})
          </button>
          <button
            onClick={() => setFilter('with-audio')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'with-audio' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'glass-hover'
            }`}
          >
            With Audio ({statsWithAudio})
          </button>
          <button
            onClick={() => setFilter('without-audio')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'without-audio' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'glass-hover'
            }`}
          >
            Missing Audio ({statsWithoutAudio})
          </button>
        </div>

        {}
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="px-6 py-4 text-left text-purple-300 font-semibold">Baler</th>
                <th className="px-6 py-4 text-left text-purple-300 font-semibold">Tagalog</th>
                <th className="px-6 py-4 text-left text-purple-300 font-semibold">English</th>
                <th className="px-6 py-4 text-left text-purple-300 font-semibold">Audio File</th>
                <th className="px-6 py-4 text-center text-purple-300 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredWords.map((word) => (
                <tr key={word._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-purple-300 font-semibold">{word.baler}</td>
                  <td className="px-6 py-4 text-themed">{word.tagalog}</td>
                  <td className="px-6 py-4 text-themed-secondary">{word.english}</td>
                  <td className="px-6 py-4 text-themed-muted">
                    {word.audio || <span className="text-yellow-500 italic">Not set</span>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {word.audio ? (
                      <span className="text-green-400">✓ Ready</span>
                    ) : (
                      <span className="text-yellow-400">⚠ Missing</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AudioManagement;