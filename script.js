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
   🎬 VIDEO SUMMON (NO BACKEND)
========================= */

async function summonVideo(){

    const url = document.getElementById("videoUrl").value.trim()
    const wrap = document.querySelector(".video-wrap")
    const dl = document.getElementById("videoDownload")
    const result = document.getElementById("result")

    if(!url){
        alert("Paste URL")
        return
    }

    result.innerHTML = "<p style='color:#ff4444'>Opening portal...</p>"

    wrap.innerHTML = ""
    dl.style.display="none"

    /* ================= REDDIT ================= */
    if(url.includes("reddit.com")){

        const embed = document.createElement("iframe")

        embed.src = url.replace("www.reddit.com","www.redditmedia.com")
        embed.style.width="100%"
        embed.style.height="420px"
        embed.style.border="2px solid #6b0000"
        embed.style.background="black"

        wrap.appendChild(embed)

        dl.href = url
        dl.innerHTML = "<button>OPEN SOURCE</button>"
        dl.target="_blank"
        dl.style.display="inline-block"

        result.innerHTML = "<p style='color:#00ff9c'>Portal manifested.</p>"
        return
    }

    /* ================= TWITTER ================= */
    if(url.includes("twitter") || url.includes("x.com")){

        const block = document.createElement("blockquote")
        block.className="twitter-tweet"
        block.style.background="black"

        const a = document.createElement("a")
        a.href = url
        block.appendChild(a)

        wrap.appendChild(block)

        const script = document.createElement("script")
        script.src="https://platform.twitter.com/widgets.js"
        script.async=true
        document.body.appendChild(script)

        dl.href = url
        dl.innerHTML = "<button>OPEN SOURCE</button>"
        dl.target="_blank"
        dl.style.display="inline-block"

        result.innerHTML = "<p style='color:#00ff9c'>Portal manifested.</p>"
        return
    }

    /* ================= UNKNOWN ================= */
    result.innerHTML = "<p style='color:red'>Unknown entity.</p>"
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
