#!/usr/bin/env python3
"""
Development HTTP server with cache-busting headers
Run this instead of the basic Python HTTP server for development.
"""

import http.server
import socketserver
import sys
from datetime import datetime

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add cache-busting headers
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Last-Modified', datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'))
        
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()
    
    def log_message(self, format, *args):
        # Add timestamp to logs
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] {format % args}")

def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
    
    with socketserver.TCPServer(("", port), NoCacheHTTPRequestHandler) as httpd:
        print(f"Development server running at http://localhost:{port}/")
        print("Cache-busting headers enabled for development")
        print("Press Ctrl+C to stop the server")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == "__main__":
    main() 