from fastapi import FastAPI, UploadFile,File
from fastapi.responses import FileResponse
import uvicorn
import os

app = FastAPI()
VideoDir = "video"
os.makedirs(VideoDir,exist_ok=True)

@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    file_path = os.path.join(VideoDir, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    return {"message": "文件上传成功"}

@app.get("/video")
def get_video_list():
    video_list = os.listdir(VideoDir)
    return {"视频列表": video_list}

@app.get("/stream/{filename}")
async def get_video(filename: str):
    file_path = os.path.join(VideoDir, filename)
    return FileResponse(file_path, media_type="video/mp4")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
