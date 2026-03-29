"""
core/converters/video_conv.py
Video conversion via ffmpeg.
 
ffmpeg binary is located in this priority order:
  1. imageio-ffmpeg  (pip package — auto-downloaded, recommended)
  2. assets/ffmpeg/ffmpeg.exe  (manually bundled)
  3. System PATH
"""
from __future__ import annotations
import shutil
import subprocess
from pathlib import Path
from typing import Optional
 
from core.utils.paths import build_output_path
from core.utils.logger import get_logger
 
log = get_logger(__name__)
 
_BUNDLED = Path(__file__).parent.parent.parent / "assets" / "ffmpeg" / "ffmpeg.exe"
 
_PRESETS: dict[str, list[str]] = {
    "mp4": ["-c:v", "libx264", "-preset", "fast", "-crf", "23", "-c:a", "aac"],
    "avi": ["-c:v", "libxvid", "-qscale:v", "4",  "-c:a", "mp3"],
    "mkv": ["-c:v", "libx265", "-preset", "fast", "-crf", "28", "-c:a", "aac"],
    "gif": ["-vf", "fps=10,scale=480:-1:flags=lanczos", "-loop", "0"],
}
 
 
def _ffmpeg() -> str:
    """
    Find ffmpeg binary. Tries three locations in order:
    1. imageio-ffmpeg pip package (auto-downloaded on install)
    2. Manually bundled in assets/ffmpeg/
    3. System PATH
    """
    # ── 1. imageio-ffmpeg (best option — installed via pip) ───────────────────
    try:
        import imageio_ffmpeg
        exe = imageio_ffmpeg.get_ffmpeg_exe()
        log.debug("ffmpeg from imageio-ffmpeg: %s", exe)
        return exe
    except Exception:
        pass
 
    # ── 2. Manually bundled beside the app ───────────────────────────────────
    if _BUNDLED.exists():
        log.debug("ffmpeg from bundled assets: %s", _BUNDLED)
        return str(_BUNDLED)
 
    # ── 3. System PATH ────────────────────────────────────────────────────────
    found = shutil.which("ffmpeg")
    if found:
        log.debug("ffmpeg from PATH: %s", found)
        return found
 
    raise FileNotFoundError(
        "ffmpeg not found.\n\n"
        "Fix: run  pip install imageio-ffmpeg  "
        "(it downloads ffmpeg automatically)."
    )
 
 
def convert_video(
    input_path: str,
    target_format: str,
    output_dir: Optional[str] = None,
) -> str:
    """
    Convert a video file to target_format.
 
    Parameters
    ----------
    input_path    : source video path
    target_format : one of  mp4 / avi / mkv / gif
    output_dir    : output directory override (None = beside source)
    """
    fmt = target_format.lower().strip(".")
    if fmt not in _PRESETS:
        raise ValueError(
            f"Unsupported video format '{fmt}'.\n"
            f"Supported: {list(_PRESETS)}"
        )
 
    out_ext = ".gif" if fmt == "gif" else f".{fmt}"
    out     = build_output_path(input_path, out_ext, output_dir=output_dir)
    log.info("video → %s  |  %s", fmt, out)
 
    cmd    = [_ffmpeg(), "-y", "-i", input_path] + _PRESETS[fmt] + [out]
    result = subprocess.run(cmd, capture_output=True, timeout=600)
 
    if result.returncode != 0:
        err = result.stderr.decode(errors="replace")[-600:]
        raise RuntimeError(f"ffmpeg failed:\n{err}")
 
    log.info("video done: %s", out)
    return out
 