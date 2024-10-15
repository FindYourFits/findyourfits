console.clear();

// Get the product ID from the URL using URLSearchParams
const params = new URLSearchParams(window.location.search);
const id = params.get('id');  // Retrieves the 'id' parameter from the URL
console.log(id);  // Check if the correct ID is being captured

// Check if there's a 'counter' in the cookies for displaying a cart badge
if (document.cookie.indexOf(',counter=') >= 0) {
    let counter = document.cookie.split(',')[1].split('=')[1];
    document.getElementById("badge").innerHTML = counter;  // Update cart badge with the counter value
}

// Function to dynamically create the product details section
function dynamicContentDetails(product) {
    let mainContainer = document.createElement('div');
    mainContainer.id = 'containerD';
    document.getElementById('containerProduct').appendChild(mainContainer);

    // Create image section
    let imageSectionDiv = document.createElement('div');
    imageSectionDiv.id = 'imageSection';

    let imgTag = document.createElement('img');
    imgTag.id = 'imgDetails';
    // imgTag.src = product.preview;  // Assuming 'preview' is the image URL for the product
    imageSectionDiv.appendChild(imgTag);

    // Create product details section
    let productDetailsDiv = document.createElement('div');
    productDetailsDiv.id = 'productDetails';

    let h1 = document.createElement('h1');
    h1.appendChild(document.createTextNode(product.name));

    let h4 = document.createElement('h4');
    h4.appendChild(document.createTextNode(product.description));

    let detailsDiv = document.createElement('div');
    detailsDiv.id = 'details';

    let h3DetailsDiv = document.createElement('h3');
    h3DetailsDiv.appendChild(document.createTextNode('Rs ' + product.price));

    let h3 = document.createElement('h3');
    h3.appendChild(document.createTextNode('Description'));

    let para = document.createElement('p');
    para.appendChild(document.createTextNode(product.description));

    let productPreviewDiv = document.createElement('div');
    productPreviewDiv.id = 'productPreview';

    let h3ProductPreviewDiv = document.createElement('h3');
    h3ProductPreviewDiv.appendChild(document.createTextNode('Product Preview'));
    productPreviewDiv.appendChild(h3ProductPreviewDiv);

    // Dynamically create image previews for the product
    // for (let i = 0; i < product.photos.length; i++) {
    //     let imgTagProductPreviewDiv = document.createElement('img');
    //     imgTagProductPreviewDiv.id = 'previewImg';
    //     imgTagProductPreviewDiv.src = product.photos[i];
    //     imgTagProductPreviewDiv.onclick = function() {
    //         imgTag.src = product.photos[i];  // Update main image on click
    //     };
    //     productPreviewDiv.appendChild(imgTagProductPreviewDiv);
    // }

    // Add to cart button
    let buttonDiv = document.createElement('div');
    buttonDiv.id = 'button';

    let buttonTag = document.createElement('button');
    buttonTag.appendChild(document.createTextNode('Add to Cart'));
    buttonTag.onclick = function() {
        let order = id + " ";
        let counter = 1;
        if (document.cookie.indexOf(',counter=') >= 0) {
            order = id + " " + document.cookie.split(',')[0].split('=')[1];
            counter = Number(document.cookie.split(',')[1].split('=')[1]) + 1;
        }
        document.cookie = "orderId=" + order + ",counter=" + counter;
        document.getElementById("badge").innerHTML = counter;
        console.log(document.cookie);
    };
    buttonDiv.appendChild(buttonTag);

    // Append all elements to the main container
    mainContainer.appendChild(imageSectionDiv);
    mainContainer.appendChild(productDetailsDiv);
    productDetailsDiv.appendChild(h1);
    productDetailsDiv.appendChild(h4);
    productDetailsDiv.appendChild(detailsDiv);
    detailsDiv.appendChild(h3DetailsDiv);
    detailsDiv.appendChild(h3);
    detailsDiv.appendChild(para);
    productDetailsDiv.appendChild(productPreviewDiv);
    productDetailsDiv.appendChild(buttonDiv);

    return mainContainer;
}

// Backend API call to get the product details by its ID
let httpRequest = new XMLHttpRequest();
httpRequest.withCredentials = true;  // Allow credentials (cookies or tokens) to be sent

httpRequest.onreadystatechange = function() {
    if (this.readyState === 4 && this.status == 200) {
        let product = JSON.parse(this.responseText);
        console.log(product);  // Log product details to verify the correct data is fetched
        document.getElementById('containerProduct').appendChild(dynamicContentDetails(product));
    } else if (this.readyState === 4 && this.status == 404) {
        console.error('Product not found');
    } else if (this.readyState === 4) {
        console.error('Failed to fetch product data');
    }
};

// Send the GET request to the backend with the product ID
httpRequest.open("GET", "http://localhost:8000/products/" + id, true);
httpRequest.send();
