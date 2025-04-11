# All hail yt-dlp
from yt_dlp import YoutubeDL 
# Usually, yt-dlp will spawn a small identifiable string which can be used to filter videos for bot to pull from.
# Must add cookies of some kind
URL = ['https://www.youtube.com/watch?v=TBxS0XhdfmU'] # If all is said and done, this should spawn as a child process
ydl_opts = {
    'format': 'bestvideo[res=720p][ext=mp4]+bestaudio[acodec^=mp4a][ext=m4a]/best[ext=mp4]',
    'merge_output_format': 'mp4',
    'cookies': 'cookies.txt',
    'postprocessors': [{
        'key': 'FFmpegVideoConvertor',
        'preferedformat': 'mp4',
    }],
}
with YoutubeDL(ydl_opts) as ydl:
    ydl.download(URL)