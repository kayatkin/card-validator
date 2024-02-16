const cardNumberInput = document.getElementById('card-number-input');
const validateButton = document.getElementById('validate-button');
const paymentSystemInfo = document.getElementById('payment-system-info');

// Получаем регулярные выражения для проверки номера карты
const regexes = {
    Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    MasterCard: /^5[1-5][0-9]{14}$/,
    "American Express": /^3[47][0-9]{13}$/,
    Discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    JCB: /^(?:2131|1800|35\d{3})\d{11}$/,
    "Diners Club": /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    Mir: /^220[0-4][0-9]{12}$/
};

const icons = document.querySelectorAll('.card-icon');

// Функция для проверки номера карты и обновления иконок
function checkCardType() {
    const cardNumber = cardNumberInput.value.replace(/\s/g, '');
    icons.forEach(icon => icon.classList.remove('active'));
    
    for (const [system, regex] of Object.entries(regexes)) {
        if (regex.test(cardNumber)) {
            const icon = document.querySelector(`[data-system="${system}"]`);
            if (icon) icon.classList.add('active');
            break; // Выходим из цикла, как только находим соответствующую платежную систему
        }
    }
}

// Слушаем событие ввода в поле номера карты
cardNumberInput.addEventListener('input', () => {
    checkCardType();
});

// Слушаем событие клика на кнопке проверки
validateButton.addEventListener('click', () => {
    const validationResult = validateCreditCardNumber(cardNumberInput.value);
    if (validationResult.valid) {
        paymentSystemInfo.textContent = `Платежная система: ${validationResult.issuer}`;
        paymentSystemInfo.style.color = 'green'; // Цвет успешного сообщения
    } else {
        paymentSystemInfo.textContent = 'Неверный номер карты';
        paymentSystemInfo.style.color = 'red'; // Цвет сообщения об ошибке
    }
});

function validateCreditCardNumber(cardNumber) {
    // Удаление всех нецифровых символов из номера карты
    const digitsOnly = cardNumber.replace(/\D/g, '');

    // Проверка длины номера карты
    if (digitsOnly.length < 13 || digitsOnly.length > 19) {
        return { valid: false, issuer: 'Unknown' };
    }

    // Проверка номера карты по алгоритму Луна
    const isValid = isValidLuhn(digitsOnly);

    // Проверка принадлежности к издателю карты
    let issuer = 'Unknown';
    const firstDigit = parseInt(digitsOnly.charAt(0), 10);
    const firstTwoDigits = parseInt(digitsOnly.substring(0, 2), 10);

    if (isValid) {
        for (const [system, regex] of Object.entries(regexes)) {
            if (regex.test(digitsOnly)) {
                issuer = system;
                break; // Выходим из цикла, как только находим соответствующую платежную систему
            }
        }
    }

    return { valid: isValid, issuer: issuer };
}

function isValidLuhn(digits) {
    let sum = 0;
    let alternate = false;
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits.charAt(i), 10);
        if (alternate) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        alternate = !alternate;
    }
    return sum % 10 === 0;
}
