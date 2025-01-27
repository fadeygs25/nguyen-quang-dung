// Hàm 1: Sử dụng Vòng Lặp
var sum_to_n_a = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// Hàm 2: Sử dụng Công Thức Tiến Hóa Số Học
var sum_to_n_b = function(n) {
    return (n * (n + 1)) / 2;
};

// Hàm 3: Sử dụng Đệ Quy
var sum_to_n_c = function(n) {
    if (n <= 1) {
        return n;
    }
    return n + sum_to_n_c(n - 1);
};

// Kiểm tra kết quả
console.log("Sum using loop (1 to 5):", sum_to_n_a(5)); // Kết quả: 15
console.log("Sum using formula (1 to 5):", sum_to_n_b(5)); // Kết quả: 15
console.log("Sum using recursion (1 to 5):", sum_to_n_c(5)); // Kết quả: 15
