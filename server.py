from __future__ import annotations

import cgi
import json
import os
import posixpath
import re
import shutil
import urllib.parse
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
PROOFS_ROOT = ROOT / "justificantes"
INDEX_PATH = PROOFS_ROOT / "index.json"
HOST = "127.0.0.1"
PORT = 8081


def ensure_storage() -> None:
    PROOFS_ROOT.mkdir(parents=True, exist_ok=True)
    if not INDEX_PATH.exists():
        INDEX_PATH.write_text("{}", encoding="utf-8")


def load_index() -> dict[str, dict]:
    ensure_storage()
    try:
        return json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}


def save_index(data: dict[str, dict]) -> None:
    ensure_storage()
    INDEX_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def safe_name(value: str, fallback: str) -> str:
    cleaned = Path(value or "").name.strip()
    cleaned = re.sub(r"[<>:\"/\\\\|?*\\x00-\\x1f]", "-", cleaned)
    cleaned = cleaned.rstrip(". ")
    return cleaned or fallback


def safe_section(value: str) -> str:
    cleaned = re.sub(r"[^a-z0-9-]+", "-", (value or "").strip().lower())
    cleaned = re.sub(r"-{2,}", "-", cleaned).strip("-")
    return cleaned or "general"


def unique_path(directory: Path, filename: str, current_proof_id: str, index_data: dict[str, dict]) -> Path:
    base = Path(filename).stem
    ext = Path(filename).suffix
    candidate = directory / filename
    if not candidate.exists():
        return candidate

    current = index_data.get(current_proof_id)
    if current:
        current_path = ROOT / current.get("stored_path", "")
        if current_path == candidate:
            return candidate

    counter = 2
    while True:
        candidate = directory / f"{base}-{counter}{ext}"
        if not candidate.exists():
            return candidate
        counter += 1


class ProofHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path: str) -> str:
        path = path.split("?", 1)[0].split("#", 1)[0]
        trailing_slash = path.rstrip().endswith("/")
        path = posixpath.normpath(urllib.parse.unquote(path))
        words = [part for part in path.split("/") if part]
        target = ROOT
        for word in words:
            if word in (os.curdir, os.pardir):
                continue
            target = target / word
        if trailing_slash:
            target = target / ""
        return str(target)

    def log_message(self, format: str, *args) -> None:
        return

    def do_GET(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path.startswith("/api/proofs/"):
            self.handle_get_proof(parsed.path)
            return
        return super().do_GET()

    def do_POST(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/proofs/upload":
            self.handle_upload()
            return
        self.send_error(HTTPStatus.NOT_FOUND)

    def do_DELETE(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path.startswith("/api/proofs/"):
            self.handle_delete(parsed.path)
            return
        self.send_error(HTTPStatus.NOT_FOUND)

    def send_json(self, payload: dict, status: int = 200) -> None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def handle_get_proof(self, path: str) -> None:
        parts = [part for part in path.split("/") if part]
        if len(parts) < 3:
            self.send_error(HTTPStatus.NOT_FOUND)
            return

        proof_id = urllib.parse.unquote(parts[2])
        index_data = load_index()
        record = index_data.get(proof_id)
        if not record:
            self.send_error(HTTPStatus.NOT_FOUND)
            return

        if len(parts) == 4 and parts[3] == "file":
            file_path = ROOT / record["stored_path"]
            if not file_path.exists():
                self.send_error(HTTPStatus.NOT_FOUND)
                return
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", record.get("type") or "application/octet-stream")
            self.send_header("Content-Length", str(file_path.stat().st_size))
            quoted = urllib.parse.quote(record["name"])
            self.send_header("Content-Disposition", f"inline; filename*=UTF-8''{quoted}")
            self.end_headers()
            with file_path.open("rb") as fh:
                shutil.copyfileobj(fh, self.wfile)
            return

        self.send_json(record)

    def handle_upload(self) -> None:
        ctype, _ = cgi.parse_header(self.headers.get("Content-Type", ""))
        if ctype != "multipart/form-data":
            self.send_json({"error": "Invalid content type"}, status=400)
            return

        form = cgi.FieldStorage(fp=self.rfile, headers=self.headers, environ={"REQUEST_METHOD": "POST"})
        proof_id = safe_name(form.getfirst("proofId", ""), "proof")
        section = safe_section(form.getfirst("section", "general"))
        uploaded = form["file"] if "file" in form else None

        if not proof_id or uploaded is None or not getattr(uploaded, "filename", ""):
            self.send_json({"error": "Missing file or proofId"}, status=400)
            return

        original_name = safe_name(uploaded.filename, "documento")
        target_dir = PROOFS_ROOT / section
        target_dir.mkdir(parents=True, exist_ok=True)

        index_data = load_index()
        previous = index_data.get(proof_id)
        previous_path = ROOT / previous["stored_path"] if previous and previous.get("stored_path") else None
        target_path = unique_path(target_dir, original_name, proof_id, index_data)

        with target_path.open("wb") as output:
            shutil.copyfileobj(uploaded.file, output)

        if previous_path and previous_path.exists() and previous_path != target_path:
            previous_path.unlink()

        rel_path = target_path.relative_to(ROOT).as_posix()
        record = {
            "id": proof_id,
            "section": section,
            "name": original_name,
            "type": uploaded.type or "application/octet-stream",
            "stored_path": rel_path,
            "url": f"/api/proofs/{urllib.parse.quote(proof_id)}/file",
        }
        index_data[proof_id] = record
        save_index(index_data)
        self.send_json(record, status=201)

    def handle_delete(self, path: str) -> None:
        parts = [part for part in path.split("/") if part]
        if len(parts) != 3:
            self.send_error(HTTPStatus.NOT_FOUND)
            return

        proof_id = urllib.parse.unquote(parts[2])
        index_data = load_index()
        record = index_data.pop(proof_id, None)
        if not record:
            self.send_json({"deleted": False}, status=404)
            return

        file_path = ROOT / record.get("stored_path", "")
        if file_path.exists():
            file_path.unlink()

        save_index(index_data)
        self.send_json({"deleted": True})


def main() -> None:
    ensure_storage()
    server = ThreadingHTTPServer((HOST, PORT), ProofHandler)
    print(f"Serving on http://{HOST}:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
