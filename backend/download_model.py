"""
Fetches the trained model from S3 onto local disk before the server starts.
Render's free tier has an ephemeral filesystem, so this runs on every boot.
"""
import os
import sys

import boto3


def main():
    bucket = os.environ.get("MODEL_S3_BUCKET")
    key = os.environ.get("MODEL_S3_KEY")
    dest = os.environ.get("MODEL_PATH", "Trained_Model.h5")

    if not bucket or not key:
        print("MODEL_S3_BUCKET / MODEL_S3_KEY not set, skipping model download.")
        return

    if os.path.exists(dest):
        print(f"{dest} already present, skipping download.")
        return

    print(f"Downloading s3://{bucket}/{key} -> {dest}")
    s3 = boto3.client("s3")
    s3.download_file(bucket, key, dest)
    print("Model download complete.")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Model download failed: {e}", file=sys.stderr)
        sys.exit(1)
