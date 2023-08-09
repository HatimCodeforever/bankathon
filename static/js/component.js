class Navbar extends HTMLElement{
    connectedCallback(){
        const currentPage = window.location.pathname;
        this.innerHTML = `
        <nav class="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
            <a href="/home" class="navbar-brand d-flex align-items-center text-center py-0 px-4 px-lg-5">
                <h1 class="m-0 text-primary">SmartHire</h1>
            </a>
            <button type="button" class="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
                <div class="navbar-nav ms-auto p-4 p-lg-0">
                    <a href="/home" class="nav-item nav-link">Home</a>
                    <a href="/about" class="nav-item nav-link">About</a>
                    <a href="/job-list" class="nav-item nav-link">Jobs</a>
                    <a href="/contact" class="nav-item nav-link">Contact</a>
                    <a href="/notification" class="nav-item nav-link">Notification</a>
                    <a href="/logout" class="nav-item nav-link">Logout</a>
                </div>
            </div>
        </nav>
        `;
        const navLinks = this.querySelectorAll('.nav-item.nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }
    
}

customElements.define('app-navbar',Navbar)