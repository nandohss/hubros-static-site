import json, subprocess, sys

DIST_ID = "E2R8YKIB0DBO90"

# Buscar config atual
result = subprocess.run(
    ["aws", "cloudfront", "get-distribution-config", "--id", DIST_ID, "--output", "json"],
    capture_output=True, text=True
)
data = json.loads(result.stdout)
etag = data["ETag"]
config = data["DistributionConfig"]

# Atualizar CustomErrorResponses para cobrir 403 e 404
config["CustomErrorResponses"] = {
    "Quantity": 2,
    "Items": [
        {
            "ErrorCode": 403,
            "ResponsePagePath": "/index.html",
            "ResponseCode": "200",
            "ErrorCachingMinTTL": 0
        },
        {
            "ErrorCode": 404,
            "ResponsePagePath": "/index.html",
            "ResponseCode": "200",
            "ErrorCachingMinTTL": 0
        }
    ]
}

# Salvar config atualizada em arquivo temporário
with open("/Users/user/Documents/project_mobile/hubros-static-site/cf_update.json", "w") as f:
    json.dump(config, f)

# Aplicar update no CloudFront
update = subprocess.run(
    [
        "aws", "cloudfront", "update-distribution",
        "--id", DIST_ID,
        "--if-match", etag,
        "--distribution-config", "file:///Users/user/Documents/project_mobile/hubros-static-site/cf_update.json",
        "--output", "json"
    ],
    capture_output=True, text=True
)
if update.returncode == 0:
    print("CloudFront atualizado com sucesso!")
    resp = json.loads(update.stdout)
    print("Status:", resp["Distribution"]["Status"])
else:
    print("ERRO:", update.stderr)
    sys.exit(1)
