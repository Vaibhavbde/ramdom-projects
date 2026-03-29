"""
main.py — Entry point for File Converter.
Works both as:
  - python main.py          (normal development)
  - FileConverter.exe       (PyInstaller bundle)
"""
import sys
import os


def _setup_path() -> str:
    """
    Return the project root and add it to sys.path.

    When frozen by PyInstaller, files are extracted to sys._MEIPASS.
    When running normally, root is the folder containing this file.
    """
    if getattr(sys, "frozen", False):
        # Running as PyInstaller .exe
        root = sys._MEIPASS
    else:
        # Running as normal Python script
        root = os.path.dirname(os.path.abspath(__file__))

    if root not in sys.path:
        sys.path.insert(0, root)

    return root


ROOT = _setup_path()


from core.utils.logger import get_logger
log = get_logger("main")


def main() -> None:
    log.info("File Converter starting  |  root=%s  frozen=%s",
             ROOT, getattr(sys, "frozen", False))
    try:
        from gui.app import App
        App().mainloop()
    except Exception:
        log.critical("Fatal startup error", exc_info=True)
        raise


if __name__ == "__main__":
    main()
