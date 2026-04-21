# GitHub 推送认证指南

## 问题
推送代码到 GitHub 时提示需要用户名和密码认证。

---

## 解决方案（推荐方法 1）

### 方法 1：使用 Personal Access Token（最简单）

#### 步骤 1：生成 Token

1. **访问**：https://github.com/settings/tokens

2. **点击**：`Generate new token` → `Generate new token (classic)`

3. **填写信息**：
   - Note: `Vercel Deployment`
   - Expiration: `90 days`（或选择 `No expiration`）
   - 勾选权限：
     - ✅ `repo`（全部勾选）

4. **点击**：`Generate token`

5. **复制 Token**（只显示一次，务必保存）：
   ```
   ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

#### 步骤 2：推送代码

在终端执行：

```bash
cd /home/xiaobai/code/biye/woganproject/anything/apps/web

# 推送代码
git push -u origin main
```

**当提示输入用户名和密码时**：
- Username: `muyuchengfengbai`
- Password: `粘贴你的 Token`（不是 GitHub 密码）

---

## 方法 2：使用 SSH（推荐长期使用）

### 步骤 1：生成 SSH 密钥

```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "muyuchengfengbai@users.noreply.github.com"

# 按回车使用默认路径
# 按回车跳过密码（或设置密码）
```

### 步骤 2：复制公钥

```bash
# 显示公钥
cat ~/.ssh/id_ed25519.pub

# 复制输出的内容（以 ssh-ed25519 开头）
```

### 步骤 3：添加到 GitHub

1. **访问**：https://github.com/settings/keys

2. **点击**：`New SSH key`

3. **填写**：
   - Title: `My Computer`
   - Key: 粘贴刚才复制的公钥

4. **点击**：`Add SSH key`

### 步骤 4：修改远程仓库地址

```bash
cd /home/xiaobai/code/biye/woganproject/anything/apps/web

# 修改为 SSH 地址
git remote set-url origin git@github.com:muyuchengfengbai/wogan-project.git

# 推送代码
git push -u origin main
```

---

## 方法 3：使用 GitHub CLI（最方便）

### 步骤 1：安装 GitHub CLI

```bash
# 安装 gh
sudo apt install gh

# 或使用官方脚本
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

### 步骤 2：登录

```bash
# 登录 GitHub
gh auth login

# 选择：
# - GitHub.com
# - HTTPS
# - Yes (authenticate Git)
# - Login with a web browser
# 
# 复制显示的代码，在浏览器中授权
```

### 步骤 3：推送代码

```bash
cd /home/xiaobai/code/biye/woganproject/anything/apps/web

# 推送代码
git push -u origin main
```

---

## 快速操作（推荐）

### 使用 Token 推送（最快）

```bash
cd /home/xiaobai/code/biye/woganproject/anything/apps/web

# 方法 A：在 URL 中包含 Token
git remote set-url origin https://YOUR_TOKEN@github.com/muyuchengfengbai/wogan-project.git
git push -u origin main

# 方法 B：使用 Git 凭据存储
git config --global credential.helper store
git push -u origin main
# 输入用户名和 Token，下次会自动记住
```

---

## 验证推送成功

推送成功后，访问：
https://github.com/muyuchengfengbai/wogan-project

应该能看到你的代码！

---

## 下一步

推送成功后，继续：

1. **创建 Neon 数据库**
   - 访问：https://neon.tech
   - 创建项目：`wogan-db`

2. **部署到 Vercel**
   - 访问：https://vercel.com
   - 导入仓库

---

## 需要帮助？

告诉我你选择哪种方法，我会继续指导！
