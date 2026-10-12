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

    const form =
        document.getElementById("requestForm");

    const formMessage =
        document.getElementById("formMessage");

    if (form && formMessage) {

        form.addEventListener("submit", (event) => {

            event.preventDefault();

            const phone =
                form.querySelector(
                    'input[name="phone"]'
                );

            if (!phone.value.trim()) {

                formMessage.textContent =
                    "Пожалуйста, укажите номер телефона.";

                phone.focus();

                return;
            }


            formMessage.textContent =
                "Спасибо! Заявка принята. В рабочей версии здесь будет отправка на телефон или сервер.";

            form.reset();

        });
    }


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

    const languagePages = {
        kk: "index.html",
        ru: "index-ru.html",
        uz: "indexuz.html",
        tr: "page-tur.html",
        en: "page-en.html"
    };

    if (languageSelect) {
        languageSelect.addEventListener("change", function () {
            const targetUrl = this.value;

            const allowedPages = Object.values(languagePages);

            if (!allowedPages.includes(targetUrl)) {
                console.error("Неизвестная страница языка:", targetUrl);
                return;
            }

            window.location.assign(
                new URL(targetUrl, window.location.href).href
            );
        });

        // Показываем язык текущей страницы в списке
        const currentPage = window.location.pathname.split("/").pop() || "index.html";

        if (Object.values(languagePages).includes(currentPage)) {
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

