import subprocess # spawns this as a child process
import sys


url = sys.argv[1] # URL babey
args = [
    "/usr/bin/yt-dlp",            # path to yt-dlp
    "--no-playlist",               # only single video
    "--restrict-filenames",        # safe filenames
    "-f", "bv*+ba/b",              # best video + best audio, fallback
    "--merge-output-format", "mp4",# force MP4
    "-o", "./%(title)s.%(ext)s",  # output path
    url
]

subprocess.run(args, capture_output=True, text=True)
print("./%(title)s.%(ext)s") # Filename