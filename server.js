import express from "express"
import cors from "cors"
import { exec } from "child_process"

const app = express()

app.use(cors())
app.use(express.json())

app.post("/get-video", (req,res)=>{

    const { url } = req.body

    if(!url) return res.json({error:true})

    console.log("Resolving:", url)

    exec(`yt-dlp -f mp4 -g "${url}"`, (err, stdout)=>{

        if(err){
            console.log(err)
            return res.json({error:true})
        }

        res.json({ videoUrl: stdout.trim() })
    })

})

app.listen(3000, ()=>console.log("🔥 ABADDON backend running on 3000"))
