# All hail yt-dlp
from yt_dlp import YoutubeDL  # type: ignore
import sys
URL = sys.argv[1] # link
ydl_opts = {
    'format': 'bestvideo[vcodec^=avc1][height<=720]+bestaudio[acodec^=mp4a][ext=m4a]/best[ext=mp4]',
    'merge_output_format': 'mp4',
    'cookies': 'cookies.txt',
    'postprocessors': [{
        'key': 'FFmpegVideoConvertor',
        'preferedformat': 'mp4',
    }],
}
with YoutubeDL(ydl_opts) as ydl:
    ydl.download(URL)