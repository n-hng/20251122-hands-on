#!/bin/bash
set -e

# Start server
npm run dev > server_del.log 2>&1 &
SERVER_PID=$!

echo "Waiting for server..."
sleep 5

cleanup() {
  echo "Stopping server..."
  kill $SERVER_PID
}
trap cleanup EXIT

echo "1. Create some todos..."
curl -s -X POST -H "Content-Type: application/json" -d '{"title":"Task 1"}' http://localhost:3000/todos > /dev/null
curl -s -X POST -H "Content-Type: application/json" -d '{"title":"Task 2"}' http://localhost:3000/todos > /dev/null

echo "2. Verify count > 0"
COUNT=$(curl -s http://localhost:3000/todos | grep -o "id" | wc -l)
if [ "$COUNT" -lt 2 ]; then
  echo "❌ Setup failed: count is $COUNT"
  exit 1
fi
echo "Count: $COUNT (OK)"

echo "3. Execute Delete All"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE http://localhost:3000/todos)

if [ "$HTTP_CODE" -eq 204 ]; then
  echo "✅ Request successful (204)"
else
  echo "❌ Request failed: $HTTP_CODE"
  exit 1
fi

echo "4. Verify count is 0"
FINAL_COUNT=$(curl -s http://localhost:3000/todos | grep -o "id" | wc -l)
if [ "$FINAL_COUNT" -eq 0 ]; then
  echo "✅ Success: All todos deleted"
else
  echo "❌ Failed: Still has $FINAL_COUNT todos"
  exit 1
fi
