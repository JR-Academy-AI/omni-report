<!--
CSDN 发布前手填：
  - 标签：Cursor / AI 编程 / VS Code / TypeScript / Python
  - 分类专栏：AI 工具实战
  - 封面图：.cursor/rules 完整结构 + Composer 截图
-->

# Cursor 进阶 5 个功能完整代码：.cursor/rules + Composer + Mode 切换（48 学员真实数据）

如果你用 Cursor 6+ 个月还在主要靠 Tab 补全 + Cmd+K——你正在用 30% 的 Cursor。

不是营销文。基于 48 学员 12 个月真实使用数据 + 完整可粘贴 .cursor/rules 配置 + Composer prompt 模板。匠人学院（JR Academy）项目制 AI 工程实战平台（澳洲），P3 模式（Project + Production + Placement）。

---

## 1. 48 学员真实使用率

```
功能                          学员使用率
─────────────────────────────────────
Tab 补全                      100% (baseline)
Cmd+K (Edit mode)              95%
─── 80% 用户止步于上面两个 ───
Composer (Cmd+I)               ~25%  ⚠️ 进阶
@ Files / Folder / Codebase    ~30%  ⚠️ 进阶
.cursor/rules/                 ~10%  ⚠️ 进阶
Mode 切换 4 个                  ~15%  ⚠️ 进阶
Diff 审阅习惯                  ~35%  ⚠️ 进阶
```

每个进阶功能用对省 1-3 小时/天。

---

## 2. 功能 1: Composer (Cmd+I) 完整用法

### 决策表

| 任务 | 工具 | 时间 |
|---|---|---|
| 写下一行 | Tab | 1s |
| 改单文件一段 | Cmd+K | 30s |
| 改单文件多段 + 加 import | **Composer** | 1-2 min |
| 跨 2-5 文件 | **Composer** | 2-5 min |
| 跨 10+ 文件 | **Claude Code** | 5-15 min |

### Composer 完整 prompt 模板

```
Cmd+I 打开 Composer

@users.service.ts @users.controller.ts @users.spec.ts @users.types.ts

Task: Add findByExternalId method to UsersService.

Specifically:
1. Add method signature `findByExternalId(externalId: ExternalUserId): Promise<User>` to UsersService
2. Implementation: query userModel by externalId field, throw UserNotFoundException if not found
3. Update UsersController to expose at GET /users/external/:externalId, add @ApiParam decoration
4. Add unit test for:
   - Happy path: user exists, returns User
   - Not found: throws UserNotFoundException
   - Invalid externalId format: throws BadRequestException

Constraints:
- Use existing UserNotFoundException from src/users/exceptions/
- ExternalUserId type is defined in src/users/types/external-id.types.ts
- Follow existing test patterns in users.spec.ts (use createMockUser helper)

Output the full diff for all 3 files. Don't apply yet.
```

**关键**：
- `@ 文件` 给 Cursor 上下文
- 明确说"Don't apply yet"让你审 diff 再 accept
- 列具体 Constraints 让 Cursor 复用现有 abstractions

### 学员真实对比

```
旧用法 (Cmd+K 一个文件一个文件改):
  9:30 AM   开始改 users.service.ts                   (5 min)
  9:35 AM   复制 import 改 users.controller.ts         (5 min)
  9:42 AM   切到 users.spec.ts 加测试                  (8 min)
  9:50 AM   跑测试，发现 service 返回类型不一致        (3 min)
  9:53 AM   返回 service 修类型                        (3 min)
  9:56 AM   再跑测试通过                               (1 min)
  Total: 25 min

新用法 (Composer):
  9:30 AM   Cmd+I + 上面那段 prompt                   (1 min)
  9:32 AM   Cursor 产出跨 3 文件 diff                  (即时)
  9:33 AM   审 diff: imports 都对, types 都对, 测试覆盖 happy + not-found  (5 min)
  9:38 AM   Cmd+Y accept all                          (即时)
  9:38 AM   跑测试通过                                 (1 min)
  Total: 9 min  (62% 时间节省)
```

---

## 3. 功能 2: @ 引用完整 cheatsheet

```typescript
// @FileName - 单文件全文
// 例：让 AI 看 user.service.ts 全文，然后改 controller
@user.service.ts
Add new endpoint in controller that calls findByEmail.

// @folder-name - 整文件夹（递归）
// 例：让 AI 理解整个 users 模块
@users/
Refactor entire users module to use TypeORM instead of Mongoose.

// @Codebase - 整 codebase (embedding 索引)
// 例：在大 codebase 里找某 pattern
@Codebase
Where do we currently parse JWT tokens? I need to add a new claim.

// @Web - 调 web search 查最新 docs
// 例：查最新 API
@Web
What's the latest LangChain LCEL syntax for chaining tools?

// @Git - 引用 git diff / log / commit
// 例：基于最近 commit 写 PR description
@Git
Write a PR description based on my last 5 commits.

// 联用
@user.service.ts @Web
Update user.service.ts to use the latest Mongoose 8.x syntax for find queries.
```

### 真实学员场景 3 例

**场景 A**: AI 给的代码 import 错了

```
@package.json @src/types/

The UserDTO import is wrong in user.controller.ts. Check what's actually 
exported from @src/types/ and fix the import path.
```

**场景 B**: 不知道某 service 的接口

```
@user.service.ts

What methods does UsersService have? I need to call findByEmail from 
auth.guard.ts.
```

**场景 C**: 重构跨多文件

```
@users/ @auth/

Refactor: rename UserDTO to UserResponseDTO across all files. Show me the 
list of files affected before applying.
```

---

## 4. 功能 3: .cursor/rules/ 完整 5 文件模板

```
.cursor/rules/
├── general.mdc        # 全局规则
├── python.mdc         # *.py
├── typescript.mdc     # *.ts, *.tsx
├── react.mdc          # *.tsx, *.jsx
└── tests.mdc          # *.spec.ts, *.test.ts
```

### general.mdc

```markdown
---
description: General project conventions
alwaysApply: true
---

# Project Conventions

## Naming
- Files: kebab-case (user.service.ts, not UserService.ts)
- Classes: PascalCase
- Functions / vars: camelCase
- Constants: UPPER_SNAKE_CASE

## Imports
- Path aliases (@/services/*) preferred over relative paths (../../services/*)
- Group imports: 1. external libs, 2. @/ aliases, 3. relative

## Comments
- Avoid comments. Code should self-document via clear naming.
- Comments only for WHY (non-obvious decisions), not WHAT.
- Never reference current task, fix, or callers ("used by X", "added for Y").

## Error handling
- Boundary code (controllers, public APIs) MUST validate input with Zod / class-validator
- Internal code trusts callers (no defensive checks)
- Never silently swallow errors (no `catch { return null }`)

## Git commit messages
- Conventional commits format: feat: ..., fix: ..., chore: ...
- First line ≤ 70 chars
- Body explains WHY, not WHAT
```

### typescript.mdc

```markdown
---
description: TypeScript conventions
globs: ["**/*.ts", "**/*.tsx"]
---

# TypeScript

## Types
- Use `interface` for object shapes
- Use `type` for unions / aliases / mapped types
- Avoid `any`. Use `unknown` + type guards if truly unknown.
- All async functions must have explicit return type

## Validation
- Use Zod for runtime validation at boundaries
- Use class-validator for NestJS DTOs

## Generics
- Use semantic names (TUser not T)
- Constraint with extends when possible (T extends BaseModel)
```

### python.mdc

```markdown
---
description: Python conventions
globs: ["**/*.py"]
---

# Python

## Style
- ruff format for all code
- Type hints required for all function signatures (use typing or built-ins like list[str])
- Use `from __future__ import annotations` in Python 3.9+

## Imports
- Group: 1. stdlib, 2. 3rd party, 3. local
- Within each group, alphabetical

## Async
- Default to async unless truly sync operation
- All HTTP / DB calls must be async
- Use httpx for async HTTP (not requests)
```

### react.mdc

```markdown
---
description: React conventions
globs: ["**/*.tsx", "**/*.jsx"]
---

# React

## Components
- Use functional components + hooks (no class components)
- Component file name = Component name (.tsx)
- Props interface above component declaration

## State management
- Local state: useState / useReducer
- Server state: TanStack Query
- Global state: Zustand (avoid Redux for new code)

## Side effects
- useEffect deps array: include all dependencies (no eslint-disable)
- Cleanup function for subscriptions
```

### tests.mdc

```markdown
---
description: Test conventions
globs: ["**/*.spec.ts", "**/*.test.ts"]
---

# Tests

## Structure
- AAA pattern: Arrange / Act / Assert
- Each test has 1 assertion (or 1 cohesive group)
- Test names: should ... when ...

## Mocks
- Use jest.spyOn for partial mocks
- Use jest.fn for full mocks
- Prefer real implementations over mocks when possible

## Coverage
- All public methods: happy path + ≥ 1 error path
- Boundary code: include invalid input tests
```

---

## 5. 功能 4: Mode 切换完整对照表

```
Mode      Trigger              适合                          限制
──────────────────────────────────────────────────────────────────
Ask       Cmd+L → Ask         问 codebase, AI 只读           不改文件
Edit      Cmd+K (selected)    单文件局部改                   仅当前选中
Compose   Cmd+I               跨文件改 + 跨文件审             -
Agent     Cmd+L → Agent       自主跑 (read+write+bash)        需 babysit
```

### Agent mode 安全配置

```json
// .cursor/settings.json (项目级, commit 到 repo)
{
  "agent": {
    "allow_bash": [
      "npm run *",
      "uv run *",
      "pytest *",
      "git status",
      "git diff *",
      "git log *"
    ],
    "deny_bash": [
      "rm -rf",
      "git reset --hard",
      "git push --force",
      "git branch -D"
    ]
  }
}
```

防 Agent mode 自主跑灾难性命令。

---

## 6. 功能 5: Diff 审阅完整 SOP

48 学员真实数据：

```
习惯无脑接受 AI 改动:   bug rate 5.9/千行
习惯看 diff 后再 apply: bug rate 3.4/千行
```

**bug rate 差 42%**。

### Diff 审阅 4 步 SOP

```python
def review_diff(diff: GitDiff) -> "accept" | "reject" | "edit":
    # Step 1: 看 file count
    if diff.file_count >= 3:
        return "重点审 imports + types (跨文件常出错)"
    
    # Step 2: 看 imports diff
    if has_new_imports(diff):
        for imp in new_imports(diff):
            assert exists_in_repo(imp), f"hallucinated import {imp}"
    
    # Step 3: 看 new code 逻辑
    for new_block in new_logic_blocks(diff):
        review_branches(new_block.if_else)
        review_error_handling(new_block.try_catch)
    
    # Step 4: 看 modified code
    for change in modified_code(diff):
        if change.removed_comments:
            warn("AI 删了你的注释，确认是不是有用的")
        if change.renamed_var:
            check_external_callers(change)
    
    return "accept" if all_pass else "edit"
```

### Cursor diff 快捷键

```
Cmd+Y          Accept all
Cmd+N          Reject all
↑ / ↓          前 / 后 hunk
Cmd+→          Accept this hunk
Cmd+←          Reject this hunk
```

**学员习惯**: 单文件改动 Cmd+Y 信任；跨 3+ 文件改动逐 hunk 审。

---

## 7. 5 功能联用 1 天工作流（代码 + 时间表）

```
9:30 AM  Ask mode (Cmd+L → Ask)
         > "What methods does UsersService have?"
         (1 min)

10:00 AM Compose mode (Cmd+I)
         > @users.service.ts @users.controller.ts @users.spec.ts
         > "Add findByExternalId method, expose at GET /users/external/:id, add tests"
         (Cursor 产出 diff，1 min)

10:01 AM Diff 审 (跨 3 文件，逐 hunk 看)
         - users.service.ts: 新 method 用了 ExternalUserId type, 但 import 漏了
         - 手动 @ users.types.ts 重新 prompt 让 Cursor 修
         (5 min)

10:06 AM Tab 补全细节
         (10 min)

10:16 AM 跑测试通过, commit
         (5 min)

10:21 AM Compose mode 写 PR description
         > @Git "Generate PR description from last 5 commits"
         (2 min)

10:23 AM Push PR
         Total: 53 min
```

vs 无脑 Cmd+K only: 同样任务 **2 小时**，且漏 import 几率高。

---

## 8. 招聘信号

```
312 Seek AI Engineer JD: "Cursor / .cursorrules" 频率：
─────────────────────────────────────────
Junior (< 100k):    ~30% (baseline)
Mid (130-160k):     ~45%
Senior+ (≥ 170k):   ~55%
```

Cursor 从 2024 的"加分项"变成 2026 的 **baseline**。

---

## 9. 4 周提升路径

```
Week 1: Composer + @ Files
Week 2: .cursor/rules/ 5 文件
Week 3: Mode 切换 4 种
Week 4: Diff 审阅习惯
```

学员真实: 4 周从"30% Cursor"到"70% Cursor", 工程时间 -25-40%。

---

完整 .cursor/rules 5 文件模板 + Composer prompt 库 + Mode 决策表 + Agent 安全配置在 [JR Academy GitHub](https://github.com/JR-Academy-AI)。

匠人学院 [Vibe Coding 课程](https://jiangren.com.au/learn/vibe-coding) 把这套工作流 12 周打透 + 6 周 mentor 1v1。

---

_本文作者来自匠人学院（[JR Academy](https://jiangren.com.au/learn/vibe-coding)）—— 澳洲项目制 AI 工程实战平台。完整代码 / 数据集 / 模板见 [GitHub](https://github.com/JR-Academy-AI)。_
