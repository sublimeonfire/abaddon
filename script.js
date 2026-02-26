async function summonVideo(){

    const url = document.getElementById("videoUrl").value.trim()
    const result = document.getElementById("result")

    if(!url){
        alert("Paste URL")
        return
    }

    result.innerHTML = "<p style='color:#ff4444'>Summoning entity...</p>"

    try{

        const res = await fetch("https://abaddon-y6h7.onrender.com/get-video",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({url})
        })

        const data = await res.json()

        if(data.video){

            // ⭐ se tiver audio separado
            if(data.audio){

                const video = document.getElementById("videoPlayer")
                video.src = data.video
                video.muted = false
                video.play()

                result.innerHTML = "<p style='color:#00ff9c'>Entity manifested.</p>"

            }else{
                window.open(data.video,"_blank")
            }

        }else{
            result.innerHTML = "<p style='color:red'>Summon failed.</p>"
        }

    }catch(e){
        console.log(e)
        result.innerHTML = "<p style='color:red'>Backend offline.</p>"
    }
}