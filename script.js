/* =========================
   🎧 ABADDON AMBIENT ENGINE
========================= */

const ambient = document.getElementById("ambient");

/* reverb leve */
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

/* fade in ambient */
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

/* ducking quando whisper toca */
const originalWhisper = playWhisper;

playWhisper = function(){

    if(ambient) ambient.volume *= 0.4;

    originalWhisper();

    setTimeout(()=>{
        if(ambient) ambient.volume = 0.22;
    },3000);
};

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
