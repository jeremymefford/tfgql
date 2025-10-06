#!/usr/bin/env bash
set -euo pipefail

CERT_DIR="certs"
CA_KEY="$CERT_DIR/test-ca.key.pem"
CA_CERT="$CERT_DIR/test-ca.cert.pem"
CA_SERIAL="$CERT_DIR/test-ca.srl"
SERVER_KEY="$CERT_DIR/server.key.pem"
SERVER_CSR="$CERT_DIR/server.csr.pem"
SERVER_CERT="$CERT_DIR/server.cert.pem"
SERVER_CHAIN="$CERT_DIR/server.chain.pem"
SERVER_EXT="$CERT_DIR/server.ext"

if ! command -v openssl >/dev/null 2>&1; then
  echo "openssl is required but not installed" >&2
  exit 1
fi

mkdir -p "$CERT_DIR"
rm -f "$CA_SERIAL" "$SERVER_KEY" "$SERVER_CSR" "$SERVER_CERT" "$SERVER_CHAIN" "$SERVER_EXT"

openssl genrsa -out "$CA_KEY" 4096 >/dev/null 2>&1 || openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -out "$CA_KEY"
openssl req \
  -x509 -new -nodes \
  -key "$CA_KEY" \
  -sha256 \
  -days 365 \
  -out "$CA_CERT" \
  -subj "/CN=TFCE GraphQL Test CA"

openssl req \
  -new -nodes \
  -keyout "$SERVER_KEY" \
  -out "$SERVER_CSR" \
  -subj "/CN=localhost"

cat >"$SERVER_EXT" <<EOT
subjectAltName=DNS:localhost,IP:127.0.0.1
extendedKeyUsage=serverAuth
keyUsage=digitalSignature,keyEncipherment
EOT

openssl x509 \
  -req \
  -in "$SERVER_CSR" \
  -CA "$CA_CERT" \
  -CAkey "$CA_KEY" \
  -CAcreateserial \
  -CAserial "$CA_SERIAL" \
  -out "$SERVER_CERT" \
  -days 365 \
  -sha256 \
  -extfile "$SERVER_EXT"

cat "$SERVER_CERT" "$CA_CERT" > "$SERVER_CHAIN"

rm -f "$SERVER_EXT" "$SERVER_CSR"

echo "Test certificates generated in $CERT_DIR:" \
  && ls -1 "$CERT_DIR"

# alias start_tfce_tls='TFCE_SERVER_TLS_CERT_FILE=certs/server.cert.pem TFCE_SERVER_TLS_KEY_FILE=certs/server.key.pem npm start'

