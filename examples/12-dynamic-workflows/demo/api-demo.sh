#!/usr/bin/env bash
# Dynamic workflows API demo — run against `pnpm dev` (http://localhost:4111).
# Each "beat" is a talking point in the workshop. Requires: curl, jq.
set -uo pipefail

BASE="${BASE:-http://localhost:4111/api}"
DIR="$(cd "$(dirname "$0")" && pwd)"

beat() {
  echo
  echo "════════════════════════════════════════════════════════"
  echo "  $1"
  echo "════════════════════════════════════════════════════════"
}

beat "Beat 1 — create a workflow over HTTP (no code, no deploy)"
curl -s -X POST "$BASE/stored/workflows" \
  -H 'Content-Type: application/json' \
  -d @"$DIR/greeting-workflow.json" | jq .

beat "Beat 2 — run it IMMEDIATELY (no restart)"
curl -s -X POST "$BASE/workflows/greeting-workflow/start-async" \
  -H 'Content-Type: application/json' \
  -d '{ "inputData": { "name": "Ada" } }' | jq '{status, result}'

beat "Beat 3 — validation rejects a broken graph (nothing persisted)"
curl -s -X POST "$BASE/stored/workflows" \
  -H 'Content-Type: application/json' \
  -d @"$DIR/broken-workflow.json" | jq .

beat "Beat 4 — upsert replaces the live workflow (add a shout step)"
curl -s -X POST "$BASE/stored/workflows" \
  -H 'Content-Type: application/json' \
  -d @"$DIR/greeting-workflow-v2.json" | jq .
curl -s -X POST "$BASE/workflows/greeting-workflow/start-async" \
  -H 'Content-Type: application/json' \
  -d '{ "inputData": { "name": "Ada" } }' | jq '{status, result}'

beat "Beat 5 — definitions are persisted (list; restart server, run again)"
curl -s "$BASE/stored/workflows" | jq '{total, ids: [.workflows[].id]}'
echo
echo "Now restart the dev server and re-run Beat 2 — the workflow is still there."
