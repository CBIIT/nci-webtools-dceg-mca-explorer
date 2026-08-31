#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if [[ -n "${DATA_S3_URI:-}" ]]; then
  echo "Downloading data file from ${DATA_S3_URI}..."
  mkdir -p data
  aws s3 cp "${DATA_S3_URI}" data/all.json
fi

exec ./reimport-opensearch.sh --yes
