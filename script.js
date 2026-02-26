function convert(){
    const input = document.getElementById('fileInput');
    const file = input.files[0];

    if(!file){
        alert("Select WEBP file");
        return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = function(){
        const canvas = document.getElementById('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img,0,0);

        const png = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = png;
        link.download = "converted.png";
        link.textContent = "DOWNLOAD PNG";
        link.className = "download";

        const result = document.getElementById('result');
        result.innerHTML = "";
        result.appendChild(link);
    }
}
