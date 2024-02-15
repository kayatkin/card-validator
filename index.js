
const cardNumberInput = document.getElementById('card-number-input');
const validateButton = document.getElementById('validate-button');
const visaIcon = document.getElementById('visa-icon');
const mastercardIcon = document.getElementById('mastercard-icon');
const amexIcon = document.getElementById('amex-icon');
const discoverIcon = document.getElementById('discover-icon');
const jcbIcon = document.getElementById('jcb-icon');
const dinersClubIcon = document.getElementById('diners_club-icon');
const mirIcon = document.getElementById('mir-icon');
// Получаем регулярные выражения для проверки номера карты
const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
const mastercardRegex = /^5[1-5][0-9]{14}$/;
const amexRegex = /^3[47][0-9]{13}$/;
const discoverRegex = /^6(?:011|5[0-9]{2})[0-9]{12}$/;
const jcbRegex = /^(?:2131|1800|35\d{3})\d{11}$/;
const dinersClubRegex = /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/;
const mirRegex = /^220[0-4][0-9]{12}$/;

// Функция для проверки номера карты и обновления иконок
function checkCardType() {
    const cardNumber = cardNumberInput.value.replace(/\s/g, '');
    visaIcon.classList.remove('active');
    mastercardIcon.classList.remove('active');
    amexIcon.classList.remove('active');
    discoverIcon.classList.remove('active');
    jcbIcon.classList.remove('active');
    dinersClubIcon.classList.remove('active');
    mirIcon.classList.remove('active');

    if (visaRegex.test(cardNumber)) {
        visaIcon.classList.add('active');
    } else if (mastercardRegex.test(cardNumber)) {
        mastercardIcon.classList.add('active');
    } else if (amexRegex.test(cardNumber)) {
        amexIcon.classList.add('active');
    } else if (discoverRegex.test(cardNumber)) {
        discoverIcon.classList.add('active');
    } else if (jcbRegex.test(cardNumber)) {
        jcbIcon.classList.add('active');
    } else if (dinersClubRegex.test(cardNumber)) {
        dinersClubIcon.classList.add('active');
    } else if (mirRegex.test(cardNumber)) {
        mirIcon.classList.add('active');
    }
}

// Слушаем событие ввода в поле номера карты
cardNumberInput.addEventListener('input', () => {
    checkCardType();
    const validationResult = validateCreditCardNumber(cardNumberInput.value);
    console.log(validationResult);
});

// Слушаем событие клика на кнопке проверки
validateButton.addEventListener('click', () => {
    const validationResult = validateCreditCardNumber(cardNumberInput.value);
    console.log(validationResult);
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
        if (firstDigit === 4) {
            issuer = 'Visa';
        } else if (firstTwoDigits >= 51 && firstTwoDigits <= 55) {
            issuer = 'MasterCard';
        } else if ((firstTwoDigits >= 2221 && firstTwoDigits <= 2720) || (firstDigit >= 222100 && firstDigit <= 272099)) {
            issuer = 'MasterCard';
        } else if ((firstTwoDigits >= 34 && firstTwoDigits <= 37) && digitsOnly.length === 15) {
            issuer = 'American Express';
        } else if ((firstTwoDigits >= 36 && firstTwoDigits <= 38) && digitsOnly.length === 14) {
            issuer = 'Diners Club - International';
        } else if (firstTwoDigits === 54 && digitsOnly.length === 16) {
            issuer = 'Diners Club - USA & Canada';
        } else if ((firstTwoDigits >= 300 && firstTwoDigits <= 305) && digitsOnly.length === 14) {
            issuer = 'Diners Club - Carte Blanche';
        } else if ((firstTwoDigits >= 644 && firstTwoDigits <= 649) || firstTwoDigits === 65 || digitsOnly.startsWith('6011')) {
            issuer = 'Discover';
        } else if ((firstTwoDigits >= 3528 && firstTwoDigits <= 3589) && (digitsOnly.length >= 16 && digitsOnly.length <= 19)) {
            issuer = 'JCB';
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
