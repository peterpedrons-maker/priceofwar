/**
 * CardFace — Molde unificado de carta usado em todo o jogo.
 * Usa template.png como moldura e fonte Cinzel para textos.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardData, CardType } from '../App';
import cardTemplate from '../assets/template.png';
import emboscadaTemplate from '../assets/template-emboscada.png';

// ---------------------------------------------------------------------------
// Fonte fantasy para os números/textos das cartas
// ---------------------------------------------------------------------------
const CARD_FONT = "'Cinzel', serif";
const TITLE_FONT = "'Marcellus', serif";
const BODY_FONT = "'Playfair Display', ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";
const NUMBER_FONT = "'Cinzel', serif";

// ---------------------------------------------------------------------------
// Badges de stat — gradiente dourado estiloso
// ---------------------------------------------------------------------------

const GoldText = ({ value, className = '' }: { value: number; className?: string }) => (
  <span
    style={{ 
      fontFamily: NUMBER_FONT,
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FDE08B 30%, #D4AF37 60%, #AA7200 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,1)) drop-shadow(0px 0px 4px rgba(0,0,0,0.8))'
    }}
    className={`flex items-center justify-center font-black leading-none ${className}`}
  >
    {value}
  </span>
);


function AutoResizeText({ text, defaultFontSize = 10.5, minFontSize = 5.5, isReliquia = false }: { text: string, defaultFontSize?: number, minFontSize?: number, isReliquia?: boolean }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLParagraphElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;

    let fontSize = defaultFontSize;
    textEl.style.fontSize = `${fontSize}px`;

    // Wait slightly for browser render then loop to shrink text if overflowing
    const resize = () => {
      while (
        (textEl.scrollHeight > container.clientHeight || textEl.scrollWidth > container.clientWidth) &&
        fontSize > minFontSize
      ) {
        fontSize -= 0.3;
        textEl.style.fontSize = `${fontSize}px`;
      }
    };
    
    // using requestAnimationFrame or zero-timeout allows the text to render first at default size
    requestAnimationFrame(resize);
  }, [text, defaultFontSize, minFontSize]);

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center w-full h-full p-[2px]">
      <p
        ref={textRef}
        style={{ 
          fontFamily: BODY_FONT, 
          lineHeight: '1.2',
          ...(isReliquia ? {
            color: '#b8860b',
            textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 0 5px rgba(212,175,55,0.8)',
            fontWeight: '900'
          } : {})
        }}
        className={`${isReliquia ? '' : 'text-[#0d0901]'} font-semibold text-center whitespace-normal break-words m-0`}
      >
        {text}
      </p>
    </div>
  );
}

export const ManaBadge = ({ value, className = '' }: { value: number; className?: string }) => (
  <GoldText value={value} className={className} />
);

export const AtkBadge = ({ value, className = '' }: { value: number; className?: string }) => (
  <GoldText value={value} className={className} />
);

export const HpBadge = ({ value, className = '' }: { value: number; className?: string }) => (
  <GoldText value={value} className={className} />
);

// ---------------------------------------------------------------------------
// Variáveis de tamanho por contexto
// ---------------------------------------------------------------------------

const VARIANTS = {
  hand: {
    // Reduzi ainda mais a fonte conforme solicitado (text-xs -> text-[10px])
    nameText: 'text-[11px] font-bold uppercase tracking-tight',
    // Reduzi ainda mais a fonte da descrição (text-[9px] -> text-[8px])
    effectText: 'text-[8px] leading-tight',
    typeText: 'text-[10px]',
    manaText: 'text-xl',
    atkHpText: 'text-xl',
    noArtText: 'text-xs',
  },
  field: {
    nameText: 'text-[7px] md:text-[9px] font-bold uppercase tracking-tight',
    effectText: 'text-[6px] md:text-[8px] leading-[1.1] md:leading-tight',
    typeText: 'text-[6px] md:text-[9px]',
    manaText: 'text-xs md:text-sm',
    atkHpText: 'text-xs md:text-sm',
    noArtText: 'text-[8px] md:text-[10px]',
  },
  modal: {
    nameText: 'text-lg font-bold uppercase tracking-tight',
    effectText: 'text-sm leading-relaxed',
    typeText: 'text-base',
    manaText: 'text-3xl',
    atkHpText: 'text-3xl',
    noArtText: 'text-sm',
  },
  preview: {
    nameText: 'text-[9px] font-bold uppercase tracking-tight',
    effectText: 'text-[7px] leading-tight',
    typeText: 'text-[8px]',
    manaText: 'text-sm',
    atkHpText: 'text-sm',
    noArtText: 'text-[9px]',
  },
} as const;

export type CardVariant = keyof typeof VARIANTS;

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export interface CardFaceProps {
  card: CardData;
  variant?: CardVariant;
  onInfoClick?: (card: CardData) => void;
  isSelected?: boolean;
  children?: React.ReactNode;
}

/*
  O template.png preenche o container inteiramente.
  O container já tem o aspect-ratio correto da carta (905/1287).
  Usamos inset-0 + object-fill para cobrir sem gaps.
*/

export const CardFace: React.FC<CardFaceProps> = ({
  card,
  variant = 'hand',
  onInfoClick,
  isSelected,
  children,
}) => {
  const v = VARIANTS[variant];
  const isSpellType = card.cardType === 'Emboscada' || card.cardType === 'Tática';
  
  let templateImg = cardTemplate;
  if (card.cardType === 'Emboscada' || card.cardType === 'Tática') {
    templateImg = emboscadaTemplate;
  }

  return (
    <>
      {/* Fundo da carta — necessário para templates sem background próprio */}
      {isSpellType && (
        <div
          className="absolute z-[1] pointer-events-none rounded-sm"
          style={{
            width: '100%',
            height: '100%',
            top: '0',
            left: '0',
            background: 'radial-gradient(ellipse at 50% 30%, #2a1a08 0%, #120a02 70%, #0a0500 100%)',
          }}
        />
      )}
      {/* Sistema de coordenadas idêntico ao template da moldura */}
      <div 
        className="absolute z-[2] pointer-events-none origin-center"
        style={{
          width: '122%',
          height: '145.5%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -46%)'
        }}
      >
        {/* Arte da carta — Ancorada nos exatos % da janela transparente do template */}
        <div
          className="absolute overflow-hidden pointer-events-auto"
          style={{ left: '11.52%', top: '17.64%', width: '76.95%', height: '31.83%' }}
        >
          {card.art ? (
            <img
              src={card.art}
              alt={card.name}
              className="w-full h-full object-cover"
              style={{ filter: 'contrast(1.1) saturate(1.2) brightness(1.05)' }}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#3a1b00] to-[#1a0b00] flex items-center justify-center">
              <span className={`${v.noArtText} text-zinc-600 font-mono italic uppercase opacity-50`}>No Art</span>
            </div>
          )}
        </div>
      </div>

      {/* Moldura do template — Escala exata do container menos a borda */}
      <img
        src={templateImg}
        alt=""
        aria-hidden
        className="absolute z-[3] pointer-events-none max-w-none origin-center"
        style={{
          width: '122%',
          height: '145.5%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -46%)'
        }}
      />

      {/* Conteúdo (z-10) */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none" 
        style={{ fontFamily: CARD_FONT }}
      >

        {/* ── Nome ── Placa do nameplate no topo do template */}
        <div
          className="absolute flex items-center justify-center"
          style={{ top: '0%', left: '12%', right: '22%', height: '8%' }}
        >
          <svg viewBox="0 0 100 20" preserveAspectRatio="xMidYMid meet" className="w-full h-full overflow-visible">
            <text 
              x="50" y="13" 
              textAnchor="middle" 
              fontSize="12.5" 
              fontFamily={TITLE_FONT} 
              fontWeight="bold" 
              fill={card.cardType === 'Relíquia' ? '#FFD700' : '#FDE08B'}
              letterSpacing="0.06em"
              textLength={card.name.length > 10 ? "96" : undefined}
              lengthAdjust={card.name.length > 10 ? "spacingAndGlyphs" : undefined}
              style={{ 
                filter: card.cardType === 'Relíquia' 
                  ? 'drop-shadow(0 2px 2px rgba(0,0,0,1)) drop-shadow(0 0 8px rgba(255,200,0,0.9))' 
                  : 'drop-shadow(0 2px 2px rgba(0,0,0,1)) drop-shadow(0 0 5px rgba(139,69,19,0.8))' 
              }}
            >
              {card.name.toUpperCase()}
            </text>
          </svg>
        </div>

        {/* ── Custo (Ouro) ── Mapeado perfeitamente pro buraco redondo superior direito */}
        <div
          className="absolute flex items-center justify-center"
          style={{ left: '92%', top: '2.5%', transform: 'translate(-50%, -50%)', scale: '1.1' }}
        >
          <ManaBadge value={card.cost} className={v.manaText} />
        </div>

        {/* ── Tipo da Carta ── Faixa/retângulo dourado entre arte e área de texto */}
        {card.cardType && (
          <div
            className="absolute flex items-center justify-center"
            style={{
              top: isSpellType ? '54.5%' : '56%',
              left: '12%',
              right: '12%',
              height: '7%',
            }}
          >
            <svg viewBox="0 0 100 20" preserveAspectRatio="xMidYMid meet" className="w-full h-full overflow-visible">
              <text
                x="50" y="15"
                textAnchor="middle"
                fontSize="12"
                fontFamily="'Cinzel Decorative', serif"
                fontWeight="900"
                fill={
                  card.cardType === 'Relíquia' ? '#FFD700' :
                  card.cardType === 'Terreno'  ? '#86EFAC' :
                  '#FDE08B'
                }
                letterSpacing="0.15em"
                textLength={card.cardType.length > 10 ? "96" : undefined}
                lengthAdjust={card.cardType.length > 10 ? "spacingAndGlyphs" : undefined}
                style={{
                  filter: card.cardType === 'Relíquia'
                    ? 'drop-shadow(0 2px 2px rgba(0,0,0,1)) drop-shadow(0 0 6px rgba(255,200,0,0.9))'
                    : card.cardType === 'Terreno'
                    ? 'drop-shadow(0 2px 2px rgba(0,0,0,1)) drop-shadow(0 0 6px rgba(50,180,80,0.85))'
                    : 'drop-shadow(0 2px 2px rgba(0,0,0,1)) drop-shadow(0 0 5px rgba(139,69,19,0.8))'
                }}
              >
                {card.cardType.toUpperCase()}
              </text>
            </svg>
          </div>
        )}

        {/* ── Efeito ── Área de texto do pergaminho no template */}
        <div
          className="absolute flex items-center justify-center p-1"
          style={{ top: '64%', bottom: '10%', left: '11%', right: '11%' }}
        >
          <svg
            viewBox="0 0 120 45"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
            style={{ overflow: 'visible' }}
          >
            <foreignObject x="0" y="0" width="120" height="45">
                <AutoResizeText text={card.effect || '—'} isReliquia={card.cardType === 'Relíquia'} />
              </foreignObject></svg></div>

        {/* ── ATK ── Emblema escudo/espada esquerdo inferior */}
        {!(isSpellType && card.atk === 0) && (
          <div
            className="absolute flex items-center justify-center"
            style={{ left: '1%', bottom: '-2%', width: '20%', height: '13%' }}
          >
            <AtkBadge value={card.atk} className={v.atkHpText} />
          </div>
        )}

        {/* ── HP ── Emblema coração direito inferior */}
        {!(isSpellType && card.hp === 0) && (
          <div
            className="absolute flex items-center justify-center"
            style={{ right: '0%', bottom: '-2%', width: '20%', height: '13%' }}
          >
            <HpBadge value={card.hp} className={v.atkHpText} />
          </div>
        )}
      </div>

      {/* Overlays extras */}
      {children}
    </>
  );
};
