# Encrypted Notes App

A secure, locally-hosted notes application with end-to-end encryption and digital signatures.

Features
-  Client-side encryption using Fernet
-  Ed25519 digital signatures for tamper detection
-  Encrypted keyword search
-  Modern React UI with responsive design
-  Local SQLite storage

How to Run:

Backend:

cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload



Frontend: 

cd frontend

npm install

npm start




Security Features
- All notes encrypted before storage
- Digital signatures verify data integrity
- Persistent key management
- Search through encrypted keywords
