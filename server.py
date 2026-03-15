from __future__ import annotations

import cgi
import json
import os
import posixpath
import re
import shutil
import subprocess
import urllib.parse
from datetime import datetime
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
PROOFS_ROOT = Path(os.environ.get("PROOFS_STORAGE_ROOT", ROOT / "justificantes")).resolve()
INDEX_PATH = PROOFS_ROOT / "index.json"
HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "8081"))
PUBLIC_API_BASE_URL = os.environ.get("PUBLIC_API_BASE_URL", "").rstrip("/")
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get("ALLOWED_ORIGINS", "*").split(",")
    if origin.strip()
]


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


def maybe_fix_mojibake(value: str) -> str:
    text = str(value or "")
    suspicious_chars = ("Ã", "â", "€", "™", "œ", "š")
    if not any(char in text for char in suspicious_chars):
        return text

    best = text
    best_score = sum(best.count(char) for char in suspicious_chars)
    for source_encoding in ("latin-1", "cp1252"):
        try:
            candidate = text.encode(source_encoding).decode("utf-8")
        except UnicodeError:
            continue
        candidate_score = sum(candidate.count(char) for char in suspicious_chars)
        if candidate_score < best_score:
            best = candidate
            best_score = candidate_score
    return best


def safe_name(value: str, fallback: str) -> str:
    cleaned = Path(maybe_fix_mojibake(value or "")).name.strip()
    cleaned = re.sub('[<>:"/\\\\|?*\x00-\x1f]', "-", cleaned)
    cleaned = cleaned.rstrip(". ")
    return cleaned or fallback


def safe_section(value: str) -> str:
    cleaned = re.sub(r"[^a-z0-9-]+", "-", (value or "").strip().lower())
    cleaned = re.sub(r"-{2,}", "-", cleaned).strip("-")
    return cleaned or "general"


def resolve_record_path(stored_path: str) -> Path:
    candidate = Path(stored_path or "")
    if candidate.is_absolute():
        return candidate
    legacy_path = ROOT / candidate
    if stored_path and legacy_path.exists():
        return legacy_path
    return PROOFS_ROOT / candidate


class ProofHandler(SimpleHTTPRequestHandler):
    def get_public_api_base(self) -> str:
        if PUBLIC_API_BASE_URL:
            return PUBLIC_API_BASE_URL
        scheme = self.headers.get("X-Forwarded-Proto", "http")
        host = self.headers.get("X-Forwarded-Host") or self.headers.get("Host", "")
        if host:
            return f"{scheme}://{host}/api/proofs"
        return "/api/proofs"

    def get_cors_origin(self) -> str:
        if not ALLOWED_ORIGINS:
            return "*"
        if "*" in ALLOWED_ORIGINS:
            return "*"
        request_origin = self.headers.get("Origin", "")
        if request_origin in ALLOWED_ORIGINS:
            return request_origin
        return ""

    def send_cors_headers(self) -> None:
        cors_origin = self.get_cors_origin()
        if cors_origin:
            self.send_header("Access-Control-Allow-Origin", cors_origin)
            self.send_header("Vary", "Origin")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

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
        if parsed.path == "/healthz":
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(b"ok")
            return
        if parsed.path.startswith("/api/proofs/"):
            self.handle_get_proof(parsed.path)
            return
        return super().do_GET()

    def do_POST(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/proofs/upload":
            self.handle_upload()
            return
        if parsed.path == "/api/publish":
            self.handle_publish()
            return
        self.send_error(HTTPStatus.NOT_FOUND)

    def do_DELETE(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path.startswith("/api/proofs/"):
            self.handle_delete(parsed.path)
            return
        self.send_error(HTTPStatus.NOT_FOUND)

    def do_OPTIONS(self) -> None:
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_cors_headers()
        self.end_headers()

    def send_json(self, payload: dict, status: int = 200) -> None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_cors_headers()
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
            file_path = resolve_record_path(record["stored_path"])
            if not file_path.exists():
                self.send_error(HTTPStatus.NOT_FOUND)
                return
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", record.get("type") or "application/octet-stream")
            self.send_header("Content-Length", str(file_path.stat().st_size))
            quoted = urllib.parse.quote(record["name"])
            self.send_header("Content-Disposition", f"inline; filename*=UTF-8''{quoted}")
            self.send_cors_headers()
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

        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={
                "REQUEST_METHOD": "POST",
                "CONTENT_TYPE": self.headers.get("Content-Type", ""),
                "CONTENT_LENGTH": self.headers.get("Content-Length", "0"),
            },
        )
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
        previous_path = (
            resolve_record_path(previous["stored_path"])
            if previous and previous.get("stored_path")
            else None
        )
        target_path = target_dir / original_name

        with target_path.open("wb") as output:
            shutil.copyfileobj(uploaded.file, output)

        if previous_path and previous_path.exists() and previous_path != target_path:
            previous_path.unlink()

        rel_path = target_path.relative_to(PROOFS_ROOT).as_posix()
        public_api_base = self.get_public_api_base()
        record = {
            "id": proof_id,
            "section": section,
            "name": original_name,
            "type": uploaded.type or "application/octet-stream",
            "stored_path": rel_path,
            "url": f"{public_api_base}/{urllib.parse.quote(proof_id)}/file",
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

        file_path = resolve_record_path(record.get("stored_path", ""))
        if file_path.exists():
            file_path.unlink()

        save_index(index_data)
        self.send_json({"deleted": True})

    def handle_publish(self) -> None:
        status_result = subprocess.run(
            ["git", "status", "--short"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
        if status_result.returncode != 0:
            self.send_json(
                {"published": False, "message": "No se pudo comprobar el estado de Git."},
                status=500,
            )
            return

        if not status_result.stdout.strip():
            self.send_json(
                {"published": False, "message": "No hay cambios pendientes para publicar."}
            )
            return

        commands = [
            ["git", "add", "-A"],
            [
                "git",
                "commit",
                "-m",
                f"Publica cambios desde la web local ({datetime.now().strftime('%Y-%m-%d %H:%M:%S')})",
            ],
            ["git", "push", "origin", "main"],
        ]

        for command in commands:
            result = subprocess.run(
                command,
                cwd=ROOT,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
            )
            if result.returncode != 0:
                output = (result.stderr or result.stdout or "").strip()
                self.send_json(
                    {
                        "published": False,
                        "message": output or "No se pudo publicar los cambios.",
                    },
                    status=500,
                )
                return

        commit_result = subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
        commit_hash = commit_result.stdout.strip() if commit_result.returncode == 0 else ""
        message = "Cambios publicados correctamente."
        if commit_hash:
            message = f"Cambios publicados en {commit_hash}."
        self.send_json({"published": True, "message": message, "commit": commit_hash})


def main() -> None:
    ensure_storage()
    server = ThreadingHTTPServer((HOST, PORT), ProofHandler)
    display_host = "127.0.0.1" if HOST == "0.0.0.0" else HOST
    print(f"Serving on http://{display_host}:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
