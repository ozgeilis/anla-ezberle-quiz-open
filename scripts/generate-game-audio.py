"""Original deterministic synthesis. No recordings, samples, religious audio or external compositions."""
from pathlib import Path
import math, wave, struct, json, hashlib
ROOT = Path(__file__).resolve().parent.parent / 'assets/audio'
RATE = 24000
# Shared D major pentatonic palette; gentle mallets with inharmonic crystal partials.
D, E, FS, A, B = 293.6648, 329.6276, 369.9944, 440.0, 493.8833
CUES = {
    'tap': (.10, [(0, A, .075, .22)]),
    'select': (.24, [(0, D*2, .16, .32), (.055, A*2, .16, .18)]),
    'correct': (.68, [(0, D*2, .38, .44), (.105, FS*2, .40, .35), (.21, A*2, .43, .32)]),
    'wrong': (.42, [(0, E, .34, .34), (.09, D, .29, .28)]),
    'next': (.26, [(0, A, .17, .25), (.07, B, .17, .20)]),
    'timeout': (.52, [(0, FS, .34, .29), (.18, D, .30, .22)]),
    'completed': (1.38, [(0, D, .55, .32), (0, D*2, .47, .30), (.19, FS*2, .48, .32), (.38, A*2, .58, .31), (.67, B*2, .65, .25)]),
    'perfect': (1.88, [(0, D, .72, .27), (0, D*2, .49, .33), (.17, FS*2, .48, .29), (.34, A*2, .52, .28), (.55, B*2, .48, .24), (.79, D*3, .88, .31), (.79, FS*2, .88, .18)]),
    'badge': (.93, [(0, A*2, .43, .28), (.11, D*3, .65, .32), (.22, FS*2, .62, .22)]),
    'levelUp': (1.45, [(0, D, .77, .24), (0, D*2, .55, .30), (.19, A*2, .56, .31), (.4, B*2, .57, .26), (.62, D*3, .73, .28), (.62, A, .73, .17)]),
}
def mallet(t, f, length):
    if t < 0 or t >= length: return 0
    env = (1-math.exp(-t/0.009)) * math.exp(-t/(length*.25)) * min(1, (length-t)/.045)
    # Soft high partials, low-pass by construction. No harsh noise transients.
    return env*(math.sin(2*math.pi*f*t)+.19*math.sin(2*math.pi*f*2*t)*math.exp(-t/.10)+.065*math.sin(2*math.pi*f*3.01*t)*math.exp(-t/.055))
def write(name, samples):
    peak=max(abs(v) for v in samples) or 1
    # No normalization to loudness: music remains much quieter than feedback.
    ceiling=.56 if name!='music' else .20
    scale=(.18/peak) if name=="music" else min(1,ceiling/peak)
    data=b''.join(struct.pack('<h',round(max(-1,min(1,v*scale))*32767))for v in samples)
    path=ROOT/(name+'.wav')
    with wave.open(str(path),'wb')as f:
        f.setnchannels(1);f.setsampwidth(2);f.setframerate(RATE);f.writeframes(data)
    rms=math.sqrt(sum((v*scale)**2 for v in samples)/len(samples))
    return {'duration':len(samples)/RATE,'bytes':path.stat().st_size,'peak':round(peak*scale,4),'rms':round(rms,4),'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
def generate():
    ROOT.mkdir(parents=True,exist_ok=True);manifest={}
    for name,(duration,notes) in CUES.items():
        a=[sum(g*mallet(i/RATE-start,f,length)for start,f,length,g in notes)for i in range(round(duration*RATE))]
        manifest[name]=write(name,a)
    # Original 24-second seamless instrumental loop, periodic pads and soft sparse mallets.
    length=24; n=length*RATE; a=[]
    for i in range(n):
        t=i/RATE
        # Integer cycle counts ensure waveform continuity at the loop boundary.
        pad=sum(.017*math.sin(2*math.pi*round(f*length)*t/length)*(0.72+.28*math.cos(2*math.pi*t/length+phase))for f,phase in [(D/2,0),(A/2,1),(D,2),(FS,3)])
        notes=[(0,D,.046),(3,A,.038),(6,B,.040),(9,FS,.035),(12,E,.035),(15,A,.037),(18,FS,.038),(21,D,.043)]
        sparkle=sum(g*mallet((t-start)%length,f*2,2.4)for start,f,g in notes)
        a.append(pad+sparkle)
    manifest['music']=write('music',a)
    (ROOT/'manifest.json').write_text(json.dumps({'sampleRate':RATE,'channels':1,'format':'PCM16 WAV','origin':'Original project synthesis; no third-party samples','files':manifest},indent=2)+'\n')
    print('Generated',len(manifest),'original files;',sum(v['bytes']for v in manifest.values()),'bytes; no clipping.')
if __name__=='__main__':generate()
