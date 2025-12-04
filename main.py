import os
import glob
import json
from extractor import extract_data
from codegen import generate_mastra_code, generate_langgraph_code

# --- KONFIGURASI PATH BARU ---
BASE_INPUT_DIR = "input_rdfs"
SUB_DIRS = ["mastra", "langgraph"] 

OUTPUT_DIR = "output_frameworks"

# Struktur Baru untuk Mastra Cloud
MASTRA_ROOT = "mastra_project"
MASTRA_SRC = os.path.join(MASTRA_ROOT, "src", "mastra")

def setup_mastra_environment():
    """Membuat struktur folder dan file konfigurasi Mastra Cloud"""
    os.makedirs(MASTRA_SRC, exist_ok=True)

    # 1. Generate package.json (MINIMALIS)
    # Kita menghapus 'ai', '@mastra/memory', dll agar tidak bentrok dengan core.
    pkg_json = {
        "name": "agentic-converter-mastra",
        "version": "0.1.0",
        "scripts": {
            "dev": "mastra dev",
            "start": "tsx src/mastra/index.ts"
        },
        "dependencies": {
            # Kita gunakan versi 0.24.5 agar cocok dengan deployer cloud
            "@mastra/core": "0.24.5",
            "zod": "^3.23.8"
        },
        # Overrides untuk memaksa satu versi 'ai' SDK saja (Versi 4.x yang diminta Core)
        # Ini mencegah konflik dengan versi 5.x yang diminta oleh sub-dependensi lain
        "overrides": {
            "ai": "4.3.19" 
        },
        "devDependencies": {
            "tsx": "^4.7.1",
            "typescript": "^5.3.3",
            "@types/node": "^20.11.24"
        }
    }
    
    with open(os.path.join(MASTRA_ROOT, "package.json"), "w", encoding="utf-8") as f:
        json.dump(pkg_json, f, indent=2)

    # 2. Generate tsconfig.json
    tsconfig = {
        "compilerOptions": {
            "target": "ES2020",
            "module": "CommonJS",
            "moduleResolution": "node",
            "strict": True,
            "esModuleInterop": True,
            "skipLibCheck": True,
            "forceConsistentCasingInFileNames": True,
            "outDir": "./dist",
            "rootDir": "./src"
        },
        "include": ["src/**/*"],
        "exclude": ["node_modules"]
    }
    with open(os.path.join(MASTRA_ROOT, "tsconfig.json"), "w", encoding="utf-8") as f:
        json.dump(tsconfig, f, indent=2)

    # 3. Generate index.ts
    index_ts = """
import { Mastra } from '@mastra/core';

// Ini adalah entry point utama untuk Cloud Build
export const mastra = new Mastra({
  name: 'agentic-converter-framework',
  agents: {}, 
  workflows: {},
});

console.log("✅ Mastra Cloud Instance initialized.");
"""
    # PERBAIKAN: Menambahkan encoding="utf-8" agar emoji ✅ bisa tersimpan
    with open(os.path.join(MASTRA_SRC, "index.ts"), "w", encoding="utf-8") as f:
        f.write(index_ts)

def main():
    # Setup Folder Output
    langgraph_dir = os.path.join(OUTPUT_DIR, "langgraph")
    os.makedirs(langgraph_dir, exist_ok=True)
    
    # Setup Mastra Environment (Structure Fix)
    setup_mastra_environment()

    print(f"Starting Polyglot Conversion from '{BASE_INPUT_DIR}'...\n")
    
    stats = {"success": 0, "failed": 0, "skipped": 0}

    for sub in SUB_DIRS:
        current_input_path = os.path.join(BASE_INPUT_DIR, sub)
        if not os.path.exists(current_input_path):
            continue

        ttl_files = glob.glob(os.path.join(current_input_path, "*.ttl"))
        print(f"--- Processing folder: /{sub} ({len(ttl_files)} files) ---")

        for input_file in ttl_files:
            try:
                data = extract_data(input_file)
                if not data["elements"]:
                    stats["skipped"] += 1
                    continue

                # 1. Generate MASTRA (TypeScript) -> Save ke src/mastra/
                mastra_code = generate_mastra_code(data)
                mastra_filename = data["filename"].replace(".ttl", "_mastra.ts") 
                mastra_path = os.path.join(MASTRA_SRC, mastra_filename) # Path Baru
                
                with open(mastra_path, "w", encoding="utf-8") as f:
                    f.write(mastra_code)
                
                # 2. Generate LANGGRAPH (Python)
                lg_code = generate_langgraph_code(data)
                lg_filename = data["filename"].replace(".ttl", "_langgraph.py")
                lg_path = os.path.join(langgraph_dir, lg_filename)
                
                with open(lg_path, "w", encoding="utf-8") as f:
                    f.write(lg_code)

                print(f"  [OK] {data['filename']} -> TS & PY generated.")
                stats["success"] += 1

            except Exception as e:
                print(f"  [ERROR] {input_file}: {e}")
                stats["failed"] += 1
        print("") 

    print("="*30)
    print("CONVERSION SUMMARY")
    print("="*30)
    print(f"Total Processed        : {stats['success'] + stats['failed'] + stats['skipped']}")
    print(f"Mastra Location (TS)   : ./{MASTRA_SRC}/")
    print(f"LangGraph Location (PY): ./{langgraph_dir}/")
    print(f"Mastra Entry Point     : ./{MASTRA_SRC}/index.ts (REQUIRED FOR CLOUD)")
    print("="*30)

if __name__ == "__main__":
    main()