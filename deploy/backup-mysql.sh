#!/bin/sh
# 每日逻辑备份 MySQL，gzip 压缩并按保留天数滚动删除。
# 由 db-backup 容器循环调用；密码通过 MYSQL_PWD 环境变量传递（mysql 客户端原生支持）。
set -eu

: "${MYSQL_HOST:?MYSQL_HOST required}"
: "${MYSQL_USER:?MYSQL_USER required}"
: "${MYSQL_DATABASE:?MYSQL_DATABASE required}"

INTERVAL="${BACKUP_INTERVAL_SEC:-86400}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"
OUT_DIR="/backups"

mkdir -p "$OUT_DIR"

while true; do
  TS=$(date +%Y%m%d-%H%M%S)
  FILE="$OUT_DIR/$MYSQL_DATABASE-$TS.sql.gz"
  echo "[backup] dumping $MYSQL_DATABASE -> $FILE"
  # --single-transaction: InnoDB 一致性快照不锁表；--quick: 大表流式输出不撑内存
  mysqldump \
    --host="$MYSQL_HOST" \
    --user="$MYSQL_USER" \
    --single-transaction \
    --quick \
    --routines \
    --events \
    "$MYSQL_DATABASE" | gzip > "$FILE"
  echo "[backup] done ($(du -h "$FILE" | cut -f1))"

  find "$OUT_DIR" -name '*.sql.gz' -type f -mtime "+$RETENTION_DAYS" -delete
  echo "[backup] next run after ${INTERVAL}s, retention ${RETENTION_DAYS} days"
  sleep "$INTERVAL"
done
