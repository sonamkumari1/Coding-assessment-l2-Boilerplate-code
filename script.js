const productAPI = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json';

async function fetchProducts(category) {
    try {
        const response = await fetch(productAPI);
        const data = await response.json();
        const productsContainer = document.getElementById(category);
        productsContainer.innerHTML = ''; // Clear existing content

        const categoryData = data.categories.find(cat => cat.category_name.toLowerCase() === category);
        const products = categoryData ? categoryData.category_products : [];

        if (products.length === 0) {
            console.error('No products found in the response');
            return;
        }

        products.forEach(product => {
           const discount = calculateDiscount(product.price, product.compare_at_price);
            const shortTitle = shortenTitle(product.title, 12); 
            const cardHtml = `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.title}" class="product-image">
                    ${product.badge_text ? `<span class="badge">${product.badge_text}</span>` : ''}
                    
                    <div class="product-info">
                        <h3 class="product-title">${shortTitle}</h3>
                        <li class="vendor">${product.vendor}</li>
                    </div>
                  
                    <div class="product-info">
                        <p class="price">Rs ${product.price}.00</p>
                        <p class="compare-price">Rs ${product.compare_at_price}.00</p>
                        <p class="discount">${discount}% Off</p>
                    </div>
                    <button class="add-to-cart-btn">Add to Cart</button>
                </div>
            `;
            productsContainer.innerHTML += cardHtml;
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function shortenTitle(title, maxLength) {
    if (title.length > maxLength) {
        return title.substring(0, maxLength) + '..';
    }
    return title;
}

function calculateDiscount(price, compareAtPrice) {
    if (!price || !compareAtPrice) return 0;
    const discount = ((compareAtPrice - price) / compareAtPrice) * 100;
    return Math.round(discount);
}

function openTab(category, element) {
    const tabs = document.getElementsByClassName('tabcontent');
    for (let tab of tabs) {
        if (tab.id === category) {
            tab.style.display = 'flex'; // Show selected tab
        } else {
            tab.style.display = 'none'; // Hide other tabs
        }
    }

    const tablinks = document.getElementsByClassName('tablink');
    for (let link of tablinks) {
        link.classList.remove('active'); // Deactivate other tab links
        if (link.querySelector('i')) {
            link.querySelector('i').remove(); // Remove existing icon
        }
    }

    element.classList.add('active'); // Activate selected tab link

    // Add the icon to the active tab
    let icon;
    if (category === 'men') {
        icon = '<i class="fas fa-male"></i> ';
    } else if (category === 'women') {
        icon = '<i class="fas fa-female"></i> ';
    } else if (category === 'kids') {
        icon = '<i class="fas fa-child"></i> ';
    }
    element.innerHTML = icon + category.charAt(0).toUpperCase() + category.slice(1);

    fetchProducts(category); 
}

openTab('men', document.querySelector('.tablink'));
