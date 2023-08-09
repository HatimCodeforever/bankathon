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

class Footer extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
        <div class="container-fluid bg-dark text-white-50 footer pt-5 mt-5 wow fadeIn" data-wow-delay="0.1s">
            <div class="container py-5">
                <div class="row g-5">
                    <div class="col-lg-3 col-md-6">
                        <h5 class="text-white mb-4">Company</h5>
                        <a class="btn btn-link text-white-50" href="bankathon\templates\about.html">About Us</a>
                        <a class="btn btn-link text-white-50" href="bankathon\templates\contact.html">Contact Us</a>
                        <a class="btn btn-link text-white-50" href="bankathon\templates\Login.html">Log Out</a>
                        <a class="btn btn-link text-white-50" href="bankathon\templates\testimonial.html">Testimonial</a>
                        <a class="btn btn-link text-white-50" href="bankathon\templates\job-list.html">Look at Oppurtunities</a>
                    </div>
                    <div class="col-lg-3 col-md-6">
                    </div>
    
                    <div class="col-lg-3 col-md-6">
                        <h5 class="text-white mb-4">Contact</h5>
                        <p class="mb-2"><i class="fa fa-map-marker-alt me-3"></i>No.U-15, J.V.P.D. Scheme, Bhaktivedanta Swami Marg, Opp.Cooper Hospital, Vile Parle (West), Mumbai-400 056. India</p>
                        <p class="mb-2"><i class="fa fa-phone-alt me-3"></i>+91 9372571301</p>
                        <p class="mb-2"><i class="fa fa-envelope me-3"></i>codeomega11@gmail.com</p>
                        <div class="d-flex pt-2">
                            <a class="btn btn-outline-light btn-social" href=""><i class="fab fa-twitter"></i></a>
                            <a class="btn btn-outline-light btn-social" href=""><i class="fab fa-facebook-f"></i></a>
                            <a class="btn btn-outline-light btn-social" href=""><i class="fab fa-youtube"></i></a>
                            <a class="btn btn-outline-light btn-social" href=""><i class="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <h5 class="text-white mb-4">Future Oppurtunities</h5>
                        <p>We can notify you once there are new job openings. Sign up for our Job Postings</p>
                        <div class="position-relative mx-auto" style="max-width: 400px;">
                            <input class="form-control bg-transparent w-100 py-3 ps-4 pe-5" type="text" placeholder="Your email">
                            <button type="button" class="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2">SignUp</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="copyright">
                    <div class="row">
                        <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
                            &copy; <a class="border-bottom" href="#">SmartHire</a>, All Right Reserved. 
							
							<!--/*** This template is free as long as you keep the footer author’s credit link/attribution link/backlink. If you'd like to use the template without the footer author’s credit link/attribution link/backlink, you can purchase the Credit Removal License from "https://htmlcodex.com/credit-removal". Thank you for your support. ***/-->
							Designed and Coded By <a class="border-bottom" href="">Code Omega</a>
                        </div>
                        <div class="col-md-6 text-center text-md-end">
                            <div class="footer-menu">
                                <a href="">Home</a>
                                <a href="">Cookies</a>
                                <a href="">Help</a>
                                <a href="">FAQs</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
    }
}

customElements.define('app-navbar',Navbar)
customElements.define('app-footer',Footer)
