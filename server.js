<<<<<<< HEAD
const express = require("express")
const cors = require("cors")
const { exec } = require("child_process")
const path = require("path")
const fs = require("fs")
=======
import express from "express"
import cors from "cors"
import { exec } from "child_process"
>>>>>>> c9f9ff0f698260da0ca40ae6aa0b5ddbbe18f0ed

const app = express()

app.use(cors())
app.use(express.json())

<<<<<<< HEAD
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
=======
app.post("/get-video", (req,res)=>{

    const { url } = req.body

    if(!url) return res.json({error:true})

    console.log("Resolving:", url)

    exec(`yt-dlp -f mp4 -g "${url}"`, (err, stdout)=>{
>>>>>>> c9f9ff0f698260da0ca40ae6aa0b5ddbbe18f0ed

        if(err){
            console.log(err)
            return res.json({error:true})
        }

<<<<<<< HEAD
        // 🔥 serve arquivo final
        res.json({ videoUrl:`http://localhost:3000/video/${id}` })

=======
        res.json({ videoUrl: stdout.trim() })
>>>>>>> c9f9ff0f698260da0ca40ae6aa0b5ddbbe18f0ed
    })

})

<<<<<<< HEAD
app.get("/video/:id",(req,res)=>{
    const file = path.join(downloads,`${req.params.id}.mp4`)
    if(fs.existsSync(file)){
        res.sendFile(file)
    }else{
        res.status(404).end()
    }
})

app.listen(3000,()=>console.log("🔥 ABADDON backend running on 3000"))
=======
app.listen(3000, ()=>console.log("🔥 ABADDON backend running on 3000"))
>>>>>>> c9f9ff0f698260da0ca40ae6aa0b5ddbbe18f0ed
