import os
import base64
from passlib.context import CryptContext
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey, Ed25519PublicKey
from cryptography.hazmat.primitives import serialization

# ----------------------
# Password Hashing Utils
# ----------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# ----------------------
# Fernet Key Persistence
# ----------------------
FERNET_KEY_FILE = "fernet.key"
if os.path.exists(FERNET_KEY_FILE):
    with open(FERNET_KEY_FILE, "rb") as f:
        FERNET_KEY = f.read()
else:
    FERNET_KEY = Fernet.generate_key()
    with open(FERNET_KEY_FILE, "wb") as f:
        f.write(FERNET_KEY)
fernet = Fernet(FERNET_KEY)

def encrypt_note(plaintext: str) -> str:
    return fernet.encrypt(plaintext.encode()).decode()

def decrypt_note(token: str) -> str:
    return fernet.decrypt(token.encode()).decode()

# ----------------------
# Ed25519 Key Persistence
# ----------------------
ED25519_KEY_FILE = "ed25519.key"
if os.path.exists(ED25519_KEY_FILE):
    with open(ED25519_KEY_FILE, "rb") as f:
        PRIVATE_KEY = Ed25519PrivateKey.from_private_bytes(f.read())
else:
    PRIVATE_KEY = Ed25519PrivateKey.generate()
    with open(ED25519_KEY_FILE, "wb") as f:
        f.write(PRIVATE_KEY.private_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PrivateFormat.Raw,
            encryption_algorithm=serialization.NoEncryption()
        ))
PUBLIC_KEY = PRIVATE_KEY.public_key()

# ----------------------
# Note Signing Utilities
# ----------------------
def sign_note(encrypted_content: str) -> str:
    signature = PRIVATE_KEY.sign(encrypted_content.encode())
    return base64.b64encode(signature).decode()

def verify_note_signature(encrypted_content: str, signature: str) -> bool:
    try:
        PUBLIC_KEY.verify(base64.b64decode(signature), encrypted_content.encode())
        return True
    except Exception:
        return False
