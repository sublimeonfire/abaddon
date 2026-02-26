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

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img,0,0);

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
   😈 WHISPER SYSTEM
========================= */

const audio = document.getElementById("whisper");

/* WEB AUDIO */
const ctx = new (window.AudioContext || window.webkitAudioContext)();
const source = ctx.createMediaElementSource(audio);
const panner = ctx.createStereoPanner();
const gain = ctx.createGain();

source.connect(panner);
panner.connect(gain);
gain.connect(ctx.destination);

/* MOUSE STATE */
let lastMove = Date.now();

/* RANDOM DELAY */
function randomDelay(){
  return 5000 + Math.random()*10000; // 5s - 15s
}

/* PLAY WHISPER */
function playWhisper(){

  const pan = (Math.random()*2)-1;
  panner.pan.value = pan;

  gain.gain.value = 0.18 + Math.random()*0.22;

  audio.currentTime = Math.random()*2;

  if(ctx.state === "suspended") ctx.resume();

  audio.play();
}

/* DETECT MOVE */
document.addEventListener("mousemove", ()=>{
  lastMove = Date.now();
});

/* CREEPY LOOP */
setInterval(()=>{

  const idle = Date.now() - lastMove;

  if(idle > randomDelay()){
      playWhisper();
      lastMove = Date.now();
  }

},2000);
