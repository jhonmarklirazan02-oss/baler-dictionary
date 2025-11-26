import { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import AddWordModal from '../components/AddWordModal';
import EditWordModal from '../components/EditWordModal';
import WordDetailModal from '../components/WordDetailModal';
import API_URL from '../config/api';

function Dictionary() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    fetchWords();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    setShowBackToTop(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToLetter = (letter) => {
    setSelectedLetter(letter);
    setSearchTerm('');

    if (letter === 'all') {
      scrollToTop();
      return;
    }

    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this word?')) return;

    try {
      const response = await fetch(`${API_URL}/api/words/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchWords();
      }
    } catch (error) {
      console.error('Error deleting word:', error);
    }
  };

  const handleEdit = (word) => {
    setEditingWord(word);
    setShowEditModal(true);
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

  const filteredWords = useMemo(() => {
    let filtered = words;

    if (searchTerm) {
      filtered = filtered.filter(word =>
        word.tagalog.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.baler.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.english.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLetter !== 'all') {
      filtered = filtered.filter(word =>
        word.baler.toLowerCase().startsWith(selectedLetter.toLowerCase())
      );
    }

    return filtered;
  }, [words, searchTerm, selectedLetter]);

  const groupedWords = useMemo(() => {
    const groups = {};
    filteredWords.forEach(word => {
      const firstLetter = word.baler[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(word);
    });
    return groups;
  }, [filteredWords]);

  const availableLetters = useMemo(() => {
    const letters = new Set(words.map(word => word.baler[0].toUpperCase()));
    return Array.from(letters).sort();
  }, [words]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-purple-300">Loading dictionary...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {}
        <div className="glass rounded-2xl p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Baler Dictionary
            </h1>
            <p className="text-themed-secondary">Browse all {words.length} words</p>
          </div>
          {user?.isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all glow"
            >
              + Add Word
            </button>
          )}
        </div>

        {}
        <div className="glass rounded-2xl p-4 mb-6">
          <input
            type="text"
            placeholder="Search words..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedLetter('all');
            }}
            className="w-full bg-transparent border-b-2 border-purple-400 focus:border-pink-400 outline-none text-themed placeholder-gray-400 py-2 transition-colors"
          />
        </div>

        {}
        <div className="glass rounded-2xl p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => scrollToLetter('all')}
              className={`px-3 py-1 rounded-lg transition-colors text-sm font-semibold ${
                selectedLetter === 'all'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'glass-hover text-themed'
              }`}
            >
              All
            </button>
            {availableLetters.map(letter => (
              <button
                key={letter}
                onClick={() => scrollToLetter(letter)}
                className={`px-3 py-1 rounded-lg transition-colors text-sm font-semibold ${
                  selectedLetter === letter
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'glass-hover text-themed'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {}
        <div className="space-y-6">
          {Object.keys(groupedWords).sort().map(letter => (
            <div key={letter} id={`letter-${letter}`}>
              {}
              <div className="glass rounded-t-2xl px-6 py-3 border-b border-white/20">
                <h2 className="text-2xl font-bold text-purple-300">{letter}</h2>
              </div>

              {}
              <div className="glass rounded-b-2xl overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="px-6 py-3 text-left text-purple-300 font-semibold text-xs">TAGALOG</th>
                        <th className="px-6 py-3 text-left text-purple-300 font-semibold text-xs">BALER</th>
                        <th className="px-6 py-3 text-left text-purple-300 font-semibold text-xs">ENGLISH</th>
                        <th className="px-6 py-3 text-center text-purple-300 font-semibold text-xs">AUDIO</th>
                        {user?.isAdmin && (
                          <th className="px-6 py-3 text-center text-purple-300 font-semibold text-xs">ACTIONS</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {groupedWords[letter].map((word) => (
                        <tr 
                          key={word._id} 
                          className="border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedWord(word);
                            setShowDetailModal(true);
                          }}
                        >
                          <td className="px-6 py-4 text-themed">{word.tagalog}</td>
                          <td className="px-6 py-4 text-purple-300 font-semibold">{word.baler}</td>
                          <td className="px-6 py-4 text-themed-secondary">{word.english}</td>
                          <td className="px-6 py-4 text-center">
                            {word.audio ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playAudio(word.audio);
                                }}
                                className="glass-hover p-2 rounded-lg hover:text-pink-400 transition-colors"
                              >
                                🔊
                              </button>
                            ) : (
                              <span className="text-gray-500 opacity-50">🔇</span>
                            )}
                          </td>
                          {user?.isAdmin && (
                            <td className="px-6 py-4 text-center">
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(word);
                                  }}
                                  className="glass-hover px-3 py-1 rounded-lg hover:text-blue-400 transition-colors text-sm"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(word._id);
                                  }}
                                  className="glass-hover px-3 py-1 rounded-lg hover:text-red-400 transition-colors text-sm"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/*mobile support*/}
                <div className="md:hidden p-4 space-y-3">
                  {groupedWords[letter].map((word) => (
                    <div
                      key={word._id}
                      className="glass-hover rounded-lg p-4 cursor-pointer"
                      onClick={() => {
                        setSelectedWord(word);
                        setShowDetailModal(true);
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="text-purple-300 font-bold text-lg">{word.baler}</p>
                          <p className="text-themed text-sm">{word.tagalog}</p>
                          <p className="text-themed-muted text-sm">{word.english}</p>
                        </div>
                        {word.audio && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playAudio(word.audio);
                            }}
                            className="glass-hover p-2 rounded-lg hover:text-pink-400 transition-colors ml-2"
                          >
                            🔊
                          </button>
                        )}
                      </div>
                      {user?.isAdmin && (
                        <div className="flex gap-2 pt-3 border-t border-white/10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(word);
                            }}
                            className="flex-1 glass-hover px-3 py-2 rounded-lg hover:text-blue-400 transition-colors text-sm"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(word._id);
                            }}
                            className="flex-1 glass-hover px-3 py-2 rounded-lg hover:text-red-400 transition-colors text-sm"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {}
        {filteredWords.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-themed-muted text-lg">No words found</p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLetter('all');
                }}
                className="mt-4 glass-hover px-4 py-2 rounded-lg text-purple-400"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {}
        <div className="glass rounded-2xl p-4 mt-6 text-center">
          <p className="text-themed-secondary text-sm md:text-base">
            {searchTerm || selectedLetter !== 'all' ? (
              <>
                Showing: <span className="text-pink-400 font-semibold">{filteredWords.length}</span>
                <span className="mx-2">of</span>
                <span className="text-purple-400 font-semibold">{words.length}</span> words
              </>
            ) : (
              <>
                Total: <span className="text-purple-400 font-semibold">{words.length}</span> words
              </>
            )}
          </p>
        </div>
      </div>

      {}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 glass-hover p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
          title="Back to top"
        >
          ↑
        </button>
      )}

      {}
      <AddWordModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onWordAdded={fetchWords}
        token={token}
      />

      <EditWordModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingWord(null);
        }}
        onWordUpdated={fetchWords}
        token={token}
        word={editingWord}
      />

      <WordDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedWord(null);
        }}
        word={selectedWord}
      />
    </div>
  );
}

export default Dictionary;