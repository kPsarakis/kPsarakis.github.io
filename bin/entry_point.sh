#!/bin/bash
set -euo pipefail

echo "Entry point script running"

CONFIG_FILE=_config.yml

manage_gemfile_lock() {
  # Avoid "detected dubious ownership" when repo is volume-mounted
  if command -v git >/dev/null 2>&1; then
    git config --global --add safe.directory '*' || true
  fi

  if [ -f Gemfile.lock ] && command -v git >/dev/null 2>&1; then
    if git ls-files --error-unmatch Gemfile.lock >/dev/null 2>&1; then
      echo "Gemfile.lock is tracked by git, restoring it to tracked state"
      git restore Gemfile.lock 2>/dev/null || true
    else
      echo "Gemfile.lock exists but is not tracked by git; keeping it (will not delete)"
    fi
  elif [ ! -f Gemfile.lock ]; then
    echo "WARNING: Gemfile.lock is missing. Builds may be non-reproducible."
    echo "         Create it with: bundle install (and ideally commit it)."
  fi
}

ensure_bundle_install() {
  # Install gems if needed (no-op if already satisfied)
  echo "Ensuring gems are installed..."
  bundle install
}

jekyll_pid=""

start_jekyll() {
  manage_gemfile_lock
  ensure_bundle_install

  echo "Starting Jekyll..."
  bundle exec jekyll serve \
    --watch \
    --port=8080 \
    --host=0.0.0.0 \
    --livereload \
    --verbose \
    --trace \
    --force_polling &
  jekyll_pid=$!
  echo "Jekyll started with PID ${jekyll_pid}"
}

stop_jekyll() {
  if [ -n "${jekyll_pid}" ] && kill -0 "${jekyll_pid}" >/dev/null 2>&1; then
    echo "Stopping Jekyll (PID ${jekyll_pid})..."
    kill -TERM "${jekyll_pid}" >/dev/null 2>&1 || true

    # Give it a moment to stop gracefully
    for _ in $(seq 1 10); do
      if kill -0 "${jekyll_pid}" >/dev/null 2>&1; then
        sleep 0.2
      else
        break
      fi
    done

    # Hard kill if still alive
    if kill -0 "${jekyll_pid}" >/dev/null 2>&1; then
      echo "Jekyll did not exit; killing..."
      kill -KILL "${jekyll_pid}" >/dev/null 2>&1 || true
    fi
  fi
}

start_jekyll

while true; do
  inotifywait -q -e modify,move,create,delete "${CONFIG_FILE}"
  echo "Change detected to ${CONFIG_FILE}, restarting Jekyll"
  stop_jekyll
  start_jekyll
done
