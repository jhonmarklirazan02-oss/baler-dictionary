import { useState, useEffect } from 'react';
import API_URL from '../config/api';
import AudioRecorder from './AudioRecorder';

const WORD_TYPES = [
  { value: 'noun', label: 'Noun', emoji: '📦' },
  { value: 'verb', label: 'Verb', emoji: '⚡' },
  { value: 'adjective', label: 'Adjective', emoji: '🎨' },
  { value: 'adverb', label: 'Adverb', emoji: '🔄' },
  { value: 'pronoun', label: 'Pronoun', emoji: '👤' },
  { value: 'preposition', label: 'Preposition', emoji: '📍' },
  { value: 'conjunction', label: 'Conjunction', emoji: '🔗' },
  { value: 'interjection', label: 'Interjection', emoji: '❗' },
  { value: 'phrase', label: 'Phrase', emoji: '💬' },
  { value: 'expression', label: 'Expression', emoji: '🗨️' }
];

function EditWordModal({ isOpen, onClose, onWordUpdated, token, word }) {
  const [formData, setFormData] = useState({
    tagalog: '',
    baler: '',
    english: '',
    definition: '',
    audio: '',
    wordType: [],
    exampleSentence: '',
    verbForms: {
      present: '',
      past: ''
    },
    adjectiveForms: {
      descriptive: '',
      demonstrative: '',
      quantitative: ''
    },
    nounForms: {
      singular: '',
      plural: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [recordingMode, setRecordingMode] = useState('upload'); // 'upload' | 'record'

  useEffect(() => {
    if (word) {
      setFormData({
        tagalog: word.tagalog || '',
        baler: word.baler || '',
        english: word.english || '',
        definition: word.definition || '',
        audio: word.audio || '',
        wordType: word.wordType || [],
        exampleSentence: word.exampleSentence || '',
        verbForms: {
          present: word.verbForms?.present || '',
          past: word.verbForms?.past || ''
        },
        adjectiveForms: {
          descriptive: word.adjectiveForms?.descriptive || '',
          demonstrative: word.adjectiveForms?.demonstrative || '',
          quantitative: word.adjectiveForms?.quantitative || ''
        },
        nounForms: {
          singular: word.nounForms?.singular || '',
          plural: word.nounForms?.plural || ''
        }
      });
      setAudioFile(null);
      setUploadError('');
    }
  }, [word]);

  const toggleWordType = (type) => {
    setFormData(prev => ({
      ...prev,
      wordType: prev.wordType.includes(type)
        ? prev.wordType.filter(t => t !== type)
        : [...prev.wordType, type]
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/webm', 'audio/x-m4a'];
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a|webm)$/i)) {
        setUploadError('Please select a valid audio file (mp3, wav, ogg, m4a, webm)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size must be less than 5MB');
        return;
      }

      setAudioFile(file);
      setUploadError('');
    }
  };

  const uploadAudio = async () => {
    if (!audioFile) return null;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('audio', audioFile);

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return data.filename;

    } catch (err) {
      setUploadError(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let audioFilename = formData.audio;
      if (audioFile) {
        audioFilename = await uploadAudio();
        if (!audioFilename) {
          throw new Error('Audio upload failed. Please try again.');
        }
      }

      const response = await fetch(`${API_URL}/api/words/${word._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          audio: audioFilename
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update word');
      }

      setAudioFile(null);
      setUploadError('');
      onWordUpdated();
      onClose();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isVerb = formData.wordType.includes('verb');
  const isAdjective = formData.wordType.includes('adjective');
  const isNoun = formData.wordType.includes('noun');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="glass rounded-2xl p-8 max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Edit Word
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-themed-secondary mb-2 font-medium text-sm">Tagalog *</label>
              <input
                type="text"
                value={formData.tagalog}
                onChange={(e) => setFormData({ ...formData, tagalog: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-themed placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-themed-secondary mb-2 font-medium text-sm">Baler *</label>
              <input
                type="text"
                value={formData.baler}
                onChange={(e) => setFormData({ ...formData, baler: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-themed placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-themed-secondary mb-2 font-medium text-sm">English *</label>
            <input
              type="text"
              value={formData.english}
              onChange={(e) => setFormData({ ...formData, english: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-themed placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-themed-secondary mb-2 font-medium text-sm">Definition</label>
            <textarea
              value={formData.definition}
              onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-themed placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors resize-none"
              rows="2"
            />
          </div>

          {}
          <div>
            <label className="block text-themed-secondary mb-2 font-medium text-sm">Word Type(s) *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {WORD_TYPES.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => toggleWordType(type.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    formData.wordType.includes(type.value)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'glass-hover text-themed-secondary'
                  }`}
                >
                  {type.emoji} {type.label}
                </button>
              ))}
            </div>
          </div>

          {}
          <div>
            <label className="block text-themed-secondary mb-2 font-medium text-sm">Example Sentence</label>
            <textarea
              value={formData.exampleSentence}
              onChange={(e) => setFormData({ ...formData, exampleSentence: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-themed placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors resize-none"
              placeholder="Example: Adyu ako sa puno para kumuha ng mangga."
              rows="2"
            />
            <p className="text-themed-muted text-xs mt-1">A sentence showing the word in context</p>
          </div>

          {}
          {isVerb && (
            <div className="border border-green-500/30 bg-green-500/5 rounded-lg p-4">
              <p className="text-green-400 font-semibold mb-3 text-sm">⚡ Verb Forms (Baler)</p>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-themed-secondary mb-1 text-xs">Present</label>
                  <input
                    type="text"
                    value={formData.verbForms.present}
                    onChange={(e) => setFormData({
                      ...formData,
                      verbForms: { ...formData.verbForms, present: e.target.value }
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-themed text-sm"
                    placeholder="e.g., aadyu"
                  />
                </div>
                <div>
                  <label className="block text-themed-secondary mb-1 text-xs">Past</label>
                  <input
                    type="text"
                    value={formData.verbForms.past}
                    onChange={(e) => setFormData({
                      ...formData,
                      verbForms: { ...formData.verbForms, past: e.target.value }
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-themed text-sm"
                    placeholder="e.g., umadyu"
                  />
                </div>
              </div>
            </div>
          )}

          {}
          {isAdjective && (
            <div className="border border-purple-500/30 bg-purple-500/5 rounded-lg p-4">
              <p className="text-purple-400 font-semibold mb-3 text-sm">🎨 Adjective Forms (Baler)</p>
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-themed-secondary mb-1 text-xs">Descriptive</label>
                  <input
                    type="text"
                    value={formData.adjectiveForms.descriptive}
                    onChange={(e) => setFormData({
                      ...formData,
                      adjectiveForms: { ...formData.adjectiveForms, descriptive: e.target.value }
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-themed text-sm"
                    placeholder="e.g., arupahup"
                  />
                </div>
                <div>
                  <label className="block text-themed-secondary mb-1 text-xs">Demonstrative</label>
                  <input
                    type="text"
                    value={formData.adjectiveForms.demonstrative}
                    onChange={(e) => setFormData({
                      ...formData,
                      adjectiveForms: { ...formData.adjectiveForms, demonstrative: e.target.value }
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-themed text-sm"
                    placeholder="e.g., ya arupahup"
                  />
                </div>
                <div>
                  <label className="block text-themed-secondary mb-1 text-xs">Quantitative</label>
                  <input
                    type="text"
                    value={formData.adjectiveForms.quantitative}
                    onChange={(e) => setFormData({
                      ...formData,
                      adjectiveForms: { ...formData.adjectiveForms, quantitative: e.target.value }
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-themed text-sm"
                    placeholder="e.g., tadu ya arupahup"
                  />
                </div>
              </div>
            </div>
          )}

          {}
          {isNoun && (
            <div className="border border-blue-500/30 bg-blue-500/5 rounded-lg p-4">
              <p className="text-blue-400 font-semibold mb-3 text-sm">📦 Noun Forms (Baler)</p>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-themed-secondary mb-1 text-xs">Singular</label>
                  <input
                    type="text"
                    value={formData.nounForms.singular}
                    onChange={(e) => setFormData({
                      ...formData,
                      nounForms: { ...formData.nounForms, singular: e.target.value }
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-themed text-sm"
                    placeholder="e.g., babag"
                  />
                </div>
                <div>
                  <label className="block text-themed-secondary mb-1 text-xs">Plural</label>
                  <input
                    type="text"
                    value={formData.nounForms.plural}
                    onChange={(e) => setFormData({
                      ...formData,
                      nounForms: { ...formData.nounForms, plural: e.target.value }
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-themed text-sm"
                    placeholder="e.g., mga babag"
                  />
                </div>
              </div>
            </div>
          )}

          {}
          <div>
            <label className="block text-themed-secondary mb-2 font-medium text-sm">Audio File</label>

            {}
            {formData.audio && !audioFile && (
              <div className="mb-3 bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 text-sm flex items-center gap-2">
                    <span>🎵</span>
                    <span>Current: {formData.audio}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Remove current audio file?')) {
                        setFormData({ ...formData, audio: '' });
                      }
                    }}
                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setRecordingMode('upload')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  recordingMode === 'upload'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'glass-hover text-themed-secondary'
                }`}
              >
                📁 Upload File
              </button>
              <button
                type="button"
                onClick={() => setRecordingMode('record')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  recordingMode === 'record'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'glass-hover text-themed-secondary'
                }`}
              >
                🎤 Record Audio
              </button>
            </div>

            {}
            {recordingMode === 'upload' ? (
              <div>
                {}
                <div className="mb-3">
                  <label className="flex items-center justify-center w-full bg-white/10 border-2 border-dashed border-white/20 rounded-lg px-4 py-6 cursor-pointer hover:bg-white/15 transition-colors">
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">🎤</span>
                      <span className="text-themed-secondary text-sm">
                        {audioFile ? audioFile.name : 'Click to upload new audio file'}
                      </span>
                      <p className="text-themed-muted text-xs mt-1">MP3, WAV, OGG, M4A, WEBM (max 5MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {audioFile && (
                    <div className="mt-2 flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
                      <span className="text-green-400 text-sm flex items-center gap-2">
                        <span>✓</span>
                        <span className="truncate max-w-[200px]">{audioFile.name}</span>
                        <span className="text-green-300 text-xs">({(audioFile.size / 1024).toFixed(1)} KB)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setAudioFile(null);
                          setUploadError('');
                        }}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {}
                <div>
                  <p className="text-themed-muted text-xs mb-2">Or enter audio filename manually:</p>
                  <input
                    type="text"
                    value={formData.audio}
                    onChange={(e) => setFormData({ ...formData, audio: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-themed placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="e.g., adyu.mp3"
                    disabled={audioFile !== null}
                  />
                  <p className="text-themed-muted text-xs mt-1">
                    {audioFile ? 'Remove uploaded file to enter filename manually' : 'Only if the audio file already exists on the server'}
                  </p>
                </div>
              </div>
            ) : (
              <AudioRecorder
                onRecordingComplete={(file) => {
                  setAudioFile(file);
                  setUploadError('');
                }}
                onError={(error) => setUploadError(error.message)}
                maxDuration={120}
              />
            )}

            {}
            {uploadError && (
              <div className="mt-3 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                <p className="text-red-400 text-xs">{uploadError}</p>
              </div>
            )}

            {uploading && (
              <div className="mt-3 bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2">
                <p className="text-blue-400 text-xs">⏳ Uploading audio...</p>
              </div>
            )}
          </div>

          {}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 text-themed font-semibold py-3 rounded-lg hover:bg-white/20 transition-colors"
              disabled={loading || uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : uploading ? 'Uploading...' : 'Update Word'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditWordModal;