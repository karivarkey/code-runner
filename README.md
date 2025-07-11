# ⚙️ Code Runner (C++ | Bun | Docker)

A secure, local-first C++ code execution microservice.  
Built for LeetCode-style evals, notes, and complexity benchmarking.  
Think of it like your own offline judge — but fast and containerized.

---

## 🚀 Features

- 🧠 **Run & Evaluate** C++ code against test cases
- 🧪 **Complexity Check** with average runtime benchmark
- 🐳 Runs inside a lightweight Docker container
- 🔐 Sandbox-style execution with memory & time limits
- 💡 Designed as an internal microservice (like a DB)

---

## 🛠️ Tech Stack

- [Bun](https://bun.sh/) + [ElysiaJS](https://elysiajs.com/)
- `g++` in secure shell with `ulimit`
- Spawned code executes in `/tmp` with cleanup
- Runs on [Google Cloud Run](https://cloud.google.com/run) (free tier compatible)

---

## 🧪 API Endpoints

### `POST /run`

Run C++ code against a single input.

```json
{
  "code": "#include<iostream>\nint main(){ int a,b; std::cin >> a >> b; std::cout << a+b; }",
  "input": "4 5"
}
