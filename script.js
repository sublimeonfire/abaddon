/* =========================
   🔥 CONVERTER ABADDON
========================= */

async function convert(){

    const files = document.getElementById('fileInput').files;
    const result = document.getElementById('result');

    if(!files.length){
        alert("Select WEBP files");
        return;
    }

    result.innerHTML = "<p style='color:#ff4444'>Invoking conversion ritual...</p>";

    const zip = new JSZip();
    let count = 0;

    for(const file of files){

        const img = new Image();
        img.src = URL.createObjectURL(file);

        await new Promise(resolve=>{
            img.onload = ()=>{

                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx2 = canvas.getContext("2d");
                ctx2.drawImage(img,0,0);

                const png = canvas.toDataURL("image/png");

                zip.file(
                    file.name.replace(".webp",".png"),
                    png.split(',')[1],
                    {base64:true}
                );

                count++;
                result.innerHTML =
                  `<p style="color:#ff4444">Converted ${count}/${files.length} souls...</p>`;

                resolve();
            }
        });
    }

    result.innerHTML = "<p style='color:#ff4444'>Sealing archive...</p>";

    zip.generateAsync({type:"blob"}).then(content=>{

        const a = document.createElement("a");
        a.href = URL.createObjectURL(content);
        a.download = "ABADDON_COLLECTION.zip";
        a.click();

        result.innerHTML =
          "<p style='color:#00ff9c'>Archive manifested.</p>";

    });
}


/* =========================
   😈 AUDIO SYSTEM
========================= */

const whisper = document.getElementById("whisper");
const ambient = document.getElementById("ambient");

/* WebAudio contexto */
const ctx = new (window.AudioContext || window.webkitAudioContext)();

/* Whisper binaural */
const whisperSource = ctx.createMediaElementSource(whisper);
const panner = ctx.createStereoPanner();
const whisperGain = ctx.createGain();

whisperSource.connect(panner);
panner.connect(whisperGain);
whisperGain.connect(ctx.destination);

let lastMove = Date.now();

function randomDelay(){
  return 5000 + Math.random()*10000;
}

function playWhisper(){

  if(ambient) ambient.volume *= 0.4;

  const pan = (Math.random()*2)-1;
  panner.pan.value = pan;

  whisperGain.gain.value = 0.18 + Math.random()*0.22;
  whisper.currentTime = Math.random()*2;

  if(ctx.state === "suspended") ctx.resume();

  whisper.play();

  setTimeout(()=>{
    if(ambient) ambient.volume = 0.22;
  },3000);
}

document.addEventListener("mousemove", ()=>{
  lastMove = Date.now();
});

setInterval(()=>{

  const idle = Date.now() - lastMove;

  if(idle > randomDelay()){
      playWhisper();
      lastMove = Date.now();
  }

},2000);


/* =========================
   🎧 AMBIENT ENGINE
========================= */

let reverb, reverbGain;

async function setupReverb(){

  if(!ambient) return;

  reverb = ctx.createConvolver();
  reverbGain = ctx.createGain();
  reverbGain.gain.value = 0.10;

  const len = ctx.sampleRate * 2;
  const impulse = ctx.createBuffer(2, len, ctx.sampleRate);

  for(let ch=0; ch<2; ch++){
    const data = impulse.getChannelData(ch);
    for(let i=0;i<len;i++){
      data[i]=(Math.random()*2-1)*(1-i/len);
    }
  }

  reverb.buffer = impulse;

  const ambientSource = ctx.createMediaElementSource(ambient);
  ambientSource.connect(ctx.destination);
  ambientSource.connect(reverb);
  reverb.connect(reverbGain);
  reverbGain.connect(ctx.destination);
}

function fadeInAmbient(){

    if(!ambient) return;

    ambient.volume = 0;
    ambient.play().catch(()=>{});

    let v = 0;

    const f = setInterval(()=>{
        v += 0.01;
        ambient.volume = v;
        if(v >= 0.22) clearInterval(f);
    },120);
}

/* start após loader */
window.addEventListener("load", async ()=>{

  setTimeout(async ()=>{

      if(ctx.state === "suspended") await ctx.resume();

      await setupReverb();
      fadeInAmbient();

  },3000);

});

/* autoplay unlock */
document.addEventListener("click", ()=>{
    fadeInAmbient();
},{once:true});
