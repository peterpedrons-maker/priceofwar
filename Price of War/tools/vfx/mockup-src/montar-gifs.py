import sys, json, glob, os
from PIL import Image
S='/tmp/claude-0/-home-user-priceofwar/53582eeb-f6be-53f8-9656-e04ea703ad88/scratchpad/'
FPS=15; W=340
def build(k):
    d=S+f'fr_{k}/'; m=json.load(open(d+'meta.json')); fr=m['frames']
    if not fr: print('sem quadros', k); return
    t0=m['t0']; T=fr[-1]['t']
    # o efeito começa em t0 (relógio do node) — a base do timestamp do screencast é outra: usa a diferença de quadros: começa 0.05 s antes do 1º quadro com mudança
    start=fr[0]['t']; end=T
    n=int((end-start)*FPS)
    ims=[]; j=0
    for q in range(n):
        tt=start+q/FPS
        while j+1<len(fr) and fr[j+1]['t']<=tt: j+=1
        im=Image.open(d+f"{fr[j]['i']:04d}.jpg").convert('RGB'); im=im.resize((W,int(im.height*W/im.width)),Image.LANCZOS); ims.append(im)
    mont=Image.new('RGB',(W*4,ims[0].height*2)); 
    for qi,ix in enumerate([int(x*(len(ims)-1)/7) for x in range(8)]): mont.paste(ims[ix],((qi%4)*W,(qi//4)*ims[0].height))
    pal=mont.quantize(colors=200,method=Image.Quantize.MEDIANCUT)
    q=[i.quantize(palette=pal,dither=Image.Dither.NONE) for i in ims]
    q[0].save(S+f'gifs/{k}.gif',save_all=True,append_images=q[1:],duration=int(1000/FPS),loop=0,optimize=False,disposal=1)
    print(k,len(ims),'quadros',os.path.getsize(S+f'gifs/{k}.gif')//1024,'KB')
for k in sys.argv[1:]: build(k)
