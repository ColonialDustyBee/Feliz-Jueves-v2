# All hail yt-dlp
from yt_dlp import YoutubeDL 
# Usually, yt-dlp will spawn a small identifiable string which can be used to filter videos for bot to pull from.
URL = ['https://www.youtube.com/watch?v=KfS2eQXMDrM'] # If all is said and done, this should spawn as a child process
ydl_opts = {
    'format': 'ext',  # MP4 video + M4A audio (fallback to best MP4)
}

with YoutubeDL() as ydl:
    ydl.download(URL)