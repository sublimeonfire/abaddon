/* =========================
   🔥 ABADDON CONVERTER
========================= */

const fileInput = document.getElementById("fileInput")
const result = document.getElementById("result")

/* =========================
   🔥 TOAST
========================= */
function toast(msg,color="#00ff9c"){
    const t=document.createElement("div")
    t.textContent=msg
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
   🔥 COUNTER
========================= */
function updateCounter(qtd=1){
    let count=localStorage.getItem("abaddon_count")||666
    count=parseInt(count)+qtd
    localStorage.setItem("abaddon_count",count)
    const el=document.getElementById("counter")
    if(el) el.textContent=String(count).padStart(6,"0")
}

window.addEventListener("DOMContentLoaded",()=>{
    const saved=localStorage.getItem("abaddon_count")||666
    const el=document.getElementById("counter")
    if(el) el.textContent=String(saved).padStart(6,"0")
})

/* fake global growth */
setInterval(()=>{
 let c=parseInt(localStorage.getItem("abaddon_count")||666)
 c+=Math.floor(Math.random()*3)
 localStorage.setItem("abaddon_count",c)
 const el=document.getElementById("counter")
 if(el) el.textContent=String(c).padStart(6,"0")
},4000)

/* =========================
   🔥 PREVIEW
========================= */
fileInput.addEventListener("change",previewFiles)

function previewFiles(){
    const files=[...fileInput.files]
    if(!files.length) return

    const grid=document.createElement("div")
    grid.style.display="grid"
    grid.style.gridTemplateColumns="repeat(3,1fr)"
    grid.style.gap="10px"
    grid.style.marginBottom="20px"

    files.forEach(file=>{
        const img=document.createElement("img")
        img.src=URL.createObjectURL(file)
        img.style.width="100%"
        grid.appendChild(img)
    })

    result.innerHTML=""
    result.appendChild(grid)
}

/* =========================
   🔥 DRAG DROP
========================= */
const box=document.querySelector(".upload-box")

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
    fileInput.files=e.dataTransfer.files
    previewFiles()
})

/* =========================
   🔥 CONVERT + VORTEX
========================= */
async function convert(){

 const files=[...fileInput.files]
 if(!files.length){
  toast("no entities selected","#ff4444")
  return
 }

 const to=document.getElementById("toFormat").value
 const scale=document.getElementById("resize")?.value/100 || 1

 result.innerHTML="<p style='color:#ff4444'>transmuting...</p>"

 /* ===== overlay ===== */
 const overlay=document.createElement("div")
 overlay.style.position="fixed"
 overlay.style.inset=0
 overlay.style.background="radial-gradient(circle, rgba(0,0,0,.3) 0%, rgba(0,0,0,.95) 70%)"
 overlay.style.backdropFilter="blur(2px)"
 overlay.style.zIndex="9998"
 overlay.style.display="flex"
 overlay.style.alignItems="center"
 overlay.style.justifyContent="center"
 overlay.style.boxShadow="inset 0 0 200px black"
 document.body.appendChild(overlay)

 /* ===== vortex canvas ===== */
 const vcanvas=document.createElement("canvas")
 vcanvas.width=innerWidth
 vcanvas.height=innerHeight
 vcanvas.style.position="fixed"
 vcanvas.style.inset=0
 vcanvas.style.pointerEvents="none"
 overlay.appendChild(vcanvas)

 const vctx=vcanvas.getContext("2d")
 const cx=vcanvas.width/2
 const cy=vcanvas.height/2

 const vortex=Array.from({length:120}).map(()=>({
  x:Math.random()*vcanvas.width,
  y:Math.random()*vcanvas.height,
  speed:.02+Math.random()*.04
 }))

 let running=true

 function vortexLoop(){
  if(!running) return
  vctx.clearRect(0,0,vcanvas.width,vcanvas.height)

  vortex.forEach(p=>{
    p.x+=(cx-p.x)*p.speed
    p.y+=(cy-p.y)*p.speed

    vctx.fillStyle="rgba(255,0,0,.5)"
    vctx.fillRect(p.x,p.y,2,2)
  })

  requestAnimationFrame(vortexLoop)
 }
 vortexLoop()

 /* symbol */
 const symbol=document.createElement("div")
 symbol.textContent="⛧"
 symbol.style.fontSize="90px"
 symbol.style.color="rgba(255,0,0,.6)"
 symbol.style.animation="spin 2s linear infinite"
 overlay.appendChild(symbol)

 setTimeout(()=>{
  running=false
  overlay.remove()
 },2000)

 /* ===== conversion ===== */
 let converted=[]

 for(const file of files){
  const img=new Image()
  img.src=URL.createObjectURL(file)

  await new Promise(res=>{
    img.onload=()=>{
      const canvas=document.createElement("canvas")
      canvas.width=img.width*scale
      canvas.height=img.height*scale
      const ctx=canvas.getContext("2d")
      ctx.drawImage(img,0,0,canvas.width,canvas.height)

      let mime="image/png"
      if(to==="jpg") mime="image/jpeg"
      if(to==="webp") mime="image/webp"
      if(to==="bmp") mime="image/bmp"

      canvas.toBlob(blob=>{
        converted.push({
          name:file.name.split(".")[0]+"."+to,
          blob
        })
        res()
      },mime)
    }
  })
 }

 result.innerHTML=""

 converted.forEach(f=>{
   const a=document.createElement("a")
   a.href=URL.createObjectURL(f.blob)
   a.download=f.name
   a.textContent="download "+f.name
   a.style.display="block"
   a.style.color="#00ff9c"
   result.appendChild(a)
 })

 const logs=document.getElementById("logs")
 if(logs){
  const d=new Date().toLocaleTimeString()
  logs.innerHTML+="<div>> "+d+" entity processed</div>"
 }

 updateCounter(converted.length)
 toast("ritual completed")
}
