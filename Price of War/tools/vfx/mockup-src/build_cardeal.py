"""Monta public/mockups/efeitos-cardeal/index.html reaproveitando o motor do mockup dos Mercenários (build_mock.py):
   roda-se a partir de public/mockups:  python3 ../../tools/vfx/mockup-src/build_cardeal.py"""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__)) + '/'
src = open(HERE + 'build_mock.py', encoding='utf8').read()
# cenas e auxiliares: os do mockup anterior vêm do repositório, não do scratchpad
src = re.sub(r"^S='[^']*'", f"S='{HERE}'", src, count=1, flags=re.M)
src = src.replace("open('efeitos-decks/index.html','w'", "os.makedirs('efeitos-cardeal', exist_ok=True); open('efeitos-cardeal/index.html','w'")
src = src.replace('Efeitos das cartas únicas', 'Efeitos do Cardeal')
src = src.replace('Mercenários (embaixo) contra Capitão (em cima). Toque num botão para ver o efeito. (Mockup: ainda não está no jogo.)', 'Cardeal (embaixo) contra Capitão (em cima). Toque num botão para ver o efeito. (Mockup: ainda não está no jogo.)')
# navegação: um único grupo de botões
a = src.index('<div class="tabs">'); b = src.index('<div id="opts">')
nav = '''<div class="grp on" id="g-c" style="display:grid">
      <button data-a="bencao">Cardeal Pedro<small>Comando: pilar de luz, +1 HP</small></button>
      <button data-a="calice">Cálice da Graça<small>relíquia: bênção em dose dupla</small></button>
      <button data-a="hospitalario">Cavaleiro Hospitalário<small>cura e cometa sagrado</small></button>
      <button data-a="nobre">Nobre da Cruzada<small>Convocação: sigilos e soldados</small></button>
      <button data-a="soldados">Soldados da Ordem<small>Reforço: desce com Escudo 2</small></button>
      <button data-a="comandante">Comandante da Ordem<small>Postura: trompa e +1/+1</small></button>
      <button data-a="retorno">Retorno do Soldado<small>a alma volta à mão</small></button>
      <button data-a="atirador">Atirador da Cruzada<small>Queda: penas e +2 cartas</small></button>
    </div>
    '''
src = src[:a] + nav + src[b:]
# tabuleiro
a = src.index('const CARDS = ['); b = src.index('];\nconst els')
cards = '''const CARDS = [
  [CAPD + 'comandante-aurelion-mestre-da-formacao', 195, ROW.eGen, 'big'],
  [CAPD + 'cavaleiro-tatico', COLX[1], ROW.eBack], [CAPD + 'capitao-de-formacao', COLX[2], ROW.eBack],
  [CAPD + 'escudeiro-de-linha', COLX[0], ROW.eFront], [CAPD + 'soldado-tatico', COLX[1], ROW.eFront], [CAPD + 'veterano-de-guerra', COLX[2], ROW.eFront], [CAPD + 'batedor', COLX[3], ROW.eFront], [CAPD + 'lanceiro-de-controle', COLX[4], ROW.eFront],
  [CAPD + 'devotos-da-cruzada', COLX[0], ROW.pFront], [CAPD + 'cavaleiro-hospitalario', COLX[1], ROW.pFront], [CAPD + 'cavaleiro-da-luz', COLX[2], ROW.pFront], [CAPD + 'comandante-da-ordem', COLX[3], ROW.pFront], [CAPD + 'recruta-devoto', COLX[4], ROW.pFront],
  [CAPD + 'soldados-da-ordem', COLX[0], ROW.pBack], [CAPD + 'nobre-da-cruzada', COLX[2], ROW.pBack], [CAPD + 'atirador-da-cruzada', COLX[4], ROW.pBack],
  [CAPD + 'cardeal-pedro-voz-da-fe', 195, ROW.pGen, 'big'],
'''
src = src[:a] + cards + src[b:]
# assets: os do mockup anterior ficam em ../efeitos-decks/, os novos aqui
src = src.replace(", 'fx-", ", '../efeitos-decks/fx-").replace(", 'proj-", ", '../efeitos-decks/proj-")
newloads = "load('pilar', 'fx-pilar.webp'), load('sigilo', 'fx-sigilo.webp'), load('sigilo_azul', 'fx-sigilo-azul.webp'), load('cruz', 'fx-cruz.webp'), load('escudo', 'fx-escudo.webp'), load('alma', 'fx-alma.webp'), load('penas', 'fx-penas.webp'), load('trompa', 'fx-trompa.webp'),\n  load('dagger', "
assert "load('dagger', " in src
src = src.replace("load('dagger', ", newloads, 1)
# cenas
src = src.replace("tail_scenes=open(S+'scenes_new.js',encoding='utf8').read()",
  "_n=open(S+'scenes_new.js',encoding='utf8').read(); tail_scenes=_n[:_n.index('// ══ cenas')]+open(S+'scenes_cardeal.js',encoding='utf8').read()")
src = src.replace("tail_b=open(S+'scenes_brecha.js',encoding='utf8').read()", "tail_b=''")
# o runner não tem abas
src = re.sub(r"document\.querySelectorAll\('\.tabs button'\)[^\n]*\n", "\n", src)
exec(compile(src, 'build_cardeal', 'exec'))
