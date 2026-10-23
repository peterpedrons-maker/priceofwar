from PIL import Image, ImageFilter
import numpy as np, json, collections
src='/root/.claude/uploads/53582eeb-f6be-53f8-9656-e04ea703ad88/8a639484-image.jpg'
im=Image.open(src).convert('RGB'); W,H=im.size
a=np.array(im).astype(float)
s=(np.minimum(a[...,0],a[...,2])-a[...,1])/255.0
bgall=(s>0.30)&(a[...,0]>140)&(a[...,2]>140)
names=['ferro','bronze','prata','ouro','platina','diamante','mestre','senhor-da-guerra']
cols=[(0,W//4),(W//4,W//2),(W//2,3*W//4),(3*W//4,W)]; rows=[(0,H//2),(H//2,H)]
def comp_of(mask,seed):
    h,w=mask.shape; out=np.zeros_like(mask); dq=collections.deque([seed]); out[seed[1],seed[0]]=True
    while dq:
        x,y=dq.popleft()
        for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
            nx,ny=x+dx,y+dy
            if 0<=nx<w and 0<=ny<h and mask[ny,nx] and not out[ny,nx]: out[ny,nx]=True; dq.append((nx,ny))
    return out
k=0
for r in rows:
  for c in cols:
    cell=bgall[r[0]:r[1],c[0]:c[1]]; op=~cell; mid=op.shape[0]//2
    xs=np.where(op[mid])[0]
    comp=comp_of(op,(int(xs[0]),mid))
    ys,xs=np.where(comp); m=12
    y0,y1,x0,x1=ys.min()+r[0],ys.max()+r[0]+1,xs.min()+c[0],xs.max()+c[0]+1
    cy0,cy1,cx0,cx1=max(0,y0-m),min(H,y1+m),max(0,x0-m),min(W,x1+m)
    ca=np.array(im.crop((cx0,cy0,cx1,cy1))).astype(float)
    full=np.zeros((H,W),bool); full[r[0]:r[1],c[0]:c[1]]=comp
    body=full[cy0:cy1,cx0:cx1]; h,w=body.shape; notbody=~body
    outer=comp_of(notbody,(0,0))
    cand=notbody&~outer; ys2,xs2=np.where(cand)
    j=np.argmin((xs2-w/2)**2+(ys2-h/2)**2)
    hole=comp_of(cand,(int(xs2[j]),int(ys2[j])))
    pockets=cand&~hole
    ysh,xsh=np.where(hole); hcx,hcy=xsh.mean(),ysh.mean()
    # hole radius = median distance from the centre to the hole's edge (the gem pokes into the hole and would skew a minimum)
    edge=hole&~np.array(Image.fromarray((hole*255).astype('uint8')).filter(ImageFilter.MinFilter(3)))>0
    ye,xe=np.where(edge); rin=float(np.median(np.sqrt((xe-hcx)**2+(ye-hcy)**2)))
    alive=body|pockets
    col=ca.copy()
    if pockets.any():
        bl=np.array(Image.fromarray((body*255).astype('uint8')).filter(ImageFilter.BoxBlur(6))).astype(float)/255+1e-6
        for ch in range(3):
            cch=np.array(Image.fromarray((ca[...,ch]*body).astype('uint8')).filter(ImageFilter.BoxBlur(6))).astype(float)
            col[...,ch]=np.where(pockets,cch/bl,ca[...,ch])
    al=Image.fromarray((alive*255).astype('uint8')).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
    alf=np.array(al).astype(float)/255
    near=np.array(Image.fromarray((~alive).astype('uint8')*255).filter(ImageFilter.MaxFilter(7)))>0
    exc=np.clip((col[...,0]+col[...,2])/2-col[...,1],0,None); sp=near&(exc>25)
    col[...,0]=np.where(sp,col[...,0]-0.85*exc,col[...,0]); col[...,2]=np.where(sp,col[...,2]-0.85*exc,col[...,2])
    img=Image.fromarray(np.dstack([np.clip(col,0,255),alf*255]).astype('uint8'),'RGBA')
    side=int(rin*2*3.0)
    cv=Image.new('RGBA',(side,side),(0,0,0,0)); cv.paste(img,(int(round(side/2-hcx)),int(round(side/2-hcy))))
    cv=cv.resize((288,288),Image.LANCZOS); cv.save(f'src/assets/ligas/{names[k]}.webp',quality=94)
    print(names[k],'rin',round(rin,1),'side',side,'pockets',int(pockets.sum()),'hole',int(hole.sum())); k+=1
