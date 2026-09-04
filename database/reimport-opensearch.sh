#!/usr/bin/env bash
set -euo pipefail

YES=0
REGENERATE_ALL_JSON=0
USE_ADMIN=0

for arg in "$@"; do
  case "$arg" in
    --yes|-y)
      YES=1
      ;;
    --admin)
      USE_ADMIN=1
      ;;
    --regenerate-all-json)
      REGENERATE_ALL_JSON=1
      ;;
    *)
      echo "Unknown argument: $arg"
      echo "Usage: $0 [--yes|-y] [--admin] [--regenerate-all-json]"
      exit 1
      ;;
  esac
done

cd "$(dirname "$0")"

ENV_FILE="../server/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

read_env_value() {
  local key="$1"
  local line=""
  local value=""

  line=$(grep -E "^[[:space:]]*${key}[[:space:]]*=" "$ENV_FILE" | tail -n 1 || true)
  if [[ -z "$line" ]]; then
    printf ''
    return
  fi

  value="${line#*=}"
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"

  if [[ "$value" == \"*\" && "$value" == *\" ]]; then
    value="${value:1:${#value}-2}"
  elif [[ "$value" == \'*\' && "$value" == *\' ]]; then
    value="${value:1:${#value}-2}"
  fi

  printf '%s' "$value"
}

OS_ENDPOINT="${OPENSEARCH_ENDPOINT:-}"
if [[ -z "$OS_ENDPOINT" ]]; then
  OS_ENDPOINT="$(read_env_value OPENSEARCH_ENDPOINT)"
fi
if [[ -z "$OS_ENDPOINT" ]]; then
  OS_ENDPOINT="${DOMAIN:-}"
fi
if [[ -z "$OS_ENDPOINT" ]]; then
  OS_ENDPOINT="$(read_env_value DOMAIN)"
fi
if [[ "$USE_ADMIN" == "1" ]]; then
  OS_USER="${ADMIN:-}"
  OS_PASS="${PASSWORD:-}"
  if [[ -z "$OS_USER" ]]; then
    OS_USER="$(read_env_value ADMIN)"
  fi
  if [[ -z "$OS_PASS" ]]; then
    OS_PASS="$(read_env_value PASSWORD)"
  fi
  if [[ -z "$OS_USER" || -z "$OS_PASS" ]]; then
    echo "--admin was specified, but ADMIN and/or PASSWORD were not found."
    echo "Set them in your shell before running, for example:"
    echo "  export ADMIN='<admin-user>'"
    echo "  export PASSWORD='<admin-password>'"
    echo "  ./reimport-opensearch.sh --admin"
    echo "Or add ADMIN=... and PASSWORD=... to ../server/.env."
    exit 1
  fi
else
  OS_USER="${OPENSEARCH_USERNAME:-}"
  if [[ -z "$OS_USER" ]]; then
    OS_USER="$(read_env_value OPENSEARCH_USERNAME)"
  fi
  if [[ -z "$OS_USER" ]]; then
    OS_USER="${ADMIN:-}"
  fi
  if [[ -z "$OS_USER" ]]; then
    OS_USER="$(read_env_value ADMIN)"
  fi
  OS_PASS="${OPENSEARCH_PASSWORD:-}"
  if [[ -z "$OS_PASS" ]]; then
    OS_PASS="$(read_env_value OPENSEARCH_PASSWORD)"
  fi
  if [[ -z "$OS_PASS" ]]; then
    OS_PASS="${PASSWORD:-}"
  fi
  if [[ -z "$OS_PASS" ]]; then
    OS_PASS="$(read_env_value PASSWORD)"
  fi
fi

if [[ -z "$OS_ENDPOINT" ]]; then
  echo "Missing OPENSEARCH_ENDPOINT or DOMAIN in ../server/.env"
  exit 1
fi

case "$OS_ENDPOINT" in
  http*) OS="$OS_ENDPOINT" ;;
  *) OS="https://$OS_ENDPOINT" ;;
esac

CURL_INSECURE="${CURL_INSECURE:-0}"
# plain string (not an array) - bash 3.2 (macOS's default /bin/bash) throws "unbound variable"
# under set -u when expanding an empty array with "${arr[@]}"
CURL_INSECURE_FLAG=""
if [[ "$CURL_INSECURE" == "1" ]]; then
  CURL_INSECURE_FLAG="-k"
fi

curl_os() {
  if [[ -n "$OS_USER" && -n "$OS_PASS" ]]; then
    curl -sS $CURL_INSECURE_FLAG -f -u "$OS_USER:$OS_PASS" -H "Content-Type: application/json" "$@"
  else
    curl -sS $CURL_INSECURE_FLAG -f -H "Content-Type: application/json" "$@"
  fi
}

curl_os_status() {
  local output_file=""
  local status_code=""
  output_file=$(mktemp)

  if [[ -n "$OS_USER" && -n "$OS_PASS" ]]; then
    status_code=$(curl -sS $CURL_INSECURE_FLAG -u "$OS_USER:$OS_PASS" -H "Content-Type: application/json" -o "$output_file" -w "%{http_code}" "$@" || true)
  else
    status_code=$(curl -sS $CURL_INSECURE_FLAG -H "Content-Type: application/json" -o "$output_file" -w "%{http_code}" "$@" || true)
  fi
  printf '%s\n' "$status_code"
  cat "$output_file"
  rm -f "$output_file"
}

delete_index() {
  local index_name="$1"
  local response=""
  local status_code=""

  response=$(curl_os_status -X DELETE "$OS/$index_name?ignore_unavailable=true")
  status_code=$(printf '%s\n' "$response" | head -n 1)

  if [[ "$status_code" =~ ^2 ]]; then
    printf '%s\n' "$response" | tail -n +2
    return
  fi

  echo "Failed to delete $index_name with HTTP $status_code."
  if [[ "$status_code" == "401" || "$status_code" == "403" ]]; then
    echo "The OpenSearch user '${OS_USER:-<none>}' does not have delete permission for $index_name."
    echo "Run again with --admin, or set OPENSEARCH_USERNAME/OPENSEARCH_PASSWORD to a user that can delete and create indexes."
  fi
  printf '%s\n' "$response" | tail -n +2
  exit 1
}

echo "OpenSearch endpoint: $OS"
echo "OpenSearch user: ${OS_USER:-<none>}"
echo "This will delete and recreate: mcaexplorer, denominator, merged, mcaexplorer_index, denominator_age"

if [[ "$YES" != "1" ]]; then
  read -r -p "Continue? Type 'yes' to proceed: " answer
  if [[ "$answer" != "yes" ]]; then
    echo "Cancelled."
    exit 0
  fi
fi

echo "Checking OpenSearch connection..."
curl_os "$OS/"
echo

if [[ "$REGENERATE_ALL_JSON" == "1" ]]; then
  echo "Regenerating data/all.json from source files..."
  node opensearchall.js
else
  echo "Using existing data/all.json. Pass --regenerate-all-json to rebuild it from source files."
  if [[ ! -f data/all.json ]]; then
    echo "Missing data/all.json"
    exit 1
  fi
fi

echo "Deleting old indexes..."
delete_index "mcaexplorer"
echo
delete_index "denominator"
echo
delete_index "mcaexplorer_index"
echo
delete_index "denominator_age"
echo
delete_index "merged"
echo

echo "Creating raw indexes..."
curl_os -X PUT "$OS/mcaexplorer"
echo
curl_os -X PUT "$OS/denominator"
echo
curl_os -X PUT "$OS/merged" -d '{
  "mappings": {
    "properties": {
      "sampleId": { "type": "keyword" },
      "dataset": { "type": "keyword" },
      "denominatorDataset": { "type": "keyword" },
      "chromosome": { "type": "keyword" },
      "type": { "type": "keyword" },
      "beginGrch38": {
        "type": "long",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "endGrch38": {
        "type": "long",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "age": { "type": "integer" },
      "ageMin": { "type": "integer" },
      "ageMax": { "type": "integer" },
      "ageRange": { "type": "keyword" },
      "sex": { "type": "keyword" },
      "smokeNFC": { "type": "keyword" },
      "PopID": { "type": "keyword" },
      "dnaSource": { "type": "keyword" },
      "array": { "type": "keyword" },
      "priorCancer": { "type": "keyword" },
      "incidentCancerHem": { "type": "keyword" },
      "incidentCancerMyeloid": { "type": "keyword" },
      "incidentCancerLymphoid": { "type": "keyword" },
      "callRate": { "type": "keyword" },
      "bafAuto": { "type": "keyword" }
    }
  }
}'
echo

echo "Importing data/all.json into raw indexes..."
node import-opensearchall.js

echo "Raw index counts after import:"
echo "mcaexplorer:"
curl_os "$OS/mcaexplorer/_count"
echo
echo "denominator:"
curl_os "$OS/denominator/_count"
echo
echo "merged:"
curl_os "$OS/merged/_count"
echo

echo "Setting mcaexplorer max_result_window..."
curl_os -X PUT "$OS/mcaexplorer/_settings" -d '{
  "index.max_result_window": 200000
}'
echo

echo "Creating mcaexplorer_index with long coordinate mappings..."
curl_os -X PUT "$OS/mcaexplorer_index" -d '{
  "mappings": {
    "properties": {
      "beginGrch38": {
        "type": "long",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "endGrch38": {
        "type": "long",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      }
    }
  }
}'
echo

echo "Reindexing mcaexplorer -> mcaexplorer_index..."
curl_os -X POST "$OS/_reindex?wait_for_completion=true" -d '{
  "source": {
    "index": "mcaexplorer"
  },
  "dest": {
    "index": "mcaexplorer_index"
  }
}'
echo

echo "Setting mcaexplorer_index max_result_window..."
curl_os -X PUT "$OS/mcaexplorer_index/_settings" -d '{
  "index.max_result_window": 200000
}'
echo

echo "Creating denominator_age with age mappings..."
curl_os -X PUT "$OS/denominator_age" -d '{
  "mappings": {
    "properties": {
      "age": { "type": "integer" },
      "ageMin": { "type": "integer" },
      "ageMax": { "type": "integer" },
      "ageRange": { "type": "keyword" }
    }
  }
}'
echo

echo "Reindexing denominator -> denominator_age with age normalization..."
curl_os -X POST "$OS/_reindex?wait_for_completion=true" -d '{
  "source": {
    "index": "denominator"
  },
  "dest": {
    "index": "denominator_age"
  },
  "script": {
    "lang": "painless",
    "source": "if (ctx._source.age != null) { def ageText = ctx._source.age.toString().trim(); def ageMatcher = /^[0-9]+$/.matcher(ageText); if (ageMatcher.matches()) { ctx._source.age = Integer.parseInt(ageText); if (ctx._source.ageMin == null) ctx._source.ageMin = ctx._source.age; if (ctx._source.ageMax == null) ctx._source.ageMax = ctx._source.age; } else { ctx._source.age = null; } } if (ctx._source.ageRange != null && (ctx._source.ageMin == null || ctx._source.ageMax == null)) { def ageRange = ctx._source.ageRange.toString().trim(); def closedRange = /^(\\d+)\\s*-\\s*(\\d+)$/.matcher(ageRange); def lowerBound = /^(\\d+)\\+$/.matcher(ageRange); def upperBound = /^<(\\d+)$/.matcher(ageRange); if (closedRange.matches()) { ctx._source.ageMin = Integer.parseInt(closedRange.group(1)); ctx._source.ageMax = Integer.parseInt(closedRange.group(2)); } else if (lowerBound.matches()) { ctx._source.ageMin = Integer.parseInt(lowerBound.group(1)); ctx._source.ageMax = 120; } else if (upperBound.matches()) { ctx._source.ageMin = 0; ctx._source.ageMax = Integer.parseInt(upperBound.group(1)) - 1; } } if (ctx._source.ageMin != null) ctx._source.ageMin = Integer.parseInt(ctx._source.ageMin.toString()); if (ctx._source.ageMax != null) ctx._source.ageMax = Integer.parseInt(ctx._source.ageMax.toString());"
  }
}'
echo

echo "Setting denominator_age max_result_window..."
curl_os -X PUT "$OS/denominator_age/_settings" -d '{
  "index.max_result_window": 200000
}'
echo

echo "Setting merged max_result_window..."
curl_os -X PUT "$OS/merged/_settings" -d '{
  "index.max_result_window": 200000
}'
echo

echo "Final counts:"
echo "mcaexplorer:"
curl_os "$OS/mcaexplorer/_count"
echo
echo "denominator:"
curl_os "$OS/denominator/_count"
echo
echo "mcaexplorer_index:"
curl_os "$OS/mcaexplorer_index/_count"
echo
echo "denominator_age:"
curl_os "$OS/denominator_age/_count"
echo
echo "merged:"
curl_os "$OS/merged/_count"
echo

echo "Index list:"
if ! curl_os "$OS/_cat/indices?v"; then
  echo "Skipping index list: current OpenSearch user cannot access _cat/indices."
fi
echo

echo "Done. Restart the server before testing the UI."
