/* =========================
   🔥 ABADDON CONVERTER
========================= */

const fileInput = document.getElementById("fileInput")
const result = document.getElementById("result")
const importBtn = document.getElementById("importBtn")
const convertBtn = document.getElementById("convertBtn")
const fromFormat = document.getElementById("fromFormat")
const toFormat = document.getElementById("toFormat")

let filesSelected=false

/* =========================
   🔥 AUDIO AUTOPLAY HACK
========================= */
const amb=document.getElementById("amb")

if(amb){
 amb.volume=0.01
 amb.play().then(()=>{
   setTimeout(()=>amb.volume=.18,2000)
 }).catch(()=>{})
}

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
   🔥 ENABLE FLOW
========================= */
function checkReady(){
    convertBtn.disabled = !(filesSelected && toFormat.value)
}

/* =========================
   🔥 IMPORT BTN
========================= */
if(importBtn){
 importBtn.onclick=()=>fileInput.click()
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

setInterval(()=>{
 let c=parseInt(localStorage.getItem("abaddon_count")||666)
 c+=Math.floor(Math.random()*3)
 localStorage.setItem("abaddon_count",c)
 const el=document.getElementById("counter")
 if(el) el.textContent=String(c).padStart(6,"0")
},4000)

/* =========================
   🔥 FILE HANDLE (NO PREVIEW)
========================= */
fileInput.addEventListener("change",handleFiles)

function handleFiles(){
    const files=[...fileInput.files]
    if(!files.length) return

    filesSelected=true

    // botão mostra quantidade
    importBtn.textContent=`${files.length} SELECTED`

    // texto abaixo
    result.innerHTML=`<p style="color:#ff4444;opacity:.7">${files.length} entity selected</p>`

    // auto detect formato origem
    if(files[0]){
        const ext=files[0].name.split(".").pop().toLowerCase()
        if(fromFormat) fromFormat.value=ext
    }

    checkReady()
}

/* =========================
   🔥 DRAG DROP
========================= */
const box=document.querySelector(".upload-box")

if(box){
 ["dragenter","dragover"].forEach(evt=>{
    box.addEventListener(evt,e=>{
        e.preventDefault()
        box.style.boxShadow="0 0 25px red"
    })
 })

 ["dragleave","drop"].forEach(evt=>{
    box.addEventListener(evt,e=>{
        e.preventDefault()
        box.style.boxShadow="none"
    })
 })

 box.addEventListener("drop",e=>{
    fileInput.files=e.dataTransfer.files
    handleFiles()
 })
}

/* =========================
   🔥 CONVERT
========================= */
async function convert(){

 const files=[...fileInput.files]
 if(!files.length){
  toast("no entities selected","#ff4444")
  return
 }

 const to=toFormat.value
 if(!to){
   toast("choose destination","#ff4444")
   return
 }

 result.innerHTML="<p style='color:#ff4444'>transmuting...</p>"

 let converted=[]

 for(const file of files){
  const img=new Image()
  img.src=URL.createObjectURL(file)

  await new Promise(res=>{
    img.onload=()=>{
      const canvas=document.createElement("canvas")
      canvas.width=img.width
      canvas.height=img.height
      const ctx=canvas.getContext("2d")
      ctx.drawImage(img,0,0)

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
