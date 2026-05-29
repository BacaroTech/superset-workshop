FEATURE_FLAGS = {
    "EMBEDDED_SUPERSET": True,
}

HTTP_HEADERS = {
    "X-Frame-Options": "ALLOWALL",
    "Content-Security-Policy": "frame-ancestors 'self' http://localhost:3000",
}