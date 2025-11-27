#!/usr/bin/env bash
set -e
OUTDIR="results"
mkdir -p "$OUTDIR"

BASE_URL=${BASE_URL:-http://localhost:3000}
DURATION=${DURATION:-10} 
CONNS=(1 5 10)

for c in "${CONNS[@]}"; do
  echo "Running autocannon: connections=$c duration=${DURATION}s..."
  npx autocannon -c $c -d $DURATION -j "$BASE_URL/api/aircraft" > "$OUTDIR/autocannon_c${c}.json"
  curl -s "$BASE_URL/metrics/summary" > "$OUTDIR/metrics_c${c}.json"
done

echo "Benchmark finished. Results in $OUTDIR"