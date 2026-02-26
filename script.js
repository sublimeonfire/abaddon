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
   👁️ OLD WEB COUNTER
========================= */

const counterEl = document.getElementById("counter");

if(counterEl){

    let counter = 666 + Math.floor(Math.random()*120);
    counterEl.textContent = String(counter).padStart(6,"0");

    setInterval(()=>{
        if(Math.random() > 0.6){
            counter++;
            counterEl.textContent = String(counter).padStart(6,"0");
        }
    },4000);
}


/* =========================
   🎧 SIMPLE AMBIENT MUSIC
========================= */

const ambient = document.getElementById("ambient");

/* tenta autoplay */
window.addEventListener("load", ()=>{
    if(ambient){
        ambient.volume = 0.22;
        ambient.play().catch(()=>{});
    }
});

/* fallback (primeiro movimento) */
document.addEventListener("mousemove", ()=>{
    if(ambient && ambient.paused){
        ambient.play().catch(()=>{});
    }
},{once:true});
