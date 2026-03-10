#!/bin/bash
sed -i '' "s/const pageSize = parseInt(searchParams.get('pageSize') || '5000');/const pageSize = parseInt(searchParams.get('pageSize') || '1000');/" src/app/api/stocks/list/route.ts
