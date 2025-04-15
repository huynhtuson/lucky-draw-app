// Khởi tạo biến toàn cục
let prizes = [];
let history = [];
let isSpinning = false;

// Lấy các phần tử DOM
const prizeListTextarea = document.getElementById('prizeList');
const loadDemoButton = document.getElementById('loadDemo');
const clearListButton = document.getElementById('clearList');
const drawButton = document.getElementById('drawButton');
const animationContent = document.getElementById('animationContent');
const resultDisplay = document.getElementById('result');
const historyList = document.getElementById('historyList');
const clearHistoryButton = document.getElementById('clearHistory');

// Danh sách giải thưởng mẫu
const demoPrizes = [
    "Điện thoại iPhone 13",
    "Laptop Dell XPS 13",
    "Tai nghe AirPods Pro",
    "Loa Bluetooth JBL",
    "Đồng hồ thông minh Apple Watch",
    "Máy ảnh Canon EOS",
    "Bàn phím cơ Logitech",
    "Chuột gaming Razer",
    "Thẻ quà tặng 500.000đ",
    "Thẻ quà tặng 1.000.000đ"
];

// Khởi tạo ứng dụng
function init() {
    // Thêm các sự kiện lắng nghe
    loadDemoButton.addEventListener('click', loadDemoList);
    clearListButton.addEventListener('click', clearPrizeList);
    drawButton.addEventListener('click', startDraw);
    clearHistoryButton.addEventListener('click', clearDrawHistory);
    
    // Tải dữ liệu từ localStorage nếu có
    loadFromLocalStorage();
    
    // Kiểm tra danh sách giải thưởng trống
    checkEmptyPrizeList();
}

// Tải danh sách mẫu
function loadDemoList() {
    prizeListTextarea.value = demoPrizes.join('\n');
    updatePrizeList();
    
    // Hiển thị thông báo
    showNotification("Đã tải danh sách mẫu thành công!");
}

// Xóa danh sách giải thưởng
function clearPrizeList() {
    if (prizeListTextarea.value.trim() !== '') {
        if (confirm("Bạn có chắc chắn muốn xóa toàn bộ danh sách giải thưởng?")) {
            prizeListTextarea.value = '';
            updatePrizeList();
            showNotification("Đã xóa danh sách giải thưởng!");
        }
    } else {
        showNotification("Danh sách giải thưởng đã trống!");
    }
}

// Cập nhật danh sách giải thưởng từ textarea
function updatePrizeList() {
    const text = prizeListTextarea.value.trim();
    prizes = text ? text.split('\n').filter(prize => prize.trim() !== '') : [];
    
    // Lưu vào localStorage
    saveToLocalStorage();
    
    // Kiểm tra danh sách giải thưởng trống
    checkEmptyPrizeList();
}

// Kiểm tra danh sách giải thưởng trống
function checkEmptyPrizeList() {
    if (prizes.length === 0) {
        drawButton.disabled = true;
        drawButton.classList.add('disabled');
    } else {
        drawButton.disabled = false;
        drawButton.classList.remove('disabled');
    }
}

// Bắt đầu quay thưởng
function startDraw() {
    // Ngăn chặn quay khi đang trong quá trình quay
    if (isSpinning) return;
    
    // Cập nhật danh sách giải thưởng
    updatePrizeList();
    
    // Kiểm tra xem có giải thưởng nào không
    if (prizes.length === 0) {
        showNotification("Vui lòng nhập danh sách giải thưởng trước khi quay!");
        return;
    }
    
    // Đánh dấu đang trong quá trình quay
    isSpinning = true;
    
    // Vô hiệu hóa nút quay thưởng trong quá trình quay
    drawButton.disabled = true;
    drawButton.classList.add('disabled');
    
    // Hiệu ứng quay
    animationContent.classList.add('spinning');
    
    // Hiển thị các giải thưởng ngẫu nhiên trong quá trình quay
    let counter = 0;
    const duration = 2000; // Thời gian quay (ms)
    const interval = 100; // Khoảng thời gian giữa các lần hiển thị (ms)
    const steps = duration / interval;
    
    const spinInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * prizes.length);
        animationContent.textContent = prizes[randomIndex];
        
        counter++;
        if (counter >= steps) {
            clearInterval(spinInterval);
            finishDraw();
        }
    }, interval);
    
    // Thêm âm thanh (nếu cần)
    playSound('spin');
}

// Kết thúc quay thưởng và hiển thị kết quả
function finishDraw() {
    // Chọn giải thưởng ngẫu nhiên
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const winner = prizes[randomIndex];
    
    // Dừng hiệu ứng quay
    animationContent.classList.remove('spinning');
    animationContent.classList.add('winner');
    animationContent.textContent = winner;
    
    // Hiển thị kết quả
    resultDisplay.textContent = winner;
    
    // Thêm vào lịch sử
    addToHistory(winner);
    
    // Phát âm thanh chiến thắng (nếu cần)
    playSound('win');
    
    // Kích hoạt lại nút quay thưởng
    setTimeout(() => {
        animationContent.classList.remove('winner');
        drawButton.disabled = false;
        drawButton.classList.remove('disabled');
        isSpinning = false;
    }, 1000);
}

// Thêm kết quả vào lịch sử
function addToHistory(prize) {
    // Tạo timestamp
    const now = new Date();
    const timestamp = now.toLocaleString();
    
    // Thêm vào mảng lịch sử
    history.unshift({ prize, timestamp });
    
    // Cập nhật giao diện
    updateHistoryDisplay();
    
    // Lưu vào localStorage
    saveToLocalStorage();
}

// Cập nhật hiển thị lịch sử
function updateHistoryDisplay() {
    historyList.innerHTML = '';
    
    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = `${item.timestamp}: ${item.prize}`;
        historyList.appendChild(historyItem);
    });
    
    // Hiển thị thông báo nếu không có lịch sử
    if (history.length === 0) {
        const emptyItem = document.createElement('div');
        emptyItem.className = 'history-item empty';
        emptyItem.textContent = 'Chưa có lịch sử quay thưởng';
        historyList.appendChild(emptyItem);
    }
    
    // Hiển thị/ẩn nút xóa lịch sử
    clearHistoryButton.style.display = history.length > 0 ? 'block' : 'none';
}

// Xóa lịch sử quay thưởng
function clearDrawHistory() {
    if (history.length > 0) {
        if (confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử quay thưởng?")) {
            history = [];
            updateHistoryDisplay();
            saveToLocalStorage();
            showNotification("Đã xóa lịch sử quay thưởng!");
        }
    } else {
        showNotification("Chưa có lịch sử quay thưởng!");
    }
}

// Lưu dữ liệu vào localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('luckyDrawPrizes', prizeListTextarea.value);
        localStorage.setItem('luckyDrawHistory', JSON.stringify(history));
    } catch (e) {
        console.error('Không thể lưu vào localStorage:', e);
    }
}

// Tải dữ liệu từ localStorage
function loadFromLocalStorage() {
    try {
        // Tải danh sách giải thưởng
        const savedPrizes = localStorage.getItem('luckyDrawPrizes');
        if (savedPrizes) {
            prizeListTextarea.value = savedPrizes;
            updatePrizeList();
        }
        
        // Tải lịch sử
        const savedHistory = localStorage.getItem('luckyDrawHistory');
        if (savedHistory) {
            history = JSON.parse(savedHistory);
            updateHistoryDisplay();
        } else {
            updateHistoryDisplay(); // Hiển thị thông báo trống
        }
    } catch (e) {
        console.error('Không thể tải từ localStorage:', e);
    }
}

// Hiển thị thông báo
function showNotification(message) {
    // Tạo phần tử thông báo
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Thêm vào body
    document.body.appendChild(notification);
    
    // Hiệu ứng hiển thị
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Phát âm thanh (nếu cần)
function playSound(type) {
    // Có thể thêm âm thanh nếu cần
    // Ví dụ:
    // const audio = new Audio(`sounds/${type}.mp3`);
    // audio.play();
}

// Khởi tạo ứng dụng khi trang đã tải xong
document.addEventListener('DOMContentLoaded', init);
