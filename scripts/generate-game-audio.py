"""Original quiz cues: procedural oscillators/transients, no recordings or borrowed themes."""
from pathlib import Path
import math, wave, struct, json, hashlib

ROOT = Path(__file__).resolve().parent.parent / 'assets/audio'
RATE = 24000
TAU = 2 * math.pi
# A warm struck-wood palette; original short signals, no background composition.
C, E, G, A = 261.6256, 329.6276, 391.9954, 440.0
CUES = {
    'tap': (.08, [(0, 340, .065, 1)]),
    'select': (.14, [(0, G, .10, 1), (.045, C*2, .09, .65)]),
    'correct': (.46, [(0, G, .19, .85), (.10, C*2, .35, 1), (.10, E, .32, .28)]),
    'wrong': (.32, [(0, 170, .14, 1), (.13, 135, .18, .9)]),
    'next': (.16, [(0, E, .10, .65), (.045, G, .11, .8)]),
    'timeout': (.44, [(0, 230, .12, 1), (.14, 230, .12, .9), (.28, 160, .15, 1)]),
    'completed': (1.10, [(0, C, .23, .85), (.13, E, .23, .8), (.26, G, .26, .85), (.43, C*2, .65, 1), (.43, E, .62, .35)]),
    'perfect': (1.55, [(0, C, .22, .8), (.12, E, .22, .8), (.24, G, .24, .85), (.38, A, .24, .8), (.55, C*2, .98, 1), (.55, E, .93, .35), (.55, G, .93, .3)]),
    'badge': (.75, [(0, E, .21, .8), (.12, G, .22, .8), (.27, C*2, .46, 1)]),
    'levelUp': (1.15, [(0, C, .22, .8), (.12, E, .22, .8), (.24, G, .25, .8), (.39, C*2, .74, 1), (.39, G, .70, .3)]),
}

def tone(t, frequency, length, warm=False):
    if t < 0 or t >= length:
        return 0
    # Damped resonant bodies, not sustained electronic beeps. Higher modes decay quickly.
    attack = min(1, t / .002)
    release = min(1, (length - t) / .035)
    envelope = attack * release * math.exp(-t / (length * .40))
    if warm:
        # Soft low drum with a small initial pitch drop, no harsh buzzer waveform.
        phase = TAU * frequency * (t + .0018 * (1-math.exp(-t/.012)))
        return envelope * (math.sin(phase) + .28*math.sin(phase*.50)*math.exp(-t/.08)
                           + .10*math.sin(phase*2.13)*math.exp(-t/.018))
    phase = TAU * frequency * t
    return envelope * (math.sin(phase) + .42*math.sin(phase*.50)*math.exp(-t/.14)
                       + .25*math.sin(phase*2.76)*math.exp(-t/.024)
                       + .08*math.sin(phase*5.40)*math.exp(-t/.009))

def tick(t):
    # Original clock escapement: a wooden body and a softer mechanical return.
    def impulse(x, frequency, decay):
        if x < 0:
            return 0
        envelope = (1-math.exp(-x/.001)) * math.exp(-x/decay)
        return envelope * (math.sin(TAU*frequency*x) + .32*math.sin(TAU*frequency*2.37*x))
    return impulse(t, 720, .024) + .62*impulse(t-.027, 490, .020)

def write(name, samples):
    # Remove DC; taper both endpoints and normalize each cue to a bounded level.
    mean = sum(samples) / len(samples)
    samples = [(v-mean)*min(1, i/(RATE*.001), (len(samples)-1-i)/(RATE*.006))
               for i, v in enumerate(samples)]
    scale = (.50 if name == 'tick' else .56) / (max(abs(v) for v in samples) or 1)
    pcm = [round(v * scale * 32767) for v in samples]
    data = struct.pack('<'+'h'*len(pcm), *pcm)
    path = ROOT / (name+'.wav')
    with wave.open(str(path), 'wb') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(RATE); f.writeframes(data)
    return {'duration': len(pcm)/RATE, 'bytes': path.stat().st_size,
            'peak': round(max(abs(v) for v in pcm)/32767, 4),
            'rms': round(math.sqrt(sum((v/32767)**2 for v in pcm)/len(pcm)), 4),
            'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}

def generate():
    ROOT.mkdir(parents=True, exist_ok=True)
    manifest = {}
    for name, (duration, notes) in CUES.items():
        samples = [sum(g * tone(i/RATE-start, f, length, name in ('wrong', 'timeout'))
                       for start, f, length, g in notes)
                   for i in range(round(duration*RATE))]
        manifest[name] = write(name, samples)
    manifest['tick'] = write('tick', [tick(i/RATE) for i in range(round(.12*RATE))])
    (ROOT/'manifest.json').write_text(json.dumps({
        'sampleRate': RATE, 'channels': 1, 'format': 'PCM16 WAV',
        'origin': 'Original project synthesis; no third-party samples', 'files': manifest,
    }, indent=2)+'\n')
    print('Generated', len(manifest), 'original cues;', sum(v['bytes'] for v in manifest.values()), 'bytes')

if __name__ == '__main__':
    generate()
