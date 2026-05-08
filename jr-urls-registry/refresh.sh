#!/usr/bin/env bash
# JR URLs Registry refresh — v2
#
# 输入：
#   - skills-data/training-outlines/*.json (课程 metadata)
#   - skills-data/roadmaps/*.json
#   - skills-data/learn-direction-access/*.json
#   - skills-data/wikis/*.json
#   - skills-data/videos/*.json
#   - jiangren.com.au/*-sitemap.xml (URL 完整性 + 长尾)
#
# 输出 (每行 1 条记录，格式 `- URL — Title — Tags`)：
#   - INDEX.md (人工，不动)
#   - courses.md
#   - learn.md (16 directions + chapters)
#   - certifications.md
#   - roadmaps.md
#   - tools.md (手工列表，不动)
#   - wikis.md
#   - videos.md
#   - long-tail.md (sitemap 有但 skills-data 没的 URL，无 metadata)
#
# 用法: bash refresh.sh

set -uo pipefail
# 不加 -e：jq/grep/awk 已自带 fallback，[[...]] 条件可能返回 1 被误杀

# 防止中文/UTF-8 排序失败
export LC_ALL=C.UTF-8 2>/dev/null || export LC_ALL=en_US.UTF-8

REGISTRY="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$REGISTRY/../.." && pwd)"
DATA="$ROOT/skills-data"
DATE="$(date +%Y-%m-%d)"
TMP="$REGISTRY/.tmp"
mkdir -p "$TMP"

DOMAIN="https://jiangren.com.au"

echo "==> Fetching sitemap URLs..."
{
  # 来源 1: 23 个 sub-sitemap (含 ai-new-jobs-analysis、certification-wiki、job-interview-question 等)
  for s in learn program-course certification certification-wiki roadmap blog wiki tools free-resources \
           cheat-sheets interview-question events workshop handbook mentors \
           instructors video university job-interview career-coaching \
           career-impact-map company ai-new-jobs-analysis job-interview-question job; do
    curl -sf -A "Mozilla/5.0" "$DOMAIN/${s}-sitemap.xml" 2>/dev/null \
      | grep -oE "<loc>[^<]+</loc>" | sed 's/<loc>//;s|</loc>||' || true
  done
} | grep -v '/en/' | LC_ALL=C sort -u > "$TMP/all-urls.txt"
echo "Sitemap URLs: $(wc -l < "$TMP/all-urls.txt")"

# 来源 2: Next.js [locale] app router 静态路由（sitemap 不收的入口页：/learn / /career-impact-map / /ai-new-jobs 等）
WEB_ZH="$ROOT/jr-academy-web-zh/src/app/[locale]"
if [[ -d "$WEB_ZH" ]]; then
  echo "==> Pulling Next.js static routes..."
  # awk literal-string match (避开 [ 在 sed/glob 里的 special char 问题)
  find "$WEB_ZH" -name "page.tsx" 2>/dev/null \
    | awk -v p="$WEB_ZH/" '{
        i = index($0, p)
        if (i == 0) next
        s = substr($0, i + length(p))
        sub(/\/page\.tsx$/, "", s)
        sub(/^\(main\)\//, "", s)
        if (s == "" || s == "(main)") next
        # [param] -> <param>
        gsub(/\[/, "<", s)
        gsub(/\]/, ">", s)
        print "/" s
      }' \
    | grep -E "^/[a-z]" \
    | LC_ALL=C sort -u > "$TMP/static-routes.txt"
  echo "Static routes: $(wc -l < "$TMP/static-routes.txt")"
else
  : > "$TMP/static-routes.txt"
fi

# === courses.md (program-course) ===
echo "==> Building courses.md..."
{
  echo "# /program-course Catalog"
  echo ""
  echo "> 格式：\`URL\` — Title — 时长 · 等级 · 学费 · 标签"
  echo "> 数据源：\`skills-data/training-outlines/*.json\` + sitemap"
  echo "> 最近刷新：$DATE"
  echo "> ⚠️ 只收 \`isShown=true\` 的课程；draft / 下架课程不进 registry"
  echo ""
  echo "## 完整列表"
  echo ""
  for f in "$DATA"/training-outlines/*.json; do
    [[ "$f" == *.bak* ]] && continue
    [[ ! -f "$f" ]] && continue

    slug=$(jq -r '.course.slug // empty' "$f" 2>/dev/null)
    [[ -z "$slug" || "$slug" == "null" ]] && continue

    isShown=$(jq -r '.course.isShown // false' "$f" 2>/dev/null)
    [[ "$isShown" != "true" ]] && continue

    # 检查 URL 真的在 sitemap（防止 skills-data 已 sync 但 prod 还没上线）
    grep -qF "/program-course/${slug}" "$TMP/all-urls.txt" || continue

    name=$(jq -r '.course.name // .course.title // ""' "$f" 2>/dev/null | tr -d '\n\r' | sed 's/  */ /g')
    desc=$(jq -r '.course.cardDescription // .course.promoDescription // ""' "$f" 2>/dev/null | tr -d '\n\r' | sed 's/  */ /g')
    duration=$(jq -r '.course.timeLength // ""' "$f" 2>/dev/null)
    level=$(jq -r '.course.level // ""' "$f" 2>/dev/null)
    tuition=$(jq -r '.course.tuition // ""' "$f" 2>/dev/null)

    tags=""
    [[ -n "$duration" && "$duration" != "null" ]] && tags="${tags}${duration} · "
    [[ -n "$level" && "$level" != "null" ]] && tags="${tags}${level} · "
    [[ -n "$tuition" && "$tuition" != "null" ]] && tags="${tags}¥${tuition} · "
    tags="${tags%· }"

    line="- \`/program-course/${slug}\` — **${name}**"
    [[ -n "$desc" && "$desc" != "null" ]] && line="${line} — ${desc}"
    [[ -n "$tags" ]] && line="${line} · ${tags}"
    echo "$line"
  done | LC_ALL=C sort -u
} > "$REGISTRY/courses.md"
echo "  → $({ grep -c "^- " "$REGISTRY/courses.md" || true; }) courses"

# === roadmaps.md ===
echo "==> Building roadmaps.md..."
{
  echo "# /roadmaps Catalog"
  echo ""
  echo "> 格式：\`URL\` — Title — Difficulty · Category · Tags"
  echo "> 数据源：\`skills-data/roadmaps/*.json\` + sitemap"
  echo "> 最近刷新：$DATE"
  echo ""
  echo "## 完整列表"
  echo ""
  for f in "$DATA"/roadmaps/*.json; do
    [[ ! -f "$f" ]] && continue

    slug=$(jq -r '.roadmap.slug // empty' "$f" 2>/dev/null)
    [[ -z "$slug" || "$slug" == "null" ]] && continue

    grep -qF "/roadmaps/${slug}" "$TMP/all-urls.txt" || continue

    title=$(jq -r '.roadmap.title // ""' "$f" 2>/dev/null | tr -d '\n\r')
    desc=$(jq -r '.roadmap.description // ""' "$f" 2>/dev/null | tr -d '\n\r')
    difficulty=$(jq -r '.roadmap.difficulty // ""' "$f" 2>/dev/null)
    category=$(jq -r '.roadmap.category // ""' "$f" 2>/dev/null)
    tags=$(jq -r '(.roadmap.tags // []) | join(",")' "$f" 2>/dev/null | tr -d '\n')

    meta=""
    [[ -n "$difficulty" && "$difficulty" != "null" ]] && meta="${meta}${difficulty} · "
    [[ -n "$category" && "$category" != "null" ]] && meta="${meta}${category} · "
    [[ -n "$tags" && "$tags" != "null" ]] && meta="${meta}[${tags}]"
    meta="${meta%· }"

    line="- \`/roadmaps/${slug}\` — **${title}**"
    [[ -n "$desc" && "$desc" != "null" ]] && line="${line} — ${desc}"
    [[ -n "$meta" ]] && line="${line} · ${meta}"
    echo "$line"
  done | LC_ALL=C sort -u
} > "$REGISTRY/roadmaps.md"
echo "  → $({ grep -c "^- " "$REGISTRY/roadmaps.md" || true; }) roadmaps"

# === learn.md (16 directions + chapters from sitemap) ===
echo "==> Building learn.md..."
{
  echo "# /learn Catalog (16 directions + chapters)"
  echo ""
  echo "> 格式：\`URL\` — Title (chapters URL only, no metadata)"
  echo "> 数据源：\`skills-data/learn-direction-access/*.json\` + sitemap"
  echo "> 最近刷新：$DATE"
  echo ""
  echo "## 16 个学习方向（hub 页）"
  echo ""
  for f in "$DATA"/learn-direction-access/*.json; do
    [[ ! -f "$f" ]] && continue
    slug=$(jq -r '.directionSlug // empty' "$f" 2>/dev/null)
    [[ -z "$slug" || "$slug" == "null" ]] && continue
    grep -qF "/learn/${slug}" "$TMP/all-urls.txt" || continue
    echo "- \`/learn/${slug}\` — ${slug} 学习方向 hub"
  done | LC_ALL=C sort -u
  echo ""
  echo "## Chapter 子页（grep 用，无 metadata 仅 URL）"
  echo ""
  grep -E "^${DOMAIN}/learn/[^/]+/[^/]+$" "$TMP/all-urls.txt" \
    | sed "s|${DOMAIN}||" | LC_ALL=C sort -u | awk '{print "- `" $1 "`"}'
} > "$REGISTRY/learn.md"
echo "  → $({ grep -c "^- " "$REGISTRY/learn.md" || true; }) entries"

# === certifications.md (slug only, schema 复杂未深入提) ===
echo "==> Building certifications.md..."
{
  echo "# /certifications Catalog"
  echo ""
  echo "> 数据源：sitemap (skills-data/wikis 也有但 schema 跨 cert 不齐)"
  echo "> 最近刷新：$DATE"
  echo "> ⚠️ 公开 wiki 是 \`/certifications/{slug}\`；付费产品页才带 \`/exam\`"
  echo ""
  echo "## /certifications/exam (付费产品页)"
  echo ""
  { grep -E "^${DOMAIN}/certifications/exam/[^/]+$" "$TMP/all-urls.txt" || true; } \
    | sed "s|${DOMAIN}||" | LC_ALL=C sort -u | awk '{print "- `" $1 "`"}'
  echo ""
  echo "## /certifications (公开 wiki)"
  echo ""
  { grep -E "^${DOMAIN}/certifications/[^/]+$" "$TMP/all-urls.txt" | { grep -v '/exam' || true; }; } \
    | sed "s|${DOMAIN}||" | LC_ALL=C sort -u | awk '{print "- `" $1 "`"}'
} > "$REGISTRY/certifications.md"
echo "  → $({ grep -c "^- " "$REGISTRY/certifications.md" || true; }) cert URLs"

# === wikis.md ===
echo "==> Building wikis.md..."
{
  echo "# /wiki Catalog"
  echo ""
  echo "> 格式：\`URL\` — Title — Categories"
  echo "> 数据源：\`skills-data/wikis/*.json\`"
  echo "> 最近刷新：$DATE"
  echo ""
  echo "## 完整列表"
  echo ""
  for f in "$DATA"/wikis/*.json; do
    [[ ! -f "$f" ]] && continue
    slug=$(jq -r '.slug // empty' "$f" 2>/dev/null)
    [[ -z "$slug" || "$slug" == "null" ]] && continue
    title=$(jq -r '.title // ""' "$f" 2>/dev/null | tr -d '\n\r')
    cats=$(jq -r '[.categories[]?.name] | join(" / ")' "$f" 2>/dev/null | tr -d '\n\r')

    line="- \`/wiki/${slug}\` — **${title}**"
    [[ -n "$cats" && "$cats" != "null" ]] && line="${line} — ${cats}"
    echo "$line"
  done | LC_ALL=C sort -u
} > "$REGISTRY/wikis.md"
echo "  → $({ grep -c "^- " "$REGISTRY/wikis.md" || true; }) wikis"

# === long-tail.md (sitemap 有但前面 catalog 都没收的) ===
echo "==> Building long-tail.md..."
{
  echo "# Long-tail URLs"
  echo ""
  echo "> sitemap 有但 skills-data 无 metadata 的页面，仅 URL，按 path 前缀分组"
  echo "> 数据源：jiangren.com.au sitemap"
  echo "> 最近刷新：$DATE"
  echo ""

  for prefix in blog free-resources cheat-sheets interview-question events workshop handbook \
                tools mentors instructors job-interview career-coaching career-impact-map \
                university video company; do
    cnt=$({ grep -cE "^${DOMAIN}/${prefix}/" "$TMP/all-urls.txt" 2>/dev/null || true; })
    [[ "$cnt" -eq 0 ]] && continue
    echo "## /${prefix}/* ($cnt URLs)"
    echo ""
    grep -E "^${DOMAIN}/${prefix}/" "$TMP/all-urls.txt" \
      | sed "s|${DOMAIN}||" | LC_ALL=C sort -u | head -50 | awk '{print "- `" $1 "`"}'
    [[ "$cnt" -gt 50 ]] && echo "- _（… 共 $cnt 条，仅显示前 50。完整列表见 sitemap）_"
    echo ""
  done
} > "$REGISTRY/long-tail.md"
echo "  → long-tail prefixes generated"

# === career-impact-map.md (从 long-tail 提升 - 30 条岗位 impact map，写文章常引) ===
echo "==> Building career-impact-map.md..."
{
  echo "# /career-impact-map Catalog"
  echo ""
  echo "> AI 对各岗位的影响地图，写求职/AI 影响话题文章常引"
  echo "> 数据源：jiangren.com.au/career-impact-map-sitemap.xml"
  echo "> 最近刷新：$DATE"
  echo ""
  echo "## 完整列表（30 个职业）"
  echo ""
  { grep -E "^${DOMAIN}/career-impact-map/" "$TMP/all-urls.txt" || true; } \
    | sed "s|${DOMAIN}||" | LC_ALL=C sort -u | awk '{print "- `" $1 "`"}'
} > "$REGISTRY/career-impact-map.md"
echo "  → $({ grep -c "^- " "$REGISTRY/career-impact-map.md" 2>/dev/null || true; }) careers"

# === static-routes.md (Next.js 源码全部顶级路由) ===
echo "==> Building static-routes.md..."
{
  echo "# Next.js 静态路由（所有 page.tsx）"
  echo ""
  echo "> 来源：jr-academy-web-zh/src/app/[locale]/**/page.tsx"
  echo "> sitemap 不一定收录的入口页（hub / 工具 / 落地页）也都在这里"
  echo "> 最近刷新：$DATE"
  echo "> ⚠️ \`<param>\` 是动态段（如 \`<slug>\`）；引用时用真实 slug 替换"
  echo ""
  echo "## 顶级路由"
  echo ""
  awk -F'/' 'NF==2 {print "- `" $0 "`"}' "$TMP/static-routes.txt"
  echo ""
  echo "## 二级及以下路由"
  echo ""
  awk -F'/' 'NF>2' "$TMP/static-routes.txt" | awk '{print "- `" $0 "`"}'
} > "$REGISTRY/static-routes.md"
echo "  → $({ grep -c "^- " "$REGISTRY/static-routes.md" 2>/dev/null || true; }) routes"

rm -rf "$TMP"

echo ""
echo "==> Done. Files in $REGISTRY:"
wc -l "$REGISTRY"/*.md

echo ""
echo "==> INDEX.md / tools.md 是人工维护文件，refresh.sh 不动"
