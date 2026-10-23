import cv2, numpy as np, pickle
from PIL import Image
im=cv2.cvtColor(np.array(Image.open('vila-bg.webp').convert('RGB')),cv2.COLOR_RGB2BGR)
H,W=im.shape[:2]
B={'r1':(309,956,378,1031),'r2':(40,1146,108,1228),'r3':(304,510,338,554),'pa':(356,995,374,1040),'pb':(292,521,302,552),'p4':(230,804,252,852),'p5':(478,844,502,902),'p6':(420,1232,448,1288),'p7a':(440,677,456,713),'p7b':(458,708,470,755),'p7c':(472,703,496,746)}
out={}
for k,(x0,y0,x1,y1) in B.items():
    pad=14; X0,Y0,X1,Y1=max(0,x0-pad),max(0,y0-pad),min(W,x1+pad),min(H,y1+pad)
    crop=im[Y0:Y1,X0:X1].copy()
    hole=np.zeros(crop.shape[:2],np.uint8); hole[y0-Y0:y1-Y0,x0-X0:x1-X0]=255
    bg=cv2.inpaint(crop,hole,9,cv2.INPAINT_TELEA); bg=cv2.GaussianBlur(bg,(0,0),2.5)
    lab1=cv2.cvtColor(crop,cv2.COLOR_BGR2LAB).astype(np.float32); lab2=cv2.cvtColor(bg,cv2.COLOR_BGR2LAB).astype(np.float32)
    d=np.sqrt(((lab1-lab2)**2*np.array([1.4,1,1])).sum(2)); d[hole==0]=0
    d8=np.clip(d*6,0,255).astype(np.uint8)
    t,_=cv2.threshold(d8[hole>0],0,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU)
    fac={'r1':1.7,'r3':1.5}.get(k,0.8); m=((d8>t*fac)&(hole>0)).astype(np.uint8)
    m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(5,5)))
    n,lab,st,_=cv2.connectedComponentsWithStats(m,8)
    keep=np.zeros_like(m)
    if n>1:
        big=st[1:,cv2.CC_STAT_AREA].max()
        for i in range(1,n):
            if st[i,cv2.CC_STAT_AREA]>=big*0.12: keep|=(lab==i).astype(np.uint8)
    m=cv2.morphologyEx(keep,cv2.MORPH_CLOSE,np.ones((3,3),np.uint8))
    # preenche buracos
    cnts,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE); m2=np.zeros_like(m); cv2.drawContours(m2,cnts,-1,1,-1)
    out[k]=(X0,Y0,crop,m2)
pickle.dump(out,open('/tmp/sp/out.pkl','wb'))
tiles=[]
for k,(X0,Y0,crop,m) in out.items():
    a=cv2.GaussianBlur(m.astype(np.float32),(0,0),.6)[...,None]
    comp=(crop*a+np.full(crop.shape,(110,110,110),np.float32)*(1-a)).astype(np.uint8)
    tiles.append(cv2.resize(np.hstack([crop,comp]),None,fx=4,fy=4,interpolation=cv2.INTER_CUBIC))
def row(ts):
    h=max(t.shape[0] for t in ts); return np.hstack([np.pad(t,((0,h-t.shape[0]),(0,6),(0,0))) for t in ts])
rr=[row(tiles[:3]),row(tiles[3:7]),row(tiles[7:])]; w=max(r.shape[1] for r in rr)
cv2.imwrite('/tmp/sp/check2.png',np.vstack([np.pad(r,((0,6),(0,w-r.shape[1]),(0,0))) for r in rr]))
