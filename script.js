/* =========================
   🔥 ABADDON CONVERTER
========================= */

const fileInput = document.getElementById("fileInput")
const result = document.getElementById("result")

/* =========================
   🔥 TOAST
========================= */
function toast(msg,color="#00ff9c"){
    const t = document.createElement("div")
    t.textContent = msg
    t.style.position="fixed"
    t.style.bottom="20px"
    t.style.left="50%"
    t.style.transform="translateX(-50%)"
    t.style.background="black"
    t.style.border="1px solid red"
    t.style.padding="10px 18px"
    t.style.color=color
    t.style.fontFamily="VT323, monospace"
    t.style.zIndex="9999"
    t.style.boxShadow="0 0 15px red"

    document.body.appendChild(t)
    setTimeout(()=>t.remove(),2200)
}

/* =========================
   🔥 COUNTER (REAL)
========================= */
function updateCounter(qtd=1){
    let count = localStorage.getItem("abaddon_count") || 666
    count = parseInt(count) + qtd
    localStorage.setItem("abaddon_count",count)

    const el = document.getElementById("counter")
    if(el) el.textContent = String(count).padStart(6,"0")
}

window.addEventListener("DOMContentLoaded",()=>{
    const saved = localStorage.getItem("abaddon_count") || 666
    const el = document.getElementById("counter")
    if(el) el.textContent = String(saved).padStart(6,"0")
})

/* =========================
   🔥 PREVIEW GRID
========================= */
fileInput.addEventListener("change",previewFiles)

function previewFiles(){
    const files = [...fileInput.files]
    if(!files.length) return

    const grid = document.createElement("div")
    grid.style.display="grid"
    grid.style.gridTemplateColumns="repeat(3,1fr)"
    grid.style.gap="10px"
    grid.style.marginBottom="20px"

    files.forEach(file=>{
        const img = document.createElement("img")
        img.src = URL.createObjectURL(file)
        img.style.width="100%"
        img.style.border="1px solid #300"
        img.style.boxShadow="0 0 10px #300"
        grid.appendChild(img)
    })

    result.innerHTML=""
    result.appendChild(grid)
}

/* =========================
   🔥 DRAG & DROP
========================= */
const box = document.querySelector(".upload-box")

;["dragenter","dragover"].forEach(evt=>{
    box.addEventListener(evt,e=>{
        e.preventDefault()
        box.style.boxShadow="0 0 25px red"
    })
})

;["dragleave","drop"].forEach(evt=>{
    box.addEventListener(evt,e=>{
        e.preventDefault()
        box.style.boxShadow="none"
    })
})

box.addEventListener("drop",e=>{
    const dt = e.dataTransfer
    fileInput.files = dt.files
    previewFiles()
})

/* =========================
   🔥 CONVERT
========================= */
async function convert(){

    const files = [...fileInput.files]
    if(!files.length){
        toast("no entities selected","#ff4444")
        return
    }

    result.innerHTML="<p style='color:#ff4444'>converting...</p>"

    let converted = []

    for(const file of files){

        const img = new Image()
        img.src = URL.createObjectURL(file)

        await new Promise(res=>{
            img.onload = ()=>{
                const canvas = document.createElement("canvas")
                canvas.width = img.width
                canvas.height = img.height
                const ctx = canvas.getContext("2d")
                ctx.drawImage(img,0,0)

                canvas.toBlob(blob=>{
                    converted.push({
                        name:file.name.replace(".webp",".png"),
                        blob
                    })
                    res()
                },"image/png")
            }
        })
    }

    result.innerHTML=""

    converted.forEach(f=>{
        const a = document.createElement("a")
        a.href = URL.createObjectURL(f.blob)
        a.download = f.name
        a.textContent = "download "+f.name
        a.style.display="block"
        a.style.margin="6px"
        a.style.color="#00ff9c"
        result.appendChild(a)
    })

    updateCounter(converted.length)
    toast("ritual completed")
}
