const WORD_TYPE_CONFIG = {
  noun: { emoji: '📦', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  verb: { emoji: '⚡', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  adjective: { emoji: '🎨', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  adverb: { emoji: '🔄', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  pronoun: { emoji: '👤', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  preposition: { emoji: '📍', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  conjunction: { emoji: '🔗', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  interjection: { emoji: '❗', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  phrase: { emoji: '💬', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  expression: { emoji: '🗨️', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' }
};

function WordTypeBadge({ types }) {
  if (!types || types.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {types.map(type => {
        const config = WORD_TYPE_CONFIG[type] || WORD_TYPE_CONFIG.noun;
        return (
          <span
            key={type}
            className={`text-xs px-2 py-0.5 rounded-full border font-medium ${config.color}`}
          >
            {config.emoji} {type}
          </span>
        );
      })}
    </div>
  );
}

export default WordTypeBadge;