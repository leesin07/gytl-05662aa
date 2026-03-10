#!/usr/bin/env python3
"""
S3文件上传脚本
"""
import os
import sys
import requests
import json

# S3配置
BUCKET_NAME = os.environ.get('COZE_BUCKET_NAME', '')
ENDPOINT_URL = os.environ.get('COZE_BUCKET_ENDPOINT_URL', '')

# 文件路径
FILE_PATH = '/workspace/projects/public/GYTL-Tools-v05662aa-Deploy.tar.gz'
OBJECT_KEY = 'gytl-tools/GYTL-Tools-v05662aa-Deploy.tar.gz'

def upload_file():
    """上传文件到S3"""
    if not BUCKET_NAME or not ENDPOINT_URL:
        print("错误: S3配置缺失")
        return False

    if not os.path.exists(FILE_PATH):
        print(f"错误: 文件不存在: {FILE_PATH}")
        return False

    try:
        # 读取文件
        with open(FILE_PATH, 'rb') as f:
            file_data = f.read()

        print(f"文件大小: {len(file_data)} bytes")

        # 构造上传URL
        upload_url = f"{ENDPOINT_URL}/{BUCKET_NAME}/{OBJECT_KEY}"

        print(f"上传URL: {upload_url}")

        # 上传文件
        response = requests.put(
            upload_url,
            data=file_data,
            headers={
                'Content-Type': 'application/gzip',
                'Content-Length': str(len(file_data))
            }
        )

        if response.status_code in [200, 201]:
            print("✅ 文件上传成功!")
            print(f"下载链接: {upload_url}")
            return True
        else:
            print(f"❌ 上传失败: HTTP {response.status_code}")
            print(f"响应: {response.text}")
            return False

    except Exception as e:
        print(f"❌ 上传失败: {e}")
        return False

if __name__ == '__main__':
    success = upload_file()
    sys.exit(0 if success else 1)
