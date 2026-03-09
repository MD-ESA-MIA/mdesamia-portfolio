// Web3Forms Setup
const contactForm = document.getElementById('contact-form');
const formResult = document.getElementById('form-result');

if(contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Disable button & show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;
        
        const object = {};
        formData.forEach((value, key) => {
            object[key] = value;
        });
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                formResult.classList.remove('hidden', 'text-red-400');
                formResult.classList.add('text-green-400');
                formResult.innerHTML = "Message sent successfully!";
            } else {
                console.log(response);
                formResult.classList.remove('hidden', 'text-green-400');
                formResult.classList.add('text-red-400');
                formResult.innerHTML = json.message || "Oops! Something went wrong.";
            }
        })
        .catch((error) => {
            console.log(error);
            formResult.classList.remove('hidden', 'text-green-400');
            formResult.classList.add('text-red-400');
            formResult.innerHTML = "Oops! Something went wrong while submitting.";
        })
        .finally(() => {
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            
            setTimeout(() => {
                formResult.classList.add('hidden');
            }, 5000);
        });
    });
}
