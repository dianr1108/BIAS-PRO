// Entry minimal supaya build sukses tanpa React.
const root = document.getElementById('root');
if (root) {
  root.innerHTML = `
    <style>
      body { font-family: system-ui, Arial, sans-serif; margin: 0; padding: 24px; }
      .ok { display:inline-block; padding:12px 16px; border-radius:12px; background:#eef; }
    </style>
    <div class="ok">BIAS PRO is live ✅</div>
  `;
}
