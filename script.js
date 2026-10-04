// ==========================================
// STALAY CONTROL
// VERSION 1
// ==========================================


// ==========================================
// DONNÉES
// ==========================================

let sales = JSON.parse(
    localStorage.getItem("stalay_sales")
) || [];

let products = JSON.parse(
    localStorage.getItem("stalay_products")
) || [];

let employees = JSON.parse(
    localStorage.getItem("stalay_employees")
) || [];


// ==========================================
// ELEMENTS
// ==========================================

const navItems =
    document.querySelectorAll(".nav-item[data-section]");

const sections =
    document.querySelectorAll(".page-section");

const pageTitle =
    document.getElementById("page-title");


// ==========================================
// NAVIGATION
// ==========================================

navItems.forEach(item => {

    item.addEventListener("click", () => {

        const sectionName =
            item.dataset.section;

        showSection(sectionName);

    });

});


function showSection(sectionName) {

    sections.forEach(section => {

        section.classList.remove(
            "active-section"
        );

    });


    const selectedSection =
        document.getElementById(sectionName);

    if (selectedSection) {

        selectedSection.classList.add(
            "active-section"
        );

    }


    navItems.forEach(item => {

        item.classList.remove("active");

        if (
            item.dataset.section === sectionName
        ) {

            item.classList.add("active");

        }

    });


    const titles = {

        dashboard: "Tableau de bord",

        sales: "Ventes",

        products: "Produits",

        employees: "Employés",

        reports: "Rapports",

        settings: "Paramètres"

    };


    pageTitle.textContent =
        titles[sectionName] || "Stalay Control";

}


// ==========================================
// FORMATAGE FCFA
// ==========================================

function formatFCFA(amount) {

    return Number(amount).toLocaleString(
        "fr-FR"
    ) + " FCFA";

}


// ==========================================
// MODAL VENTE
// ==========================================

const saleModal =
    document.getElementById("sale-modal");

const saleForm =
    document.getElementById("sale-form");

const openSaleButton =
    document.getElementById("open-sale-button");

const openSaleButton2 =
    document.getElementById("open-sale-button-2");

const quickSale =
    document.getElementById("quick-sale");

const closeSaleModal =
    document.getElementById("close-sale-modal");


function openSaleModal() {

    saleModal.classList.add("show");

    document.getElementById(
        "sale-product"
    ).focus();

}


function closeModal() {

    saleModal.classList.remove("show");

    saleForm.reset();

}


openSaleButton.addEventListener(
    "click",
    openSaleModal
);

openSaleButton2.addEventListener(
    "click",
    openSaleModal
);

quickSale.addEventListener(
    "click",
    openSaleModal
);

closeSaleModal.addEventListener(
    "click",
    closeModal
);


saleModal.addEventListener(
    "click",
    event => {

        if (event.target === saleModal) {

            closeModal();

        }

    }
);


// ==========================================
// AJOUTER UNE VENTE
// ==========================================

saleForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


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


        if (!product || amount <= 0) {

            alert(
                "Veuillez remplir correctement les informations."
            );

            return;

        }


        const sale = {

            id: Date.now(),

            product: product,

            amount: amount,

            date: new Date().toISOString()

        };


        sales.unshift(sale);


        saveData();

        updateDashboard();

        renderSales();


        closeModal();


        alert(
            "Vente enregistrée avec succès ✅"
        );

    }
);


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
// TABLEAU DE BORD
// ==========================================

function updateDashboard() {

    const total =
        sales.reduce(
            (sum, sale) =>
                sum + Number(sale.amount),
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
                    ).toDateString() === today
            )
            .reduce(
                (sum, sale) =>
                    sum + Number(sale.amount),
                0
            );


    document.getElementById(
        "today-sales"
    ).textContent =
        formatFCFA(todayTotal);


    document.getElementById(
        "monthly-sales"
    ).textContent =
        formatFCFA(total);


    document.getElementById(
        "sales-count"
    ).textContent =
        sales.length;


    document.getElementById(
        "employee-count"
    ).textContent =
        employees.length;


    document.getElementById(
        "report-total"
    ).textContent =
        formatFCFA(total);


    document.getElementById(
        "report-count"
    ).textContent =
        sales.length;

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


    const filtered =
        sales.filter(sale =>
            sale.product
                .toLowerCase()
                .includes(
                    searchTerm.toLowerCase()
                )
        );


    if (filtered.length === 0) {

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
        filtered.slice(0, 5);


    recentContainer.innerHTML =
        recent.map(
            createSaleHTML
        ).join("");


    allContainer.innerHTML =
        filtered.map(
            createSaleHTML
        ).join("");

}


function createSaleHTML(sale) {

    const date =
        new Date(
            sale.date
        ).toLocaleString(
            "fr-FR",
            {
                dateStyle: "short",
                timeStyle: "short"
            }
        );


    return `

        <div class="sale-item">

            <div>

                <strong>
                    ${escapeHTML(sale.product)}
                </strong>

                <small>
                    ${date}
                </small>

            </div>

            <div class="sale-amount">

                ${formatFCFA(sale.amount)}

            </div>

        </div>

    `;

}


// ==========================================
// RECHERCHE DES VENTES
// ==========================================

const salesSearch =
    document.getElementById(
        "sales-search"
    );


salesSearch.addEventListener(
    "input",
    () => {

        renderSales(
            salesSearch.value
        );

    }
);


// ==========================================
// AJOUT PRODUIT
// ==========================================

const addProductButton =
    document.getElementById(
        "add-product-button"
    );


addProductButton.addEventListener(
    "click",
    () => {

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


        if (!price || price <= 0) {

            alert(
                "Prix invalide."
            );

            return;

        }


        products.push({

            id: Date.now(),

            name: name,

            price: price

        });


        saveData();

        renderProducts();

        alert(
            "Produit ajouté ✅"
        );

    }
);


// ==========================================
// AFFICHER PRODUITS
// ==========================================

function renderProducts() {

    const container =
        document.getElementById(
            "products-list"
        );


    if (products.length === 0) {

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
                            ${escapeHTML(product.name)}
                        </strong>

                        <small>
                            Produit
                        </small>

                    </div>

                    <strong>
                        ${formatFCFA(product.price)}
                    </strong>

                </div>

            `
        ).join("");

}


// ==========================================
// AJOUT EMPLOYÉ
// ==========================================

const addEmployeeButton =
    document.getElementById(
        "add-employee-button"
    );


addEmployeeButton.addEventListener(
    "click",
    () => {

        const name =
            prompt(
                "Nom de l'employé :"
            );


        if (!name) return;


        employees.push({

            id: Date.now(),

            name: name

        });


        saveData();

        renderEmployees();

        updateDashboard();


        alert(
            "Employé ajouté ✅"
        );

    }
);


// ==========================================
// AFFICHER EMPLOYÉS
// ==========================================

function renderEmployees() {

    const container =
        document.getElementById(
            "employees-list"
        );


    if (employees.length === 0) {

        container.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    👥
                </div>

                <h3>
                    Aucun employé
                </h3>

                <p>
                    Vous pourrez créer des comptes
                    pour vos employés ici.
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
                            ${escapeHTML(employee.name)}
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
// PROTECTION HTML
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent = text;

    return div.innerHTML;

}


// ==========================================
// DÉCONNEXION
// ==========================================

const logoutButton =
    document.querySelector(
        ".logout-button"
    );


logoutButton.addEventListener(
    "click",
    () => {

        alert(
            "La vraie connexion sera ajoutée avec Supabase."
        );

    }
);


// ==========================================
// INITIALISATION
// ==========================================

function init() {

    updateDashboard();

    renderSales();

    renderProducts();

    renderEmployees();

}


init();
