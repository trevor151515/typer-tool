"""Static development server with livereload for the starter project."""

import os
import threading
import time
import webbrowser
from pathlib import Path

from livereload import Server

ROOT = Path(__file__).resolve().parent / "src"
PORT = 8000
OPEN_URL = f"http://localhost:{PORT}/"


def main() -> None:
    os.chdir(ROOT)
    server = Server()
    server.watch("**/*.html")
    server.watch("**/*.css")
    server.watch("**/*.js")
    server.watch("**/*.md")

    print(f"Serving {ROOT}")
    print(f"Local: {OPEN_URL}")

    def open_browser() -> None:
        time.sleep(1)
        webbrowser.open(OPEN_URL)

    threading.Thread(target=open_browser, daemon=True).start()
    server.serve(port=PORT, host="0.0.0.0", root=str(ROOT), open_url_delay=None)


if __name__ == "__main__":
    main()
