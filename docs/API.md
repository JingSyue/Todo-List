
# API文件 - 待辦事項清單應用程式（擴充版）

## 基礎訊息

- **基礎URL**：`https://api.todolistapp.com`
- **內容類型**：`application/json`
- **認證**：使用基於JWT的認證機制，客戶端必須在請求的`Authorization`頭部攜帶有效的JWT令牌。

## 安全性策略

### HTTPS

-所有API請求和回應都必須透過HTTPS協定加密，以防止資料在傳輸過程中被竊聽或篡改。

### JWT認證

- 使用者登入後，伺服器將授予一個JWT令牌給客戶端。客戶端後續的請求必須在`Authorization`頭部攜帶此令牌。
- 令牌應設定合理的過渡時間，例如24小時，並提供令牌續期機制。

### 輸入驗證

- 伺服器對所有輸入進行驗證，防止SQL注入、XSS攻擊等安全威脅。
- 對於敏感資料（如密碼），伺服器端將進行加密儲存。

## 頻率限制

- 為防止API請求和服務攻擊拒絕（DoS），設定API請求頻率進行限制。
- 每位使用者的請求頻率限制為每分鐘最多100次請求。
- 超過限制的請求將回傳`429 Too Many Requests`錯誤。

## API介面

### 用戶認證

#### 註冊

- **URL**：`/api/auth/register`
- **方法**：`POST`
- **參數**：
  - `email` (字串): 使用者信箱
  - `password`（字串）：使用者密碼
- **響應**：
  - `200 OK`：註冊成功
  - `400 Bad Request`：請求參數錯誤

#### 登入

- **URL**：`/api/auth/login`
- **方法**：`POST`
- **參數**：
  - `email` (字串): 使用者信箱
  - `password`（字串）：使用者密碼
- **響應**：
  - `200 OK`：登入成功，回傳`token`
  - `401 Unauthorized`：認證失敗

### 待辦事項管理

#### 建立待辦事項

- **網址**：`/api/todos`
- **方法**：`POST`
- **參數**：
  - `title` (string): 待辦事項標題
  - `description`（字串，可選）：描述
  - `dueDate` (字串，可選): 預設日期（YYYY-MM-DD）
- **響應**：
  - `201 Created`：創造成功
  - `400 Bad Request`：參數錯誤

### 提醒設定

#### 提醒

- **URL**：`/api/todos/{id}/reminders`
- **方法**：`POST`
- **參數**：
  - `type` (string): 提醒類型（`email`, `push`, `sms`）
  - `time` (string): 提醒時間（YYYY-MM-DD HH:MM）
- **響應**：
  - `201 Created`：設定成功
  - `400 Bad Request`：參數錯誤
  - `404 Not Found`：找不到待辦事項

## 錯誤代碼

- `400 Bad Request`：請求的格式錯誤或缺少必要資訊。
- `401 Unauthorized`：認證失敗，令牌無效或退出。
- `403 Forbidden`：使用者無權執行該操作。
- `404 Not Found`：資源找不到。
- `429 Too Many Requests`：請求頻率超限。
- `500 Internal Server Error`：伺服器內部錯誤。

## 附錄

- A. JWT認證流程
- B. 安全最佳實踐
- C. 頻率限制策略詳解

