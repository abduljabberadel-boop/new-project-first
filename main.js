
const menuBtn = document.querySelector('.menu');
const closeBtn = document.querySelector('.close-btn');
const sideMenu = document.querySelector('.side-menu');

menuBtn.addEventListener('click', () => {
sideMenu.classList.add('active');
document.body.style.overflow = 'hidden'; // منع التمرير عند فتح القائمة
});

closeBtn.addEventListener('click', () => {
sideMenu.classList.remove('active');
document.body.style.overflow = 'auto'; // إعادة التمرير عند إغلاق القائمة
});

// إغلاق القائمة عند النقر خارجها
document.addEventListener('click', (e) => {
if (!sideMenu.contains(e.target) && !menuBtn.contains(e.target) && sideMenu.classList.contains('active')) {
    sideMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}
});

// تأثير العد للأرقام في قسم الإحصائيات
function animateCounters() {
const counters = document.querySelectorAll('.stat-number');
const speed = 200; // السرعة بالمللي ثانية

counters.forEach(counter => {
    const target = +counter.getAttribute('data-count');
    const count = +counter.innerText;
    const increment = target / speed;
    
    if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(animateCounters, 1);
    } else {
        counter.innerText = target;
        counter.classList.add('animated');
    }
});
}

// تشغيل تأثير العد عند التمرير إلى القسم
function checkScroll() {
const statsSection = document.querySelector('.stats');
const sectionPos = statsSection.getBoundingClientRect().top;
const screenPos = window.innerHeight / 1.3;

if (sectionPos < screenPos) {
    animateCounters();
    window.removeEventListener('scroll', checkScroll);
}
}

window.addEventListener('scroll', checkScroll);



    // إدارة القائمة المتنقلة
    document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
        document.querySelector('.nav-links').classList.toggle('active');
    });

    // إدارة خطوات النموذج
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step');
    const progressFill = document.getElementById('progressFill');
    let currentStep = 1;

    // تحديث شريط التقدم
    function updateProgressBar() {
        const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        
        progressSteps.forEach((step, index) => {
            if (index + 1 < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index + 1 === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    // الانتقال بين الخطوات
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = parseInt(this.getAttribute('data-next'));
            
            // التحقق من صحة النموذج قبل الانتقال
            if (validateStep(currentStep)) {
                // إخفاء الخطوة الحالية
                document.getElementById(`step${currentStep}`).classList.remove('active');
                
                // إظهار الخطوة التالية
                document.getElementById(`step${nextStep}`).classList.add('active');
                
                // تحديث الخطوة الحالية
                currentStep = nextStep;
                
                // تحديث شريط التقدم
                updateProgressBar();
                
                // تحديث ملخص الحجز إذا كنا في الخطوة الأخيرة
                if (currentStep === 4) {
                    updateBookingSummary();
                }
            }
        });
    });

    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = parseInt(this.getAttribute('data-prev'));
            
            // إخفاء الخطوة الحالية
            document.getElementById(`step${currentStep}`).classList.remove('active');
            
            // إظهار الخطوة السابقة
            document.getElementById(`step${prevStep}`).classList.add('active');
            
            // تحديث الخطوة الحالية
            currentStep = prevStep;
            
            // تحديث شريط التقدم
            updateProgressBar();
        });
    });

    // التحقق من صحة البيانات في كل خطوة
    function validateStep(step) {
        let isValid = true;
        
        if (step === 1) {
            // التحقق من اختيار نوع الرحلة
            const tripType = document.querySelector('input[name="tripType"]:checked');
            if (!tripType) {
                alert('يرجى اختيار نوع الرحلة');
                isValid = false;
            }
        } else if (step === 2) {
            // التحقق من المعلومات الشخصية
            const fullName = document.getElementById('fullName');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const passengers = document.getElementById('passengers');
            
            if (!fullName.value.trim()) {
                highlightError(fullName);
                isValid = false;
            }
            
            if (!email.value.trim() || !isValidEmail(email.value)) {
                highlightError(email);
                isValid = false;
            }
            
            if (!phone.value.trim() || !isValidPhone(phone.value)) {
                highlightError(phone);
                isValid = false;
            }
            
            if (!passengers.value) {
                highlightError(passengers);
                isValid = false;
            }
            
            if (!isValid) {
                alert('يرجى ملء جميع الحقول المطلوبة بشكل صحيح');
            }
        } else if (step === 3) {
            // التحقق من تفاصيل الرحلة
            const flightClass = document.getElementById('flightClass');
            const fromCity = document.getElementById('fromCity');
            const toCity = document.getElementById('toCity');
            const departureDate = document.getElementById('departureDate');
            
            if (!flightClass.value) {
                highlightError(flightClass);
                isValid = false;
            }
            
            if (!fromCity.value) {
                highlightError(fromCity);
                isValid = false;
            }
            
            if (!toCity.value) {
                highlightError(toCity);
                isValid = false;
            }
            
            if (!departureDate.value) {
                highlightError(departureDate);
                isValid = false;
            }
            
            if (!isValid) {
                alert('يرجى ملء جميع الحقول المطلوبة');
            }
        }
        
        return isValid;
    }

    // إبراز الحقول التي تحتوي على أخطاء
    function highlightError(element) {
        element.style.borderColor = 'var(--accent)';
        element.style.boxShadow = '0 0 0 3px rgba(193, 39, 45, 0.2)';
        
        // إزالة التمييز عند التصحيح
        element.addEventListener('input', function() {
            this.style.borderColor = '';
            this.style.boxShadow = '';
        });
    }

    // التحقق من صحة البريد الإلكتروني
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // التحقق من صحة رقم الهاتف
    function isValidPhone(phone) {
        const phoneRegex = /^05\d{8}$/;
        return phoneRegex.test(phone);
    }

    // تحديث اسم الملف عند اختياره
    function updateFileName(input, elementId) {
        const fileNameElement = document.getElementById(elementId);
        if (input.files.length > 0) {
            fileNameElement.textContent = input.files[0].name;
        } else {
            fileNameElement.textContent = 'لم يتم اختيار ملف';
        }
    }

    // تحديث ملخص الحجز
    function updateBookingSummary() {
        // نوع الرحلة
        const tripType = document.querySelector('input[name="tripType"]:checked');
        document.getElementById('summaryTripType').textContent = 
            tripType.value === 'one-way' ? 'ذهاب فقط' : 
            tripType.value === 'round-trip' ? 'ذهاب وعودة' : 'متعدد الوجهات';
        
        // عدد المسافرين
        const passengers = document.getElementById('passengers');
        document.getElementById('summaryPassengers').textContent = 
            `${passengers.value} ${passengers.value === '1' ? 'مسافر' : 'مسافرين'}`;
        
        // معلومات الرحلة
        const fromCity = document.getElementById('fromCity');
        const toCity = document.getElementById('toCity');
        const departureDate = document.getElementById('departureDate');
        const flightClass = document.getElementById('flightClass');
        
        document.getElementById('summaryFrom').textContent = fromCity.options[fromCity.selectedIndex].text;
        document.getElementById('summaryTo').textContent = toCity.options[toCity.selectedIndex].text;
        document.getElementById('summaryDate').textContent = formatDate(departureDate.value);
        
        // فئة الرحلة
        const classText = {
            'economy': 'الدرجة الاقتصادية',
            'premium-economy': 'الدرجة الاقتصادية المتميزة',
            'business': 'درجة رجال الأعمال',
            'first': 'الدرجة الأولى'
        };
        document.getElementById('summaryClass').textContent = classText[flightClass.value] || '';
        
        // تحديث السعر بناءً على الخدمات الإضافية
        updatePriceSummary();
    }

    // تنسيق التاريخ
    function formatDate(dateString) {
        if (!dateString) return '--/--/----';
        
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    }

    // تحديث ملخص السعر
    function updatePriceSummary() {
        let servicesPrice = 0;
        
        // حساب تكلفة الخدمات الإضافية
        const hotel = document.getElementById('hotel');
        const transport = document.getElementById('transport');
        const meals = document.getElementById('meals');
        const insurance = document.getElementById('insurance');
        
        if (hotel.checked) servicesPrice += 200;
        if (transport.checked) servicesPrice += 150;
        if (meals.checked) servicesPrice += 100;
        if (insurance.checked) servicesPrice += 250;
        
        document.getElementById('servicesPrice').textContent = `${servicesPrice} ريال`;
        
        // حساب السعر الإجمالي
        const basePrice = 750;
        const taxesPrice = 150;
        const totalPrice = basePrice + taxesPrice + servicesPrice;
        
        document.getElementById('totalPrice').textContent = `${totalPrice} ريال`;
    }

    // تأكيد الحجز
    document.getElementById('confirmBooking').addEventListener('click', function() {
        if (validateStep(4)) {
            // جمع بيانات الحجز
            const bookingData = {
                passengerName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                departureCity: document.getElementById('fromCity').options[document.getElementById('fromCity').selectedIndex].text,
                departureAirport: document.getElementById('fromCity').value,
                arrivalCity: document.getElementById('toCity').options[document.getElementById('toCity').selectedIndex].text,
                arrivalAirport: document.getElementById('toCity').value,
                departureDate: formatDate(document.getElementById('departureDate').value),
                departureTime: generateRandomTime(),
                arrivalDate: formatDate(document.getElementById('departureDate').value),
                arrivalTime: generateRandomArrivalTime(),
                flightDuration: calculateFlightDuration(),
                flightNumber: generateFlightNumber(),
                tripType: document.querySelector('input[name="tripType"]:checked').value === 'one-way' ? 'ذهاب فقط' : 
                            document.querySelector('input[name="tripType"]:checked').value === 'round-trip' ? 'ذهاب وعودة' : 'متعدد الوجهات',
                seatClass: document.getElementById('flightClass').options[document.getElementById('flightClass').selectedIndex].text,
                gate: generateRandomGate(),
                seatNumber: generateRandomSeat(),
                flightStatus: "مؤكد",
                bookingRef: generateBookingReference()
            };
            
            // حفظ البيانات في localStorage
            localStorage.setItem('bookingData', JSON.stringify(bookingData));
            
            // توجيه المستخدم إلى صفحة التأكيد
            window.location.href = 'card.html';
        }
    });

    // دالة لتوليد وقت عشوائي للمغادرة
    function generateRandomTime() {
        const hours = Math.floor(Math.random() * 12) + 6; // بين 6 صباحاً و 6 مساءً
        const minutes = Math.random() > 0.5 ? '00' : '30';
        const period = hours < 12 ? 'صباحاً' : 'مساءً';
        const displayHours = hours <= 12 ? hours : hours - 12;
        return `${displayHours}:${minutes} ${period}`;
    }

    // دالة لتوليد وقت وصول عشوائي (بعد ساعتين من المغادرة)
    function generateRandomArrivalTime() {
        const hours = Math.floor(Math.random() * 4) + 8; // بين 8 صباحاً و 12 مساءً
        const minutes = Math.random() > 0.5 ? '00' : '45';
        const period = hours < 12 ? 'صباحاً' : 'مساءً';
        const displayHours = hours <= 12 ? hours : hours - 12;
        return `${displayHours}:${minutes} ${period}`;
    }

    // دالة لحساب مدة الرحلة
    function calculateFlightDuration() {
        const durations = ['1h 30m', '2h 15m', '3h 45m', '5h 20m', '7h 10m'];
        return durations[Math.floor(Math.random() * durations.length)];
    }

    // دالة لتوليد رقم رحلة عشوائي
    function generateFlightNumber() {
        const prefix = 'YM';
        const number = Math.floor(Math.random() * 900) + 100;
        return `${prefix}${number}`;
    }

    // دالة لتوليد بوابة عشوائية
    function generateRandomGate() {
        const letters = ['A', 'B', 'C'];
        const numbers = Math.floor(Math.random() * 30) + 1;
        return `${letters[Math.floor(Math.random() * letters.length)]}${numbers}`;
    }

    // دالة لتوليد مقعد عشوائي
    function generateRandomSeat() {
        const rows = Math.floor(Math.random() * 40) + 10;
        const seats = ['A', 'B', 'C', 'D', 'E', 'F'];
        return `${rows}${seats[Math.floor(Math.random() * seats.length)]}`;
    }

    // دالة لتوليد رقم حجز عشوائي
    function generateBookingReference() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // تحديث السعر عند تغيير الخدمات الإضافية
    document.querySelectorAll('.service-option input').forEach(checkbox => {
        checkbox.addEventListener('change', updatePriceSummary);
    });

    // تعيين الحد الأدنى لتاريخ المغادرة إلى اليوم
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('departureDate').min = today;

    // تحديث شريط التقدم عند تحميل الصفحة
    updateProgressBar();
    
    // بيانات المستخدمين المخزنة
    let users = JSON.parse(localStorage.getItem('airlineUsers')) || {};

    // تهيئة التطبيق
    document.addEventListener('DOMContentLoaded', function() {
        // إعداد القائمة المتنقلة للهواتف
        setupMobileMenu();
        
        // إعداد علامات التبويب
        setupTabs();
        
        // إعداد نموذج تسجيل الدخول
        setupLoginForm();
        
        // إعداد نموذج إنشاء حساب
        setupRegisterForm();
    });

    // إعداد القائمة المتنقلة للهواتف
    function setupMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                menuToggle.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
            });
        }
    }

    // إعداد علامات التبويب
    function setupTabs() {
        const loginTab = document.getElementById('login-tab');
        const registerTab = document.getElementById('register-tab');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const showRegister = document.getElementById('show-register');
        const showLogin = document.getElementById('show-login');
        const formTitle = document.getElementById('form-title');
        const formSubtitle = document.getElementById('form-subtitle');
        
        // عرض نموذج تسجيل الدخول
        function showLoginForm() {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
            formTitle.textContent = 'تسجيل الدخول';
            formSubtitle.textContent = 'أدخل بياناتك للوصول إلى حسابك';
        }
        
        // عرض نموذج إنشاء حساب
        function showRegisterForm() {
            loginTab.classList.remove('active');
            registerTab.classList.add('active');
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
            formTitle.textContent = 'إنشاء حساب';
            formSubtitle.textContent = 'املأ البيانات لإنشاء حساب جديد';
        }
        
        // إضافة المستمعين للأحداث
        loginTab.addEventListener('click', showLoginForm);
        registerTab.addEventListener('click', showRegisterForm);
        showRegister.addEventListener('click', showRegisterForm);
        showLogin.addEventListener('click', showLoginForm);
    }

    // إعداد نموذج تسجيل الدخول
    function setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // الحصول على القيم المدخلة
                const username = document.getElementById('login-username').value.trim();
                const password = document.getElementById('login-password').value;
                
                // إخفاء رسائل الخطأ السابقة
                hideAllErrors();
                
                // التحقق من صحة البيانات
                let isValid = true;
                
                if (!username) {
                    showError('login-username-error', 'يرجى إدخال اسم المستخدم');
                    isValid = false;
                }
                
                if (!password) {
                    showError('login-password-error', 'يرجى إدخال كلمة المرور');
                    isValid = false;
                }
                
                // التحقق من وجود المستخدم وكلمة المرور
                if (isValid) {
                    if (!users[username]) {
                        showError('login-username-error', 'اسم المستخدم غير صحيح');
                        isValid = false;
                    } else if (users[username].password !== password) {
                        showError('login-password-error', 'كلمة المرور غير صحيحة');
                        isValid = false;
                    }
                }
                
                // إذا كانت البيانات صحيحة، توجيه المستخدم إلى الصفحة الرئيسية
                if (isValid) {
                    // تخزين حالة تسجيل الدخول في localStorage
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('currentUser', username);
                    
                    // إظهار رسالة نجاح
                    showSuccessMessage('تم تسجيل الدخول بنجاح! يتم توجيهك إلى الصفحة الرئيسية...');
                    
                    // توجيه المستخدم إلى الصفحة الرئيسية بعد تأخير بسيط
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                }
            });
        }
    }

    // إعداد نموذج إنشاء حساب
    function setupRegisterForm() {
        const registerForm = document.getElementById('registerForm');
        
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // الحصول على القيم المدخلة
                const username = document.getElementById('register-username').value.trim();
                const email = document.getElementById('register-email').value.trim();
                const password = document.getElementById('register-password').value;
                const confirmPassword = document.getElementById('confirm-password').value;
                
                // إخفاء رسائل الخطأ السابقة
                hideAllErrors();
                
                // التحقق من صحة البيانات
                let isValid = true;
                
                if (!username) {
                    showError('register-username-error', 'يرجى إدخال اسم المستخدم');
                    isValid = false;
                } else if (users[username]) {
                    showError('register-username-error', 'اسم المستخدم موجود مسبقاً');
                    isValid = false;
                }
                
                if (!email) {
                    showError('register-email-error', 'يرجى إدخال البريد الإلكتروني');
                    isValid = false;
                } else if (!isValidEmail(email)) {
                    showError('register-email-error', 'البريد الإلكتروني غير صالح');
                    isValid = false;
                }
                
                if (!password) {
                    showError('register-password-error', 'يرجى إدخال كلمة المرور');
                    isValid = false;
                } else if (password.length < 6) {
                    showError('register-password-error', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
                    isValid = false;
                }
                
                if (!confirmPassword) {
                    showError('confirm-password-error', 'يرجى تأكيد كلمة المرور');
                    isValid = false;
                } else if (password !== confirmPassword) {
                    showError('confirm-password-error', 'كلمة المرور غير متطابقة');
                    isValid = false;
                }
                
                // إذا كانت البيانات صحيحة، إنشاء حساب جديد
                if (isValid) {
                    // حفظ المستخدم الجديد
                    users[username] = {
                        email: email,
                        password: password,
                        createdAt: new Date().toISOString()
                    };
                    
                    // حفظ البيانات في localStorage
                    localStorage.setItem('airlineUsers', JSON.stringify(users));
                    
                    // تسجيل الدخول تلقائياً
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('currentUser', username);
                    
                    // إظهار رسالة نجاح
                    showSuccessMessage('تم إنشاء الحساب بنجاح! يتم توجيهك إلى الصفحة الرئيسية...');
                    
                    // توجيه المستخدم إلى الصفحة الرئيسية بعد تأخير بسيط
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                }
            });
        }
    }

    // التحقق من صحة البريد الإلكتروني
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // إظهار رسالة الخطأ
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    // إخفاء جميع رسائل الخطأ
    function hideAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.style.display = 'none';
        });
    }

    // إظهار رسالة النجاح
    function showSuccessMessage(message) {
        // إنشاء عنصر رسالة النجاح
        const successMessage = document.createElement('div');
        successMessage.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #34a853;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(52, 168, 83, 0.4);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                animation: slideInRight 0.3s ease;
            ">
                <span>✅</span>
                <span>${message}</span>
            </div>
        `;
        
        // إضافة تنسيقات الرسوم المتحركة
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        // إضافة الرسالة إلى الصفحة
        document.body.appendChild(successMessage);
        
        // إزالة الرسالة بعد 3 ثوانٍ
        setTimeout(() => {
            if (successMessage.parentElement) {
                successMessage.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => successMessage.remove(), 300);
            }
        }, 3000);
        
        // إضافة تنسيق الخروج
        if (!document.querySelector('#slideOutStyle')) {
            const outStyle = document.createElement('style');
            outStyle.id = 'slideOutStyle';
            outStyle.textContent = `
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(outStyle);
        }
    }
    
    // إدارة القائمة المتنقلة
    document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
        document.querySelector('.nav-links').classList.toggle('active');
    });

    // بيانات الرحلة (عادةً تأتي من قاعدة البيانات أو localStorage)
    // هنا نستخدم بيانات افتراضية للعرض
    const bookingData = {
        passengerName: "أحمد محمد عبدالله",
        bookingRef: "YM8X4T2R9",
        email: "ahmed@example.com",
        phone: "0551234567",
        departureCity: "الرياض",
        departureAirport: "مطار الملك خالد (RUH)",
        departureDate: "السبت 15 يونيو 2024",
        departureTime: "08:30 صباحاً",
        arrivalCity: "دبي",
        arrivalAirport: "مطار دبي الدولي (DXB)",
        arrivalDate: "السبت 15 يونيو 2024",
        arrivalTime: "10:45 صباحاً",
        flightDuration: "2h 15m",
        flightNumber: "YM205",
        tripType: "ذهاب فقط",
        seatClass: "الدرجة الاقتصادية",
        gate: "B12",
        seatNumber: "24A",
        flightStatus: "مجدول"
    };

    // تعبئة البيانات في البطاقة
    document.addEventListener('DOMContentLoaded', function() {
        // محاولة جلب البيانات من localStorage إذا كانت موجودة
        const savedBookingData = localStorage.getItem('bookingData');
        const dataToUse = savedBookingData ? JSON.parse(savedBookingData) : bookingData;
        
        // تعبئة البيانات في العناصر
        document.getElementById('passengerName').textContent = dataToUse.passengerName;
        document.getElementById('bookingRef').textContent = dataToUse.bookingRef;
        document.getElementById('bookingReference').textContent = dataToUse.bookingRef;
        document.getElementById('passengerEmail').textContent = dataToUse.email;
        document.getElementById('passengerPhone').textContent = dataToUse.phone;
        document.getElementById('departureCity').textContent = dataToUse.departureCity;
        document.getElementById('departureAirport').textContent = dataToUse.departureAirport;
        document.getElementById('departureDate').textContent = dataToUse.departureDate;
        document.getElementById('departureTime').textContent = dataToUse.departureTime;
        document.getElementById('arrivalCity').textContent = dataToUse.arrivalCity;
        document.getElementById('arrivalAirport').textContent = dataToUse.arrivalAirport;
        document.getElementById('arrivalDate').textContent = dataToUse.arrivalDate;
        document.getElementById('arrivalTime').textContent = dataToUse.arrivalTime;
        document.getElementById('flightDuration').textContent = dataToUse.flightDuration;
        document.getElementById('flightNumber').textContent = dataToUse.flightNumber;
        document.getElementById('tripType').textContent = dataToUse.tripType;
        document.getElementById('seatClass').textContent = dataToUse.seatClass;
        document.getElementById('gate').textContent = dataToUse.gate;
        document.getElementById('seatNumber').textContent = dataToUse.seatNumber;
        document.getElementById('flightStatus').textContent = dataToUse.flightStatus;
    });

    // زر إرسال البريد الإلكتروني
    document.getElementById('sendEmailBtn').addEventListener('click', function() {
        alert('تم إرسال نسخة من البطاقة إلى بريدك الإلكتروني بنجاح!');
        // في التطبيق الحقيقي، هنا سيتم استدعاء API لإرسال البريد الإلكتروني
    });

    // توليد رمز شريطي فريد (لأغراض العرض)
    document.querySelector('.barcode').textContent = `1234567890${bookingData.bookingRef}`;