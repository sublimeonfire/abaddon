const express = require("express")
const cors = require("cors")
const { exec } = require("child_process")
const path = require("path")
const fs = require("fs")

const app = express()

app.use(cors())
app.use(express.json())

const downloads = path.join(__dirname,"downloads")
if(!fs.existsSync(downloads)) fs.mkdirSync(downloads)

app.post("/get-video",(req,res)=>{

    const { url } = req.body
    if(!url) return res.json({error:true})

    const id = Date.now()
    const out = path.join(downloads,`${id}.mp4`)

    console.log("Downloading:", url)

    // 🔥 download + merge
    exec(`yt-dlp -f "bv*+ba/b" -o "${out}" "${url}"`, (err)=>{

        if(err){
            console.log(err)
            return res.json({error:true})
        }

        // 🔥 serve arquivo final
        res.json({ videoUrl:`http://localhost:3000/video/${id}` })

    })

})

app.get("/video/:id",(req,res)=>{
    const file = path.join(downloads,`${req.params.id}.mp4`)
    if(fs.existsSync(file)){
        res.sendFile(file)
    }else{
        res.status(404).end()
    }
})

app.listen(3000,()=>console.log("🔥 ABADDON backend running on 3000"))