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
   🔥 OCCULT PARTICLES
========================= */
const canvas=document.getElementById("occultCanvas")
if(canvas){
const ctx=canvas.getContext("2d")

function resize(){
 canvas.width=innerWidth
 canvas.height=innerHeight
}
resize()
addEventListener("resize",resize)

const symbols=["✶","☽","⛧","☿","✦","ᛟ"]

const particles=Array.from({length:35}).map(()=>({
 x:Math.random()*canvas.width,
 y:Math.random()*canvas.height,
 vx:(Math.random()-.5)*.2,
 vy:(Math.random()-.5)*.2,
 size:Math.random()*2+1,
 life:Math.random()*200
}))

function loop(){
 ctx.clearRect(0,0,canvas.width,canvas.height)

 particles.forEach(p=>{
  p.x+=p.vx
  p.y+=p.vy
  p.life--

  ctx.fillStyle="rgba(255,0,0,.25)"
  ctx.beginPath()
  ctx.arc(p.x,p.y,p.size,0,Math.PI*2)
  ctx.fill()

  if(p.life<0){
    ctx.fillStyle="rgba(255,0,0,.18)"
    ctx.font="14px VT323"
    ctx.fillText(symbols[Math.floor(Math.random()*symbols.length)],p.x,p.y)
    p.life=200+Math.random()*200
  }
 })

 requestAnimationFrame(loop)
}
loop()
}

/* =========================
   🔥 FILM GRAIN
========================= */
const grain=document.getElementById("grain")
if(grain){
 const gctx=grain.getContext("2d")
 function resizeGrain(){
  grain.width=innerWidth
  grain.height=innerHeight
 }
 resizeGrain()
 addEventListener("resize",resizeGrain)

 function grainLoop(){
  const img=gctx.createImageData(grain.width,grain.height)
  for(let i=0;i<img.data.length;i+=4){
    const v=Math.random()*255
    img.data[i]=img.data[i+1]=img.data[i+2]=v
    img.data[i+3]=20
  }
  gctx.putImageData(img,0,0)
  requestAnimationFrame(grainLoop)
 }
 grainLoop()
}

/* =========================
   🔥 RUNES CURSOR
========================= */
const runes=["✶","☽","⛧","✦","ᛟ"]
addEventListener("mousemove",e=>{
 if(Math.random()<.15){
  const r=document.createElement("div")
  r.textContent=runes[Math.floor(Math.random()*runes.length)]
  r.style.position="fixed"
  r.style.left=e.clientX+"px"
  r.style.top=e.clientY+"px"
  r.style.color="rgba(255,0,0,.35)"
  r.style.pointerEvents="none"
  r.style.transition="1s"
  document.body.appendChild(r)

  setTimeout(()=>{
   r.style.transform="translateY(-20px)"
   r.style.opacity=0
   setTimeout(()=>r.remove(),1000)
  })
 }
})

/* =========================
   🔥 LORE
========================= */
const loreTexts=[
 "the gate is open",
 "you are observed",
 "entity acknowledged",
 "ritual stabilized",
 "signal received"
]

const lore=document.getElementById("lore")
const logoWrap=document.querySelector(".logo-wrap")
if(logoWrap && lore){
logoWrap.addEventListener("mouseenter",()=>{
 lore.textContent=loreTexts[Math.floor(Math.random()*loreTexts.length)]
})
}

/* =========================
   🔥 AUDIO AMBIENT
========================= */
const amb=document.getElementById("amb")
addEventListener("click",()=>{
 if(amb && amb.paused){
  amb.volume=.2
  amb.play()
 }
},{once:true})

addEventListener("mousemove",e=>{
 if(amb){
  amb.playbackRate=1+(e.clientX/window.innerWidth)*.1
 }
})

/* =========================
   🔥 CONVERT
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

 const overlay=document.createElement("div")
 overlay.style.position="fixed"
 overlay.style.inset=0
 overlay.style.background="rgba(0,0,0,.85)"
 overlay.style.zIndex="9998"
 overlay.style.display="flex"
 overlay.style.alignItems="center"
 overlay.style.justifyContent="center"
 overlay.style.fontSize="60px"
 overlay.style.color="rgba(255,0,0,.4)"
 overlay.textContent="⛧"
 overlay.style.animation="spin 2s linear"
 document.body.appendChild(overlay)
 setTimeout(()=>overlay.remove(),1800)

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

 /* logs */
 const logs=document.getElementById("logs")
 if(logs){
  const d=new Date().toLocaleTimeString()
  logs.innerHTML+="<div>> "+d+" entity processed</div>"
 }

 updateCounter(converted.length)
 toast("ritual completed")
}
