/**
 * Phần động duy nhất của một bài học: vẽ sơ đồ Mermaid.
 *
 * Nạp từ CDN qua ES module, nên cần mạng. Không có mạng thì mỗi khối sơ đồ vẫn
 * là text đọc được (xem `pre.mermaid:not([data-processed])` trong lesson.css) -
 * đó là lý do sơ đồ ở đây viết bằng text chứ không xuất ra ảnh.
 *
 * Theme chọn theo `prefers-color-scheme` lúc nạp trang. Đổi theme hệ điều hành
 * giữa lúc đang đọc thì tải lại trang; Mermaid không vẽ lại sơ đồ đã vẽ.
 */
const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;

try {
  const { default: mermaid } =
    await import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs');

  mermaid.initialize({
    // Không dùng `startOnLoad`: nó đăng ký vào sự kiện `load`, mà file này là
    // một module có top-level await, nên tới lúc nó chạy thì `load` đã bắn
    // xong và sơ đồ sẽ nằm nguyên dạng text. Gọi `run()` thẳng.
    startOnLoad: false,
    theme: dark ? 'dark' : 'neutral',
    themeVariables: {
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
      fontSize: '13px',
    },
    // `wrap: false`: bật wrap thì Mermaid cắt nhãn giữa từ bằng dấu gạch nối
    // và `listRequests.next(criteria)` hiện ra thành `…(criteria-`. Nhãn ở đây
    // đều ngắn, nên không wrap là đúng.
    sequence: { useMaxWidth: true, wrap: false },
    flowchart: { useMaxWidth: true, curve: 'basis' },
  });

  await mermaid.run({ querySelector: 'pre.mermaid' });
} catch (error) {
  // Không có mạng là trường hợp bình thường, không phải lỗi cần ồn ào.
  console.info('Mermaid không nạp được; sơ đồ hiển thị dạng text.', error);
}
