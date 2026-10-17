import json,subprocess,os
S=os.path.dirname(os.path.abspath(__file__)); os.chdir(S)
m=json.load(open('rec-marks.json'))[1:]; fr=sorted(json.load(open('rec-frames.json')))
os.makedirs('clips',exist_ok=True)
for i,(n,t) in enumerate(m[:-1]):
    end=m[i+1][1]; e=end if i==len(m)-2 else end-2.6; e=min(e,t+14); s=t-1.3
    sel=[(ts,p) for ts,p in fr if s<=ts<=e+0.001]
    if len(sel)<3: print('POUCOS',n,len(sel)); continue
    lines=[]
    for k,(ts,p) in enumerate(sel):
        d=(sel[k+1][0] if k+1<len(sel) else e)-ts
        lines.append(f"file '{S}/{p[len(S)+1:] if p.startswith(S) else p}'\nduration {max(d,0.001):.4f}")
    lines.append(f"file '{S}/{sel[-1][1][len(S)+1:] if sel[-1][1].startswith(S) else sel[-1][1]}'")
    open('list.txt','w').write('\n'.join(lines))
    subprocess.run(['ffmpeg','-loglevel','error','-y','-f','concat','-safe','0','-i','list.txt','-vf','fps=30,scale=540:-2','-c:v','libx264','-pix_fmt','yuv420p','-crf','24','-an',f'clips/{n}.mp4'])
    print(n, round(e-s,1), len(sel))
