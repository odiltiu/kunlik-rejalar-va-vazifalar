import { useEffect, useState } from "react";

const STORAGE_KEY = "kunlik_rejalar";

// Saqlangan rejalarni xavfsiz o'qish (buzilgan yozuv ilovani to'xtatmasligi uchun)
function loadTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

const App = () => {
  const [inputValue, setInputValue] = useState("");
  // Tuzatildi: oldin sahifa yangilansa barcha rejalar yo'qolardi
  const [todoItems, setTodoItems] = useState(loadTodos);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todoItems));
    } catch {
      // xotira yopiq bo'lsa ham ilova ishlayveradi
    }
  }, [todoItems]);

  const doneCount = todoItems.filter((item) => item.isCompleted).length;

  const resetForm = () => {
    setInputValue("");
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const title = inputValue.trim();
    if (title === "") return;

    if (editId !== null) {
      setTodoItems((items) => items.map((item) => (item.id === editId ? { ...item, title } : item)));
    } else {
      // ID saqlangan rejalar bilan to'qnashmasligi uchun vaqtga asoslangan
      setTodoItems((items) => [...items, { id: Date.now(), title, isCompleted: false }]);
    }
    resetForm();
  };

  const handleDelete = (id) => {
    setTodoItems((items) => items.filter((item) => item.id !== id));
    // Tahrirlanayotgan vazifa o'chirilsa, forma oddiy holatga qaytadi
    if (id === editId) resetForm();
  };

  const handleEdit = (todo) => {
    setInputValue(todo.title);
    setEditId(todo.id);
  };

  const handleToggleDone = (id) => {
    setTodoItems((items) =>
      items.map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item)),
    );
  };

  return (
    <div className="app-wrapper">
      <div className="todo-container">
        <div className="todo-header">
          <div className="header-badge">Vazifalar ro'yxati</div>
          <h1>Kuningizni rejalashtiring</h1>
          <p className="header-sub">Bugungi vazifalaringizni belgilang va kuzating</p>
          {todoItems.length > 0 && (
            <div className="stats-bar">
              <span className="stat-chip">{todoItems.length} ta vazifa</span>
              <span className="stat-chip">{doneCount} ta bajarildi</span>
            </div>
          )}
        </div>

        <form className="todo-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="todo-input" className="sr-only">
              {editId !== null ? "Vazifani tahrirlash" : "Yangi vazifa"}
            </label>
            <input
              id="todo-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={editId !== null ? "Vazifani tahrirlang..." : "Yangi vazifa qo'shing..."}
            />
          </div>
          <button type="submit" className="add-btn">
            {editId !== null ? "Saqlash" : "Qo'shish"}
          </button>
          {editId !== null && (
            <button type="button" className="add-btn cancel-btn" onClick={resetForm}>
              Bekor qilish
            </button>
          )}
        </form>

        <div className="todo-list">
          {todoItems.length > 0 ? (
            todoItems.map((value, index) => (
              <div className={`todo-item ${value.isCompleted ? "is-done" : ""}`} key={value.id}>
                <div className="item-left">
                  <span className="item-number">{index + 1}</span>
                  <span className="item-title">{value.title}</span>
                </div>
                <div className="item-actions">
                  {/* Tuzatildi: oldin bajarildi holati ekranda umuman ko'rinmasdi */}
                  <button
                    type="button"
                    className="btn-done"
                    onClick={() => handleToggleDone(value.id)}
                    aria-pressed={value.isCompleted}
                    aria-label={value.isCompleted ? "Bajarilmagan deb belgilash" : "Bajarildi deb belgilash"}
                    title={value.isCompleted ? "Bajarilmagan deb belgilash" : "Bajarildi"}
                  >
                    ✓
                  </button>
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => handleDelete(value.id)}
                    aria-label={`"${value.title}" vazifasini o'chirish`}
                    title="O'chirish"
                  >
                    ✕
                  </button>
                  <button
                    type="button"
                    className="btn-edit"
                    onClick={() => handleEdit(value)}
                    aria-label={`"${value.title}" vazifasini tahrirlash`}
                    title="Tahrirlash"
                  >
                    ✎
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h2>Hech qanday reja yo'q</h2>
              <p>Yuqoridagi formadan yangi vazifa qo'shing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
