# 🛠️ PocketBase Collection Guide: `skills`

To power the **Skill Nexus**, you need to create a new collection in your PocketBase dashboard.

## Step 1: Create Collection
1.  Go to your PocketBase Admin UI (usually `http://127.0.0.1:8090/_/`).
2.  Click **"New Collection"**.
3.  **Name**: `skills`
4.  **Type**: `Base` (default)

## Step 2: Add Fields
Add the following fields EXACTLY as written:

| Field Name | Type | Options / Notes |
| :--- | :--- | :--- |
| `title` | **Text** | `Required`, Max Length: 255 |
| `status` | **Select** | Options: `Backlog`, `In Progress`, `Completed`<br>`Required` |
| `target_date` | **Date** | `Required` |
| `category` | **Select** | Options: `Frontend`, `Backend`, `AI`, `DevOps`, `Design`, `Other`<br>`Required` |
| `description` | **Editor** | (Rich Text) |
| `icon` | **Text** | Max Length: 10 (for Emojis like 🚀) |
| `resources_link` | **URL** | |

## Step 3: API Rules
*   **List/Search Rule**: Leave empty (public) or set to `@request.auth.id != ""` (users only).
*   **View Rule**: Same as above.
*   **Create/Update/Delete Rule**: Same as above.

## Step 4: Save
Click **Create** to save the collection. The Skill Nexus page will now automatically work! 🚀
