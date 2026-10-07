import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL =
    "https://aakbqwlksrqjcrbkbwrw.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_xKfIvvXO66xxi3oeZn7HnA_YZlsvT7F"; 

const supabase =
    createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

console.log("Supabase connecté ✅");

// ==========================================
// STALAY CONTROL
// VERSION 3 — COMPTES + PERMISSIONS
// ==========================================


// ==========================================
// COMPTES
// ==========================================

let ownerAccount =
    JSON.parse(
        localStorage.getItem("stalay_owner")
    ) || null;

let accounts =
    JSON.parse(
        localStorage.getItem("stalay_accounts")
    ) || [];

let currentUser =
    JSON.parse(
        sessionStorage.getItem("stalay_current_user")
    ) || null;


// ==========================================
// DONNÉES
// ==========================================

let sales =
    JSON.parse(
        localStorage.getItem("stalay_sales")
    ) || [];

let products =
    JSON.parse(
        localStorage.getItem("stalay_products")
    ) || [];

let employees =
    JSON.parse(
        localStorage.getItem("stalay_employees")
    ) || [];


// ==========================================
// ELEMENTS
// ==========================================

const loginScreen =
    document.getElementById("login-screen");

const loginForm =
    document.getElementById("login-form");

const loginError =
    document.getElementById("login-error");

const createOwnerButton =
    document.getElementById("create-owner-button");

const navItems =
    document.querySelectorAll(
        ".nav-item[data-section]"
    );

const sections =
    document.querySelectorAll(
        ".page-section"
    );

const pageTitle =
    document.getElementById("page-title");


// ==========================================
// CRÉER COMPTE PATRON
// ==========================================

if (createOwnerButton) {

    createOwnerButton.addEventListener(
        "click",
        () => {

            if (ownerAccount) {

                alert(
                    "Un compte patron existe déjà."
                );

                return;
            }

            const name =
                prompt(
                    "Nom du patron :"
                );

            if (!name) return;

            const username =
                prompt(
                    "Choisissez votre identifiant :"
                );

            if (!username) return;

            const code =
                prompt(
                    "Choisissez votre code personnel :"
                );

            if (!code) return;

            const cleanUsername =
                username
                    .trim()
                    .toLowerCase();

            ownerAccount = {

                name:
                    name.trim(),

                username:
                    cleanUsername,

                code:
                    code

            };

            localStorage.setItem(
                "stalay_owner",
                JSON.stringify(ownerAccount)
            );

            alert(
                "Compte patron créé avec succès ✅"
            );

        }
    );

}


// ==========================================
// CONNEXION
// ==========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const username =
                document.getElementById(
                    "login-username"
                ).value
                    .trim()
                    .toLowerCase();

            const code =
                document.getElementById(
                    "login-password"
                ).value;

            // ==========================
            // 👑 CONNEXION PATRON
            // ==========================

            if (
                ownerAccount &&
                username === ownerAccount.username &&
                code === ownerAccount.code
            ) {

                currentUser = {

                    name:
                        ownerAccount.name,

                    username:
                        ownerAccount.username,

                    role:
                        "owner"

                };

                sessionStorage.setItem(
                    "stalay_current_user",
                    JSON.stringify(currentUser)
                );

                loginError.textContent = "";

                showApp();

                return;
            }


            // ==========================
            // 👤 CONNEXION EMPLOYÉ
            // ==========================

            const employee =
                accounts.find(
                    account =>
                        account.username === username &&
                        account.code === code
                );

            if (employee) {

                currentUser = {

                    name:
                        employee.name,

                    username:
                        employee.username,

                    role:
                        "employee"

                };

                sessionStorage.setItem(
                    "stalay_current_user",
                    JSON.stringify(currentUser)
                );

                loginError.textContent = "";

                showApp();

                return;
            }


            // ==========================
            // ❌ IDENTIFIANTS INCORRECTS
            // ==========================

            loginError.textContent =
                "Identifiant ou code incorrect.";

        }
    );

}


// ==========================================
// AFFICHER L'APPLICATION
// ==========================================

function showApp() {

    if (!currentUser) {
        return;
    }

    loginScreen.style.display =
        "none";

    const profileName =
        document.querySelector(
            ".profile strong"
        );

    const profileRole =
        document.querySelector(
            ".profile small"
        );

    if (profileName) {

        profileName.textContent =
            currentUser.name;

    }

    if (profileRole) {

        profileRole.textContent =
            currentUser.role === "owner"
                ? "Patron"
                : "Employé";

    }

    applyPermissions();

    // L'employé arrive directement sur les ventes
    if (
        currentUser.role === "employee"
    ) {

        showSection("sales");

    }

}


// ==========================================
// 🔐 PERMISSIONS
// ==========================================

function applyPermissions() {

    const isOwner =
        currentUser &&
        currentUser.role === "owner";


    const employeesButton =
        document.querySelector(
            '[data-section="employees"]'
        );

    const reportsButton =
        document.querySelector(
            '[data-section="reports"]'
        );

    const settingsButton =
        document.querySelector(
            '[data-section="settings"]'
        );

    const productsButton =
        document.querySelector(
            '[data-section="products"]'
        );


    // ======================================
    // 👤 EMPLOYÉ
    // ======================================

    if (!isOwner) {

        if (employeesButton) {

            employeesButton.style.display =
                "none";

        }

        if (reportsButton) {

            reportsButton.style.display =
                "none";

        }

        if (settingsButton) {

            settingsButton.style.display =
                "none";

        }

        // Produits autorisés
        if (productsButton) {

            productsButton.style.display =
                "";

        }

    }


    // ======================================
    // 👑 PATRON
    // ======================================

    else {

        if (employeesButton) {

            employeesButton.style.display =
                "";

        }

        if (reportsButton) {

            reportsButton.style.display =
                "";

        }

        if (settingsButton) {

            settingsButton.style.display =
                "";

        }

        if (productsButton) {

            productsButton.style.display =
                "";

        }

    }

}


// ==========================================
// NAVIGATION
// ==========================================

navItems.forEach(
    item => {

        item.addEventListener(
            "click",
            () => {

                const sectionName =
                    item.dataset.section;

                // Protection supplémentaire
                if (
                    currentUser &&
                    currentUser.role === "employee" &&
                    (
                        sectionName === "employees" ||
                        sectionName === "reports" ||
                        sectionName === "settings"
                    )
                ) {

                    alert(
                        "Cette section est réservée au patron."
                    );

                    return;

                }

                showSection(
                    sectionName
                );

            }
        );

    }
);


// ==========================================
// AFFICHER UNE SECTION
// ==========================================

function showSection(
    sectionName
) {

    sections.forEach(
        section => {

            section.classList.remove(
                "active-section"
            );

        }
    );


    const selectedSection =
        document.getElementById(
            sectionName
        );

    if (selectedSection) {

        selectedSection.classList.add(
            "active-section"
        );

    }


    navItems.forEach(
        item => {

            item.classList.remove(
                "active"
            );

            if (
                item.dataset.section ===
                sectionName
            ) {

                item.classList.add(
                    "active"
                );

            }

        }
    );


    const titles = {

        dashboard:
            "Tableau de bord",

        sales:
            "Ventes",

        products:
            "Produits",

        employees:
            "Employés",

        reports:
            "Rapports",

        settings:
            "Paramètres"

    };


    if (pageTitle) {

        pageTitle.textContent =
            titles[sectionName] ||
            "Stalay Control";

    }

}


// ==========================================
// FORMAT FCFA
// ==========================================

function formatFCFA(
    amount
) {

    return Number(
        amount
    ).toLocaleString(
        "fr-FR"
    ) + " FCFA";

}


// ==========================================
// MODAL VENTE
// ==========================================

const saleModal =
    document.getElementById(
        "sale-modal"
    );

const saleForm =
    document.getElementById(
        "sale-form"
    );

const openSaleButton =
    document.getElementById(
        "open-sale-button"
    );

const openSaleButton2 =
    document.getElementById(
        "open-sale-button-2"
    );

const quickSale =
    document.getElementById(
        "quick-sale"
    );

const closeSaleModal =
    document.getElementById(
        "close-sale-modal"
    );


function openSaleModal() {

    if (!currentUser) {
        return;
    }

    saleModal.classList.add(
        "show"
    );

    const input =
        document.getElementById(
            "sale-product"
        );

    if (input) {
        input.focus();
    }

}


function closeModal() {

    saleModal.classList.remove(
        "show"
    );

    saleForm.reset();

}


if (openSaleButton) {

    openSaleButton.addEventListener(
        "click",
        openSaleModal
    );

}

if (openSaleButton2) {

    openSaleButton2.addEventListener(
        "click",
        openSaleModal
    );

}

if (quickSale) {

    quickSale.addEventListener(
        "click",
        openSaleModal
    );

}

if (closeSaleModal) {

    closeSaleModal.addEventListener(
        "click",
        closeModal
    );

}

if (saleModal) {

    saleModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                saleModal
            ) {

                closeModal();

            }

        }
    );

}


// ==========================================
// AJOUTER UNE VENTE
// ==========================================

if (saleForm) {

    saleForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            if (!currentUser) {

                alert(
                    "Vous devez être connecté."
                );

                return;

            }

            const product =
                document.getElementById(
                    "sale-product"
                ).value.trim();

            const amount =
                Number(
                    document.getElementById(
                        "sale-amount"
                    ).value
                );


            if (
                !product ||
                amount <= 0
            ) {

                alert(
                    "Veuillez remplir correctement les informations."
                );

                return;

            }


            const sale = {

                id:
                    Date.now(),

                product:
                    product,

                amount:
                    amount,

                date:
                    new Date().toISOString(),

                seller:
                    currentUser.name

            };


            sales.unshift(
                sale
            );

            saveData();

            updateDashboard();

            renderSales();

            closeModal();


            alert(
                "Vente enregistrée avec succès ✅"
            );

        }
    );

}


// ==========================================
// SAUVEGARDE
// ==========================================

function saveData() {

    localStorage.setItem(
        "stalay_sales",
        JSON.stringify(sales)
    );

    localStorage.setItem(
        "stalay_products",
        JSON.stringify(products)
    );

    localStorage.setItem(
        "stalay_employees",
        JSON.stringify(employees)
    );

}


// ==========================================
// 👑 AJOUTER UN EMPLOYÉ
// ==========================================

const addEmployeeButton =
    document.getElementById(
        "add-employee-button"
    );


if (addEmployeeButton) {

    addEmployeeButton.addEventListener(
        "click",
        () => {

            if (
                !currentUser ||
                currentUser.role !== "owner"
            ) {

                alert(
                    "Seul le patron peut créer un compte employé."
                );

                return;

            }


            const name =
                prompt(
                    "Nom de l'employé :"
                );

            if (!name) return;


            const username =
                prompt(
                    "Identifiant de l'employé :"
                );

            if (!username) return;


            const code =
                prompt(
                    "Code de l'employé :"
                );

            if (!code) return;


            const cleanUsername =
                username
                    .trim()
                    .toLowerCase();


            // Vérifier l'identifiant
            const exists =
                accounts.some(
                    account =>
                        account.username ===
                        cleanUsername
                );


            if (exists) {

                alert(
                    "Cet identifiant existe déjà."
                );

                return;

            }


            const employee = {

                id:
                    Date.now(),

                name:
                    name.trim(),

                username:
                    cleanUsername,

                code:
                    code

            };


            accounts.push(
                employee
            );


            employees.push({

                id:
                    employee.id,

                name:
                    employee.name

            });


            localStorage.setItem(
                "stalay_accounts",
                JSON.stringify(accounts)
            );


            saveData();

            renderEmployees();

            updateDashboard();


            alert(
                "Compte employé créé avec succès ✅\n\n" +
                "Identifiant : " +
                employee.username +
                "\nCode : " +
                employee.code
            );

        }
    );

}


// ==========================================
// AFFICHER LES EMPLOYÉS
// ==========================================

function renderEmployees() {

    const container =
        document.getElementById(
            "employees-list"
        );

    if (!container) {
        return;
    }


    if (
        employees.length === 0
    ) {

        container.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    👥
                </div>

                <h3>
                    Aucun employé
                </h3>

                <p>
                    Créez votre premier compte employé.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        employees.map(
            employee => `

                <div class="employee-item">

                    <div>

                        <strong>
                            ${escapeHTML(
                                employee.name
                            )}
                        </strong>

                        <small>
                            Employé
                        </small>

                    </div>

                    <span>
                        👤
                    </span>

                </div>

            `
        ).join("");

}


// ==========================================
// TABLEAU DE BORD
// ==========================================

function updateDashboard() {

    const total =
        sales.reduce(
            (sum, sale) =>
                sum +
                Number(
                    sale.amount
                ),
            0
        );


    const today =
        new Date().toDateString();


    const todayTotal =
        sales
            .filter(
                sale =>
                    new Date(
                        sale.date
                    ).toDateString() ===
                    today
            )
            .reduce(
                (sum, sale) =>
                    sum +
                    Number(
                        sale.amount
                    ),
                0
            );


    const todaySales =
        document.getElementById(
            "today-sales"
        );

    const monthlySales =
        document.getElementById(
            "monthly-sales"
        );

    const salesCount =
        document.getElementById(
            "sales-count"
        );

    const employeeCount =
        document.getElementById(
            "employee-count"
        );

    const reportTotal =
        document.getElementById(
            "report-total"
        );

    const reportCount =
        document.getElementById(
            "report-count"
        );


    if (todaySales) {

        todaySales.textContent =
            formatFCFA(
                todayTotal
            );

    }


    if (monthlySales) {

        monthlySales.textContent =
            formatFCFA(
                total
            );

    }


    if (salesCount) {

        salesCount.textContent =
            sales.length;

    }


    if (employeeCount) {

        employeeCount.textContent =
            employees.length;

    }


    if (reportTotal) {

        reportTotal.textContent =
            formatFCFA(
                total
            );

    }


    if (reportCount) {

        reportCount.textContent =
            sales.length;

    }

}


// ==========================================
// AFFICHER LES VENTES
// ==========================================

function renderSales(
    searchTerm = ""
) {

    const recentContainer =
        document.getElementById(
            "recent-sales"
        );

    const allContainer =
        document.getElementById(
            "all-sales"
        );


    if (
        !recentContainer ||
        !allContainer
    ) {

        return;

    }


    const filtered =
        sales.filter(
            sale =>
                sale.product
                    .toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    )
        );


    if (
        filtered.length === 0
    ) {

        const emptyHTML = `

            <div class="empty">

                <div class="empty-icon">
                    🧾
                </div>

                <h3>
                    Aucune vente
                </h3>

                <p>
                    Les ventes enregistrées
                    apparaîtront ici.
                </p>

            </div>

        `;


        recentContainer.innerHTML =
            emptyHTML;

        allContainer.innerHTML =
            emptyHTML;

        return;

    }


    const recent =
        filtered.slice(
            0,
            5
        );


    recentContainer.innerHTML =
        recent.map(
            createSaleHTML
        ).join("");


    allContainer.innerHTML =
        filtered.map(
            createSaleHTML
        ).join("");

}


function createSaleHTML(
    sale
) {

    const date =
        new Date(
            sale.date
        ).toLocaleString(
            "fr-FR",
            {
                dateStyle:
                    "short",

                timeStyle:
                    "short"
            }
        );


    return `

        <div class="sale-item">

            <div>

                <strong>
                    ${escapeHTML(
                        sale.product
                    )}
                </strong>

                <small>
                    ${date}
                    ${
                        sale.seller
                            ? " • " +
                              escapeHTML(
                                  sale.seller
                              )
                            : ""
                    }
                </small>

            </div>

            <div class="sale-amount">

                ${formatFCFA(
                    sale.amount
                )}

            </div>

        </div>

    `;

}


// ==========================================
// RECHERCHE VENTES
// ==========================================

const salesSearch =
    document.getElementById(
        "sales-search"
    );


if (salesSearch) {

    salesSearch.addEventListener(
        "input",
        () => {

            renderSales(
                salesSearch.value
            );

        }
    );

}


// ==========================================
// PRODUITS
// ==========================================

const addProductButton =
    document.getElementById(
        "add-product-button"
    );


if (addProductButton) {

    addProductButton.addEventListener(
        "click",
        () => {

            // Employé ne peut pas ajouter
            // de produits

            if (
                !currentUser ||
                currentUser.role !== "owner"
            ) {

                alert(
                    "Seul le patron peut ajouter des produits."
                );

                return;

            }


            const name =
                prompt(
                    "Nom du produit :"
                );

            if (!name) return;


            const price =
                Number(
                    prompt(
                        "Prix du produit en FCFA :"
                    )
                );


            if (
                !price ||
                price <= 0
            ) {

                alert(
                    "Prix invalide."
                );

                return;

            }


            products.push({

                id:
                    Date.now(),

                name:
                    name.trim(),

                price:
                    price

            });


            saveData();

            renderProducts();


            alert(
                "Produit ajouté ✅"
            );

        }
    );

}


function renderProducts() {

    const container =
        document.getElementById(
            "products-list"
        );


    if (!container) {
        return;
    }


    if (
        products.length === 0
    ) {

        container.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    📦
                </div>

                <h3>
                    Aucun produit
                </h3>

                <p>
                    Ajoutez vos produits pour
                    commencer à gérer votre activité.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        products.map(
            product => `

                <div class="product-item">

                    <div>

                        <strong>
                            ${escapeHTML(
                                product.name
                            )}
                        </strong>

                        <small>
                            Produit
                        </small>

                    </div>

                    <strong>
                        ${formatFCFA(
                            product.price
                        )}
                    </strong>

                </div>

            `
        ).join("");

}


// ==========================================
// PROTECTION HTML
// ==========================================

function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;

}


// ==========================================
// DÉCONNEXION
// ==========================================

const logoutButton =
    document.querySelector(
        ".logout-button"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            sessionStorage.removeItem(
                "stalay_current_user"
            );

            currentUser = null;

            location.reload();

        }
    );

}


// ==========================================
// INITIALISATION
// ==========================================

function init() {

    updateDashboard();

    renderSales();

    renderProducts();

    renderEmployees();


    if (currentUser) {

        showApp();

    }

}


init();
