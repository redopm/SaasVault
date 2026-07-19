import os
from pymongo import MongoClient
import certifi
import socket
from dotenv import load_dotenv

# Load Environment Variables
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
if os.path.exists(env_path):
    load_dotenv(env_path)

MONGO_URI = os.getenv("MONGO_URI")

client = None
db = None
news_col = None
recruitments_col = None
pyq_col = None
pyq_papers_col = None
mock_tests_col = None
mock_questions_col = None
mock_results_col = None



def init_db():
    global client, db, news_col, recruitments_col, pyq_col, pyq_papers_col, mock_tests_col, mock_questions_col, mock_results_col
    
    if not MONGO_URI:
        print("[CRITICAL] MONGO_URI not set!")
        return

    print("[INFO] Starting MongoDB Connection Process...")
    count_attempts = 0
    max_retries = 3

    while count_attempts < max_retries:
        try:
            print(f"[INFO] Connecting to MongoDB (Attempt {count_attempts+1}/{max_retries})...")
            # SECURITY: tlsAllowInvalidCertificates removed — never disable TLS verification
            client = MongoClient(MONGO_URI,
                                 serverSelectionTimeoutMS=5000,
                                 tlsCAFile=certifi.where())
            client.admin.command('ping')
            print("[OK] MongoDB Connected Successfully")
            break
        except Exception as e:
            print(f"[WARNING] Connection attempt {count_attempts+1} failed: {e}")
            count_attempts += 1
            if count_attempts < max_retries:
                import time
                time.sleep(2)
            else:
                print("[CRITICAL] All standard MongoDB connection attempts failed.")
                
                # --- FALLBACK: DNS MONKEYPATCH & DIRECT CONNECTION ---
                print("[INFO] Attempting Fallback: DNS Monkeypatch & Direct Connection...")
                try:
                    # SECURITY: IPs loaded from env var, not hardcoded in source
                    # Set MONGO_FALLBACK_IPS in .env as comma-separated host:ip pairs
                    # Format: "host1:ip1,host2:ip2"
                    fallback_ips_raw = os.getenv('MONGO_FALLBACK_IPS', '')
                    dns_map = {}
                    for entry in fallback_ips_raw.split(','):
                        if ':' in entry:
                            parts = entry.strip().split(':', 1)
                            if len(parts) == 2:
                                dns_map[parts[0].strip()] = parts[1].strip()
                    original_getaddrinfo = socket.getaddrinfo
                    def patched_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
                        if host in dns_map:
                            print(f"[DEBUG] DNS Patch: Resolving {host} -> {dns_map[host]}")
                            return original_getaddrinfo(dns_map[host], port, family, type, proto, flags)
                        return original_getaddrinfo(host, port, family, type, proto, flags)
                    socket.getaddrinfo = patched_getaddrinfo
                    
                    # 2. Construct Direct URI
                    if '@' in MONGO_URI:
                        clean_uri = MONGO_URI.replace('mongodb+srv://', '').replace('mongodb://', '')
                        creds = clean_uri.split('@')[0]
                        host = "ac-sgko9vt-shard-00-00.6ezvkjt.mongodb.net:27017"
                        
                        fallback_uri = f"mongodb://{creds}@{host}/ikkish_prep?ssl=true&authSource=admin&directConnection=true"
                        
                        print(f"[INFO] Connecting with Fallback URI: mongodb://*****@{host}/...")
                        client = MongoClient(fallback_uri, 
                                           serverSelectionTimeoutMS=5000, 
                                           tlsCAFile=certifi.where())
                        client.admin.command('ping')
                        print("✅ [FALLBACK] MongoDB Connected Successfully via Patch!")
                    else:
                        print("[ERROR] Could not parse creds for fallback.")
                        client = None
                except Exception as fallback_e:
                    print(f"❌ [FALLBACK] Connection Failed: {fallback_e}")
                    print("[WARNING] Running in offline mode (No Database)")
                    client = None

    if client:
        db = client['ikkish_prep']
        news_col = db['news']
        recruitments_col = db['recruitments']
        pyq_col = db['pyq_questions']
        pyq_papers_col = db['pyq_papers']
        mock_tests_col = db['mock_tests']
        mock_questions_col = db['mock_questions']
        mock_results_col = db['mock_results']

        print(f"[DEBUG] Connected to DB: {db.name} | PYQ Collection: {pyq_col.name}")
    else:
        db = None
        news_col = None
        recruitments_col = None
        pyq_col = None
        pyq_papers_col = None
        mock_tests_col = None
        mock_questions_col = None
        mock_results_col = None

