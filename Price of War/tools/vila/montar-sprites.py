import cv2, numpy as np, pickle, json
from PIL import Image
im=cv2.cvtColor(np.array(Image.open('vila-bg.webp').convert('RGB')),cv2.COLOR_RGB2BGR); H,W=im.shape[:2]
out=pickle.load(open('/tmp/sp/out.pkl','rb'))
use={'r2':'rider_a','p4':'p_azul','p5':'p_capuz','p6':'p_ferreiro','p7a':'p_guarda'}
limit={'r3':(304,505,338,554)}   # só a área do cavaleiro (exclui o vizinho)
union=np.zeros((H,W),np.uint8); meta={}
for k,name in use.items():
    X0,Y0,crop,m=out[k]
    if k=='r1':   # exclui o vizinho (a pessoa à direita embaixo)
        lim=np.zeros_like(m); gy=lambda y:y-Y0; gx=lambda x:x-X0
        lim[gy(956):gy(992),:]=1; lim[gy(992):gy(1031),gx(309):gx(354)]=1; m=m&lim
        n,lab,st,_=cv2.connectedComponentsWithStats(m,8)
        if n>1: m=(lab==1+np.argmax(st[1:,cv2.CC_STAT_AREA])).astype(np.uint8)
    if k in limit:
        x0,y0,x1,y1=limit[k]; lim=np.zeros_like(m); lim[y0-Y0:y1-Y0,x0-X0:x1-X0]=1; m=m&lim
        n,lab,st,_=cv2.connectedComponentsWithStats(m,8)
        if n>1: m=(lab==1+np.argmax(st[1:,cv2.CC_STAT_AREA])).astype(np.uint8)
    ys,xs=np.where(m>0); bx0,bx1,by0,by1=xs.min(),xs.max()+1,ys.min(),ys.max()+1
    union[Y0+by0:Y0+by1,X0+bx0:X0+bx1]|=m[by0:by1,bx0:bx1]
    pad=2; sx0,sy0=max(0,bx0-pad),max(0,by0-pad); sx1,sy1=min(m.shape[1],bx1+pad),min(m.shape[0],by1+pad)
    sub=crop[sy0:sy1,sx0:sx1]; msk=m[sy0:sy1,sx0:sx1].astype(np.float32)
    msk=cv2.GaussianBlur(msk,(0,0),.55)
    # reforça contorno: encolhe levemente o alfa para não puxar o fundo
    msk=np.clip((msk-.15)/.7,0,1)
    rgba=np.dstack([cv2.cvtColor(sub,cv2.COLOR_BGR2RGB),(msk*255).astype(np.uint8)])
    Image.fromarray(rgba).save(f'spr-{name}.png')
    meta[name]={'w':int(sx1-sx0),'h':int(sy1-sy0),'fx':float((bx0+bx1)/2-sx0),'fy':float(by1-sy0)}   # pé = base do recorte, centro
# remove os originais da pintura (inpaint) para não duplicar
extra=np.zeros((H,W),np.uint8); extra[956:1032,306:380]=1; extra[992:1040,352:380]=0; union=union|extra
hole=cv2.dilate(union,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(7,7)))*255
bg=cv2.inpaint(im,hole,6,cv2.INPAINT_TELEA)
Image.fromarray(cv2.cvtColor(bg,cv2.COLOR_BGR2RGB)).save('vila-bg-limpo.webp',quality=90)
json.dump(meta,open('spr-meta.json','w'))
print(meta)
# conferência antes/depois dos buracos
tiles=[]
for k in use:
    X0,Y0,crop,m=out[k]; h,w=crop.shape[:2]
    a=im[Y0:Y0+h,X0:X0+w]; b=bg[Y0:Y0+h,X0:X0+w]
    tiles.append(cv2.resize(np.hstack([a,b]),None,fx=3,fy=3,interpolation=cv2.INTER_CUBIC))
def row(ts):
    hh=max(t.shape[0] for t in ts); return np.hstack([np.pad(t,((0,hh-t.shape[0]),(0,6),(0,0))) for t in ts])
rr=[row(tiles[:3]),row(tiles[3:])]; w=max(r.shape[1] for r in rr)
cv2.imwrite('/tmp/sp/patch.png',np.vstack([np.pad(r,((0,6),(0,w-r.shape[1]),(0,0))) for r in rr]))
