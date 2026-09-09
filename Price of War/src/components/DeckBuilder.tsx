import React, { useState } from 'react';
import { CardData, CardType } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, ArrowLeft, Sword, Heart, RotateCcw } from 'lucide-react';
import { CardFace } from './CardFace';

interface DeckBuilderProps {
  deck: CardData[];
  defaultDeck: CardData[];
  onSave: (deck: CardData[]) => void;
  onBack: () => void;
}

const EMPTY_FORM = {
  name: '',
  atk: 1,
  hp: 1,
  cost: 1,
  art: '',
  effect: '',
  cardType: 'Infantaria' as CardType,
};

const CardPreview = ({ card, onClick, onDelete }: { card: CardData; key?: React.Key; onClick: () => void; onDelete: () => void }) => (
  <motion.div
    layout
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
    className="relative aspect-[905/1287] bg-transparent border-0 drop-shadow-xl cursor-pointer group"
    onClick={onClick}
  >
    <CardFace variant="preview" card={card} />

    {/* Hover overlay */}
    <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-colors rounded-xl pointer-events-none z-20" />
    <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-400 rounded-xl transition-colors pointer-events-none z-20" />

    {/* Delete button */}
    <button
      onClick={(e) => { e.stopPropagation(); onDelete(); }}
      className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full border-2 border-red-900 items-center justify-center z-30 hidden group-hover:flex hover:bg-red-500 transition-colors"
    >
      <X className="w-3 h-3 text-white" />
    </button>
  </motion.div>
);

export const DeckBuilder: React.FC<DeckBuilderProps> = ({ deck, defaultDeck, onSave, onBack }) => {
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const openAddForm = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (card: CardData) => {
    setForm({ name: card.name, atk: card.atk, hp: card.hp, cost: card.cost, art: card.art, effect: card.effect, cardType: card.cardType ?? 'Infantaria' });
    setEditingId(card.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    if (editingId) {
      // When editing, check Relíquia limit only if cardType changed to Relíquia
      if (form.cardType === 'Relíquia') {
        const existingRelic = deck.find(c => c.cardType === 'Relíquia' && c.id !== editingId);
        if (existingRelic) {
          alert('Apenas 1 carta do tipo Relíquia é permitida por deck!');
          return;
        }
      }
      onSave(deck.map(c => c.id === editingId ? { ...form, id: editingId } : c));
      setEditingId(null);
    } else {
      if (form.cardType === 'Relíquia' && deck.filter(c => c.cardType === 'Relíquia').length >= 1) {
        alert('Apenas 1 carta do tipo Relíquia é permitida por deck!');
        return;
      }
      onSave([...deck, { ...form, id: `custom_${Date.now()}` }]);
    }
    setForm({ ...EMPTY_FORM });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    onSave(deck.filter(c => c.id !== id));
  };

  const handleReset = () => {
    onSave([...defaultDeck]);
    setShowResetConfirm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col w-full min-h-screen bg-zinc-950 text-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
          Menu
        </button>
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-black text-indigo-400 tracking-widest uppercase">Meu Deck</h1>
          <p className="text-xs text-zinc-500">{deck.length} carta{deck.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-amber-400 transition-colors text-xs font-bold"
          title="Restaurar deck padrão"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden md:inline">Restaurar padrão</span>
        </button>
      </div>

      {/* Card Grid */}
      <div className="flex-1 p-4 md:p-8">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
          <AnimatePresence>
            {deck.map(card => (
              <CardPreview
                key={card.id}
                card={card}
                onClick={() => openEditForm(card)}
                onDelete={() => handleDelete(card.id)}
              />
            ))}
          </AnimatePresence>

          {/* Add Card Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openAddForm}
            className="aspect-[905/1287] border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-2 text-zinc-600 hover:border-indigo-500 hover:text-indigo-400 transition-all hover:bg-indigo-950/20"
          >
            <Plus className="w-7 h-7" />
            <span className="text-[10px] font-bold uppercase">Nova Carta</span>
          </motion.button>
        </div>

        {deck.length === 0 && (
          <div className="text-center text-zinc-600 mt-16">
            <p className="text-lg font-bold">Deck vazio</p>
            <p className="text-sm mt-1">Adicione cartas para jogar!</p>
          </div>
        )}
      </div>

      {/* Card Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-indigo-400">
                  {editingId ? 'Editar Carta' : 'Nova Carta'}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block font-bold uppercase tracking-wider">Nome</label>
                  <input
                    type="text"
                    placeholder="Nome da carta..."
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    autoFocus
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sword className="w-3 h-3" /> Ataque
                    </label>
                    <input
                      type="number" min={0} max={20}
                      value={form.atk}
                      onChange={e => setForm(f => ({ ...f, atk: Math.max(0, Math.min(20, Number(e.target.value))) }))}
                      className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block font-bold uppercase tracking-wider flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-400" /> Vida
                    </label>
                    <input
                      type="number" min={1} max={20}
                      value={form.hp}
                      onChange={e => setForm(f => ({ ...f, hp: Math.max(1, Math.min(20, Number(e.target.value))) }))}
                      className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block font-bold uppercase tracking-wider">💎 Custo</label>
                    <input
                      type="number" min={0} max={10}
                      value={form.cost}
                      onChange={e => setForm(f => ({ ...f, cost: Math.max(0, Math.min(10, Number(e.target.value))) }))}
                      className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Art URL */}
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block font-bold uppercase tracking-wider">URL da Arte (opcional)</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={form.art}
                    onChange={e => setForm(f => ({ ...f, art: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  {form.art && (
                    <div className="mt-2 w-16 h-20 rounded-lg overflow-hidden border border-zinc-600">
                      <img src={form.art} alt="preview" className="w-full h-full object-cover" referrerPolicy="no-referrer"
                        onError={(e) => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}
                </div>

                {/* Effect */}
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block font-bold uppercase tracking-wider">Efeito / Descrição</label>
                  <textarea
                    placeholder="Ex: Charge. Pode atacar imediatamente."
                    value={form.effect}
                    onChange={e => setForm(f => ({ ...f, effect: e.target.value }))}
                    rows={3}
                    className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                {/* Card Type */}
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block font-bold uppercase tracking-wider">Tipo da Carta</label>
                  <select
                    value={form.cardType}
                    onChange={e => setForm(f => ({ ...f, cardType: e.target.value as CardType }))}
                    className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Infantaria">Infantaria</option>
                    <option value="Cavalaria">Cavalaria</option>
                    <option value="Artilharia">Artilharia</option>
                    <option value="Arqueiro">Arqueiro</option>
                    <option value="Tática">Tática</option>
                    <option value="Suporte">Suporte</option>
                    <option value="Lendário">Lendário</option>
                    <option value="Relíquia">Relíquia (limite: 1 por deck)</option>
                    <option value="Terreno">Terreno</option>
                  </select>
                </div>

                {/* Mini Preview */}
                {form.name.trim() && (
                  <div className="flex items-center gap-3 bg-zinc-800 rounded-xl p-3 border border-zinc-600">
                    <span className="text-xs text-zinc-500 shrink-0">Preview:</span>
                    <span className="font-bold text-white truncate">{form.name}</span>
                    <div className="ml-auto flex items-center gap-3 shrink-0 text-sm">
                      <span className="text-zinc-300 flex items-center gap-1"><Sword className="w-3 h-3" />{form.atk}</span>
                      <span className="text-red-400 flex items-center gap-1"><Heart className="w-3 h-3" />{form.hp}</span>
                      <span className="text-blue-400">💎{form.cost}</span>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 mt-1">
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2.5 bg-zinc-700 hover:bg-zinc-600 rounded-xl font-bold text-zinc-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!form.name.trim()}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-colors"
                  >
                    {editingId ? 'Salvar' : 'Adicionar'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Confirm Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center"
            >
              <RotateCcw className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <h3 className="text-lg font-black text-white mb-2">Restaurar deck padrão?</h3>
              <p className="text-sm text-zinc-400 mb-5">Todas as suas cartas customizadas serão removidas.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-2.5 bg-zinc-700 hover:bg-zinc-600 rounded-xl font-bold text-zinc-300 transition-colors">
                  Cancelar
                </button>
                <button onClick={handleReset} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 rounded-xl font-bold text-amber-950 transition-colors">
                  Restaurar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
