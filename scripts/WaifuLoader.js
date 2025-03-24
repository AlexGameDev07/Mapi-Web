document.addEventListener('DOMContentLoaded', () => {
    const loadButton = document.getElementById('loadImages');
    const categorySelect = document.getElementById('category');
    const swiperWrapper = document.querySelector('.swiper-wrapper');

    loadButton.addEventListener('click', loadWaifuImages);

    async function loadWaifuImages() {
        const category = categorySelect.value;
        const images = await fetchWaifuImages(category, 6);
        updateSlider(images);
    }

    async function fetchWaifuImages(category, count) {
        const images = [];
        for (let i = 0; i < count; i++) {
            const response = await fetch(`https://api.waifu.pics/sfw/${category}`);
            const data = await response.json();
            images.push(data.url);
        }
        return images;
    }

    function updateSlider(images) {
        swiperWrapper.innerHTML = '';
        images.forEach((imageUrl, index) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <div class="photography-slider--item">
                    <div class="photography-slider--layer">
                        <img src="https://imgpanda.com/upload/ib/QTBKjzDqxD.png" alt="img" loading="lazy">
                    </div>
                    <div class="photography-slider--content">
                        <div class="photography-slider--image">
                            <img src="${imageUrl}" alt="Waifu image" loading="lazy">                               
                            <div class="photography-slider--inner">
                                <div class="photography-heading">
                                    <div class="photography-item--inner">
                                        <h1 class="photography-item--title">Waifu <br> <span>${categorySelect.value}</span></h1>
                                        <h1 class="photography-item--title-outline">Pic ${index + 1}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>  
                    </div>
                </div>
            `;
            swiperWrapper.appendChild(slide);
        });

        // Reinicializar Swiper después de actualizar las diapositivas
        if (window.swiper) {
            window.swiper.destroy();
        }
        window.swiper = new Swiper('.photography-swiper--slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }
});