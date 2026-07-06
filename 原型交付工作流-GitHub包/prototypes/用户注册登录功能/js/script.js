/* ===== 用户注册登录功能 - 交互脚本 ===== */

(function() {
  "use strict";

  /* ========== 数据层 ========== */
  const DB = {
    _getUsers() {
      return JSON.parse(localStorage.getItem("users") || "[]");
    },
    _saveUsers(users) {
      localStorage.setItem("users", JSON.stringify(users));
    },
    getCurrentUser() {
      return JSON.parse(localStorage.getItem("currentUser") || "null");
    },
    setCurrentUser(email) {
      localStorage.setItem("currentUser", JSON.stringify(email));
    },
    clearCurrentUser() {
      localStorage.removeItem("currentUser");
    },
    findUser(email) {
      return this._getUsers().find(u => u.email === email);
    },
    addUser(email, password) {
      const users = this._getUsers();
      users.push({ email, password, createdAt: new Date().toISOString() });
      this._saveUsers(users);
    },
    emailExists(email) {
      return this._getUsers().some(u => u.email === email);
    }
  };

  /* ========== UI 工具 ========== */
  const UI = {
    showPage(pageId) {
      document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
      const page = document.getElementById(pageId);
      if (page) {
        page.classList.add("active");
        // 触发重排以启动过渡动画
        void page.offsetWidth;
      }
    },
    showToast(msg, type) {
      const toast = document.getElementById("toast");
      toast.textContent = msg;
      toast.className = "toast " + (type || "");
      toast.classList.remove("hidden");
      setTimeout(() => toast.classList.add("hidden"), 3000);
    },
    showError(inputId, errorId, msg) {
      const input = document.getElementById(inputId);
      const errEl = document.getElementById(errorId);
      if (input) input.classList.add("error");
      if (errEl) errEl.textContent = msg;
    },
    clearError(inputId, errorId) {
      const input = document.getElementById(inputId);
      const errEl = document.getElementById(errorId);
      if (input) input.classList.remove("error");
      if (errEl) errEl.textContent = "";
    },
    clearAllErrors() {
      document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
      document.querySelectorAll("input").forEach(el => el.classList.remove("error", "success"));
    }
  };

  /* ========== 验证器 ========== */
  const Validator = {
    email(value) {
      if (!value.trim()) return "请输入邮箱";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "邮箱格式不正确";
      return "";
    },
    password(value) {
      if (!value) return "请输入密码";
      if (value.length < 8) return "密码至少8位";
      if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) return "密码需包含字母和数字";
      return "";
    },
    passwordStrength(value) {
      if (!value) return { level: "", text: "" };
      let score = 0;
      if (value.length >= 8) score++;
      if (value.length >= 12) score++;
      if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
      if (/[0-9]/.test(value)) score++;
      if (/[^a-zA-Z0-9]/.test(value)) score++;
      if (score <= 1) return { level: "weak", text: "弱 - 建议增加长度和复杂度" };
      if (score <= 3) return { level: "medium", text: "中 - 可以更安全" };
      return { level: "strong", text: "强 - 密码安全度良好" };
    }
  };

  /* ========== 页面切换 ========== */
  document.getElementById("link-to-register").addEventListener("click", e => {
    e.preventDefault(); UI.clearAllErrors(); UI.showPage("page-register");
  });
  document.getElementById("link-to-login-from-reg").addEventListener("click", e => {
    e.preventDefault(); UI.clearAllErrors(); UI.showPage("page-login");
  });
  document.getElementById("link-to-forgot").addEventListener("click", e => {
    e.preventDefault(); UI.clearAllErrors(); UI.showPage("page-forgot");
  });
  document.getElementById("link-to-login-from-forgot").addEventListener("click", e => {
    e.preventDefault(); UI.clearAllErrors(); UI.showPage("page-login");
  });
  document.getElementById("btn-logout").addEventListener("click", () => {
    DB.clearCurrentUser();
    UI.clearAllErrors();
    UI.showPage("page-login");
    UI.showToast("已退出登录", "");
  });

  /* ========== 登录表单 ========== */
  document.getElementById("form-login").addEventListener("submit", e => {
    e.preventDefault();
    UI.clearAllErrors();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    let valid = true;
    const emailErr = Validator.email(email);
    if (emailErr) { UI.showError("login-email", "login-email-error", emailErr); valid = false; }
    if (!password) { UI.showError("login-password", "login-password-error", "请输入密码"); valid = false; }
    if (!valid) return;
    const user = DB.findUser(email);
    if (!user || user.password !== password) {
      UI.showError("login-email", "login-email-error", "邮箱或密码错误");
      UI.showToast("邮箱或密码错误", "error");
      return;
    }
    DB.setCurrentUser(email);
    document.getElementById("welcome-text").textContent = "欢迎，" + email;
    UI.showPage("page-home");
    UI.showToast("登录成功", "success");
  });

  /* ========== 注册表单 ========== */
  document.getElementById("form-register").addEventListener("submit", e => {
    e.preventDefault();
    UI.clearAllErrors();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;
    const confirm = document.getElementById("reg-confirm").value;
    let valid = true;
    const emailErr = Validator.email(email);
    if (emailErr) { UI.showError("reg-email", "reg-email-error", emailErr); valid = false; }
    const pwdErr = Validator.password(password);
    if (pwdErr) { UI.showError("reg-password", "reg-password-error", pwdErr); valid = false; }
    if (!confirm) { UI.showError("reg-confirm", "reg-confirm-error", "请确认密码"); valid = false; }
    else if (password !== confirm) { UI.showError("reg-confirm", "reg-confirm-error", "两次密码不一致"); valid = false; }
    if (!valid) return;
    if (DB.emailExists(email)) {
      UI.showError("reg-email", "reg-email-error", "该邮箱已注册");
      UI.showToast("该邮箱已注册", "error");
      return;
    }
    DB.addUser(email, password);
    UI.showToast("注册成功，请登录", "success");
    setTimeout(() => UI.showPage("page-login"), 1000);
  });

  /* ========== 密码强度实时提示 ========== */
  document.getElementById("reg-password").addEventListener("input", function() {
    const strength = Validator.passwordStrength(this.value);
    const hint = document.getElementById("reg-password-hint");
    hint.textContent = strength.text;
    hint.className = "hint " + strength.level;
  });

  /* ========== 忘记密码表单 ========== */
  document.getElementById("form-forgot").addEventListener("submit", e => {
    e.preventDefault();
    UI.clearAllErrors();
    const email = document.getElementById("forgot-email").value.trim();
    const emailErr = Validator.email(email);
    if (emailErr) { UI.showError("forgot-email", "forgot-email-error", emailErr); return; }
    if (!DB.emailExists(email)) {
      UI.showError("forgot-email", "forgot-email-error", "该邮箱未注册");
      UI.showToast("该邮箱未注册", "error");
      return;
    }
    UI.showToast("重置链接已发送到您的邮箱（模拟）", "success");
    setTimeout(() => UI.showPage("page-login"), 3000);
  });

  /* ========== 输入清空错误 ========== */
  document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", function() {
      this.classList.remove("error");
      const errId = this.id + "-error";
      const errEl = document.getElementById(errId);
      if (errEl) errEl.textContent = "";
    });
  });

})();
