FEATURE_FLAGS = {
    "EMBEDDED_SUPERSET": True,
}

ENABLE_CORS = True

CORS_OPTIONS = {
    "supports_credentials": True,
    "allow_headers": ["*"],
    "resources": ["*"],
    "origins": ["http://localhost:3000"],
}

TALISMAN_ENABLED = False

# Permetti al guest token di accedere alle API necessarie
GUEST_ROLE_NAME = "Gamma"
GUEST_TOKEN_JWT_SECRET = "workshop-secret-change-in-prod"
GUEST_TOKEN_JWT_ALGO = "HS256"
GUEST_TOKEN_JWT_EXP_SECONDS = 300