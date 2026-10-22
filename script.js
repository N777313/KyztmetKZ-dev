/* =========================================================
   ҚЫЗМЕТ KZ
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ================= PHONE ================= */

    // ==========================================
    // ИЗМЕНЯТЬ НОМЕР НУЖНО ТОЛЬКО ЗДЕСЬ
    // ==========================================

    const custom_phone = "+77013130007";


    // Устанавливаем номер для всех ссылок
    // с атрибутом data-phone
    document.querySelectorAll("[data-phone]").forEach((element) => {

        element.href = `tel:${custom_phone}`;

    });


    // Устанавливаем номер текстом
    // для всех элементов с data-phone-display
    document.querySelectorAll("[data-phone-display]").forEach((element) => {

        // Убираем + из начала для более удобного форматирования
        const digits = custom_phone.replace(/\D/g, "");

        let displayPhone = custom_phone;

        if (digits.length === 11 && digits.startsWith("7")) {

            displayPhone =
                "+7 " +
                digits.slice(1, 4) + " " +
                digits.slice(4, 7) + " " +
                digits.slice(7, 9) + " " +
                digits.slice(9, 11);

        }

        element.textContent = displayPhone;

    });


    /* ================= MOBILE MENU ================= */

    const menuToggle = document.getElementById("menuToggle");
    const nav = document.getElementById("nav");

    if (menuToggle && nav) {

        menuToggle.addEventListener("click", () => {

            const isOpen = nav.classList.toggle("active");

            menuToggle.classList.toggle("active", isOpen);

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            document.body.classList.toggle(
                "menu-open",
                isOpen
            );
        });


        nav.querySelectorAll("a").forEach((link) => {

            link.addEventListener("click", () => {

                nav.classList.remove("active");
                menuToggle.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                document.body.classList.remove(
                    "menu-open"
                );
            });

        });
    }


    /* ================= SCROLL ANIMATIONS ================= */

    const revealElements =
        document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observerInstance.unobserve(
                            entry.target
                        );
                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach((element) => {
            observer.observe(element);
        });

    } else {

        revealElements.forEach((element) => {
            element.classList.add("visible");
        });

    }


    /* ================= DEMO FORM ================= */

/* -- Begin 23102026 ------------------------------------------ */


    /* ================= DJANGO REQUEST FORM ================= */

    const API_URL =
        "https://target1000.pythonanywhere.com/api/service-requests/";

    const form =
        document.getElementById("requestForm");

    const formMessage =
        document.getElementById("formMessage");

    if (form && formMessage) {

        const submitButton =
            form.querySelector('button[type="submit"]');

        const translations = {
            kk: {
                sending: "Өтінім жіберілуде...",
                success: "Өтінім қабылданды! Жақында сізбен хабарласамыз.",
                successId: "Өтінім қабылданды! Нөмірі: ",
                error: "Өтінімді жіберу мүмкін болмады. Қайталап көріңіз.",
                phone: "Телефон нөмірін енгізіңіз."
            },

            ru: {
                sending: "Отправляем заявку...",
                success: "Заявка принята! Скоро мы с вами свяжемся.",
                successId: "Заявка принята! Номер заявки: ",
                error: "Не удалось отправить заявку. Попробуйте ещё раз.",
                phone: "Введите номер телефона."
            },

            uz: {
                sending: "Ariza yuborilmoqda...",
                success: "Ariza qabul qilindi! Tez orada siz bilan bog‘lanamiz.",
                successId: "Ariza qabul qilindi! Ariza raqami: ",
                error: "Arizani yuborib bo‘lmadi. Qayta urinib ko‘ring.",
                phone: "Telefon raqamingizni kiriting."
            },

            tr: {
                sending: "Başvurunuz gönderiliyor...",
                success: "Başvurunuz alındı! Yakında sizinle iletişime geçeceğiz.",
                successId: "Başvurunuz alındı! Başvuru numarası: ",
                error: "Başvuru gönderilemedi. Lütfen tekrar deneyin.",
                phone: "Telefon numaranızı girin."
            },

            en: {
                sending: "Submitting your request...",
                success: "Request received! We will contact you soon.",
                successId: "Request received! Request number: ",
                error: "Could not submit your request. Please try again.",
                phone: "Please enter your phone number."
            }
        };

        function getLanguage() {
            const language = (
                document.documentElement.lang || "kk"
            ).toLowerCase().split("-")[0];

            return translations[language]
                ? language
                : "kk";
        }

        function showFormMessage(message, success = false) {
            formMessage.textContent = message;

            formMessage.classList.toggle(
                "is-success",
                success
            );

            formMessage.classList.toggle(
                "is-error",
                !success
            );

            formMessage.setAttribute(
                "role",
                success ? "status" : "alert"
            );
        }

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            // Не допускаем повторную отправку,
            // пока предыдущий запрос ещё выполняется.
            if (submitButton && submitButton.disabled) {
                return;
            }

            if (!form.reportValidity()) {
                return;
            }

            const text = translations[getLanguage()];

            const phoneInput =
                form.querySelector('input[name="phone"]');

            const data = {
                name: form.elements.name
                    ? form.elements.name.value.trim()
                    : "",

                phone: phoneInput
                    ? phoneInput.value.trim()
                    : "",

                message: form.elements.message
                    ? form.elements.message.value.trim()
                    : ""
            };

            if (!data.phone) {
                showFormMessage(text.phone);
                if (phoneInput) phoneInput.focus();
                return;
            }

            if (submitButton) {
                submitButton.disabled = true;
            }

            showFormMessage(text.sending, true);

            try {
                const response = await fetch(API_URL, {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },

                    body: JSON.stringify(data)
                });

                const responseText = await response.text();

                let result;

                try {
                    result = JSON.parse(responseText);
                } catch {
                    throw new Error(
                        `Invalid server response: HTTP ${response.status}`
                    );
                }

                if (!response.ok || result.success !== true) {
                    throw new Error(
                        result.message ||
                        result.error ||
                        `HTTP ${response.status}`
                    );
                }

                const successMessage = result.id
                    ? text.successId + "#" + result.id
                    : text.success;

                showFormMessage(successMessage, true);

                form.reset();

            } catch (error) {
                console.error(
                    "Django request submission failed:",
                    error
                );

                showFormMessage(text.error);

            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                }
            }
        });
    }

    /* ================= END DJANGO REQUEST FORM ================= */



/* -----------  End 23102026 T02:10   --------------------------- */

    /* ================= PHONE MASK ================= */

    const phoneInput =
        document.querySelector(
            'input[name="phone"]'
        );

    if (phoneInput) {

        phoneInput.addEventListener(
            "input",
            (event) => {

                let value =
                    event.target.value.replace(
                        /\D/g,
                        ""
                    );

                if (value.startsWith("8")) {
                    value = "7" + value.slice(1);
                }

                if (!value.startsWith("7")) {
                    value = "7" + value;
                }

                value = value.slice(0, 11);

                let formatted = "+7";

                if (value.length > 1) {
                    formatted +=
                        " " +
                        value.slice(1, 4);
                }

                if (value.length >= 5) {
                    formatted +=
                        " " +
                        value.slice(4, 7);
                }

                if (value.length >= 8) {
                    formatted +=
                        " " +
                        value.slice(7, 9);
                }

                if (value.length >= 10) {
                    formatted +=
                        " " +
                        value.slice(9, 11);
                }

                event.target.value = formatted;
            }
        );
    }

    // ==========================    Language change part

    // ================= LANGUAGE SWITCH =================
    
    const languageSelect = document.getElementById("languageSelect");
    
    if (languageSelect) {
        languageSelect.addEventListener("change", function () {
            const targetUrl = this.value;
    
            if (!targetUrl) return;
    
            // Разрешаем только относительные пути
            if (targetUrl === "./" || /^[a-zA-Z0-9_-]+\.html$/.test(targetUrl)) {
                window.location.assign(
                    new URL(targetUrl, window.location.href).href
                );
            } else {
                console.error("Недопустимый адрес:", targetUrl);
            }
        });
    
        // Определяем текущую страницу
        const currentPage = window.location.pathname.split("/").pop();
    
        if (currentPage === "" || currentPage === "index.html") {
            languageSelect.value = "./";
        } else {
            languageSelect.value = currentPage;
        }
    }
    
    // ==================================================

    /* ================= HEADER SHADOW ================= */

    const header =
        document.getElementById("header");

    const updateHeader = () => {

        if (!header) return;

        if (window.scrollY > 20) {

            header.style.boxShadow =
                "0 8px 30px rgba(24,35,31,0.06)";

        } else {

            header.style.boxShadow = "none";
        }
    };

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

});

