// 검색 기능
const searchInput = document.getElementById('searchInput');
const shortcutItems = document.querySelectorAll('.shortcut-item');
const categories = document.querySelectorAll('.shortcut-category');

searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();

    categories.forEach(category => {
        let hasVisibleItems = false;
        const items = category.querySelectorAll('.shortcut-item');

        items.forEach(item => {
            const description = item.querySelector('.shortcut-description').textContent.toLowerCase();
            const keys = item.querySelector('.shortcut-keys').textContent.toLowerCase();

            if (description.includes(searchTerm) || keys.includes(searchTerm)) {
                item.style.display = 'flex';
                hasVisibleItems = true;
            } else {
                item.style.display = 'none';
            }
        });

        category.style.display = hasVisibleItems ? 'block' : 'none';
    });
});

// 단축키 항목 클릭 시 클립보드에 복사
shortcutItems.forEach(item => {
    item.addEventListener('click', function() {
        const keys = this.querySelector('.shortcut-keys').textContent;
        navigator.clipboard.writeText(keys).then(() => {
            // 복사 완료 표시
            const originalBg = this.style.backgroundColor;
            this.style.backgroundColor = '#d4edda';
            setTimeout(() => {
                this.style.backgroundColor = originalBg;
            }, 200);
        });
    });
});
