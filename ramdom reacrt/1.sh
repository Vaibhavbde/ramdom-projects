#!/bin/bash

mkdir -p ~/react-test-logs

cd ~/project/ramdom-projects/ramdom\ reacrt || exit

for dir in */; do
    if [ -f "$dir/package.json" ]; then
        echo "Testing $dir..."

        (
            cd "$dir" || exit
            timeout 20s npm run dev
        ) > ~/react-test-logs/"${dir%/}.log" 2>&1

        if grep -qiE "ready|localhost|vite|compiled successfully" \
            ~/react-test-logs/"${dir%/}.log"; then
            echo "✅ $dir"
        else
            echo "❌ $dir"
        fi
    fi
done

echo "Finished. Logs are in ~/react-test-logs"
