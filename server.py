import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    print(f"============================================================")
    print(f"  VASPX Blockchain Intelligence Command Center Running")
    print(f"  URL: http://localhost:{PORT}")
    print(f"  Trace the Flow. Identify the VASP. Accelerate Investigation.")
    print(f"============================================================")
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down VASPX Server...")
            httpd.server_close()
