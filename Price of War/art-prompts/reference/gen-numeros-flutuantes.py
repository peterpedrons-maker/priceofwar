import numpy as np, random, math, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy import ndimage as ndi

FONT='/tmp/claude-0/-home-user-priceofwar/53582eeb-f6be-53f8-9656-e04ea703ad88/scratchpad/mock/cinzel-regular-DMUuCU8H.ttf'
OUT='/home/user/priceofwar/Price of War/src/assets/num'
os.makedirs(OUT,exist_ok=True)
# vertical gradient stops (top -> bottom) per kind
KINDS={
 'damage':   [(255,246,190),(255,184,64),(255,72,36),(190,18,18)],
 'heal':     [(240,255,214),(150,240,120),(50,190,70),(18,120,44)],
 'gold':     [(255,250,200),(255,222,90),(236,170,20),(160,96,0)],
 'goldspend':[(255,236,222),(255,170,140),(226,96,72),(150,40,34)],
 'shield':   [(246,252,255),(170,214,255),(84,150,235),(36,84,170)],
}
GLY='0123456789-+'
SS=2
FS=300
font=ImageFont.truetype(FONT,FS); font.set_variation_by_name('Black')
H=470; BASE=350; PAD=46
CAP_TOP=BASE-int(FS*0.70)  # approx cap height

def grad(h,stops,top,bot):
    ys=np.arange(h)
    t=np.clip((ys-top)/max(1,bot-top),0,1)
    seg=t*(len(stops)-1); i=np.minimum(seg.astype(int),len(stops)-2); f=seg-i
    cols=np.array(stops,float)
    c=cols[i]*(1-f)[:,None]+cols[i+1]*f[:,None]
    return c  # h x 3

def glyph(ch,kind):
    adv=int(font.getlength(ch))
    W=adv+2*PAD
    m=Image.new('L',(W,H),0)
    ImageDraw.Draw(m).text((PAD,BASE),ch,font=font,fill=255,anchor='ls')
    if ch in '-+':   # make the signs chunkier
        pass
    mk=np.array(m)>127
    # outline
    dout=ndi.distance_transform_edt(~mk)
    outline=dout<=24
    rim=(dout<=24)&(dout>14)
    # fill gradient
    col=grad(H,KINDS[kind],CAP_TOP,BASE)
    img=np.zeros((H,W,4),float)
    # outline layers: outer dark brown, then thin pale rim for readability on dark + bright backgrounds
    img[outline]=(26,10,6,255)
    pale=(dout<=10)&(dout>2)
    img[pale]=(255,236,190,255) if kind!='shield' else (225,240,255,255)
    img[...,3]=np.where(outline,255,0)
    dark=(dout<=24)&(dout>10)
    img[dark,:3]=(26,10,6)
    # fill
    fillc=np.repeat(col[:,None,:],W,axis=1)
    # bevel
    bl=ndi.gaussian_filter(mk.astype(float),7)
    gy,gx=np.gradient(bl)
    shade=np.clip((gx+gy)*-9,-1,1)   # light from top-left
    inner=ndi.distance_transform_edt(mk)
    edgew=np.clip(1-inner/18,0,1)
    shaded=fillc*(1+0.55*shade[...,None]*edgew[...,None])
    # soft gloss on upper half
    gl=np.clip(1-(np.arange(H)-CAP_TOP)/(0.5*(BASE-CAP_TOP)),0,1)[:,None]*0.20
    shaded=shaded+255*gl[...,None]*mk[...,None]
    img[mk,:3]=np.clip(shaded[mk],0,255)
    img[mk,3]=255
    im=Image.fromarray(img.astype('uint8'),'RGBA')
    im=im.filter(ImageFilter.GaussianBlur(0.8))
    im=im.resize((W//SS,H//SS),Image.LANCZOS)
    return im

names={'-':'minus','+':'plus'}
for kind in KINDS:
    for ch in GLY:
        glyph(ch,kind).save(f'{OUT}/{kind}-{names.get(ch,ch)}.webp',quality=92,method=6)

def burst(kind,pal,spikes,rin,rout,seed):
    random.seed(seed)
    N=512; c=N/2
    im=Image.new('RGBA',(N,N),(0,0,0,0))
    pts=[]
    for i in range(spikes*2):
        a=math.pi*i/spikes+random.uniform(-0.05,0.05)
        r=(rout if i%2==0 else rin)*random.uniform(0.86,1.06)
        pts.append((c+r*math.cos(a),c+r*math.sin(a)))
    m=Image.new('L',(N,N),0); ImageDraw.Draw(m).polygon(pts,fill=255)
    mk=np.array(m)>127
    d=ndi.distance_transform_edt(mk)
    yy,xx=np.mgrid[0:N,0:N]; rr=np.hypot(xx-c,yy-c)/rout
    arr=np.zeros((N,N,4),float)
    stops=np.array(pal,float)
    t=np.clip(rr,0,1)*(len(pal)-1); i=np.minimum(t.astype(int),len(pal)-2); f=t-i
    col=stops[i]*(1-f)[...,None]+stops[i+1]*f[...,None]
    arr[...,:3]=col; arr[...,3]=np.where(mk,255,0)
    out=ndi.distance_transform_edt(~mk)<=10
    arr[out&~mk]=(60,14,6,255)
    im=Image.fromarray(arr.astype('uint8'),'RGBA')
    # glow
    glow=im.filter(ImageFilter.GaussianBlur(18)); a=np.array(glow); a[...,3]=(a[...,3]*0.7).astype('uint8')
    base=Image.fromarray(a,'RGBA'); base.alpha_composite(im)
    base.resize((256,256),Image.LANCZOS).save(f'{OUT}/burst-{kind}.webp',quality=90,method=6)
burst('damage',[(255,255,235),(255,220,90),(255,110,30),(200,24,16)],11,120,238,3)
burst('heal',[(245,255,235),(170,245,140),(70,200,90),(30,140,60)],8,100,230,5)
burst('gold',[(255,255,235),(255,236,120),(240,180,30),(190,120,0)],8,70,236,7)
burst('shield',[(250,254,255),(190,225,255),(100,160,240),(50,100,190)],10,110,232,9)
print('ok')
