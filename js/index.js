const userName = document.getElementById('userName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const age = document.getElementById('age');
const password = document.getElementById('password');
const repassword = document.getElementById('repassword');


//-----------------------loading screen-----------------------

$(function(){
    $('.loader').fadeOut(500,function(){
        $('.loading').fadeOut(500,function(){
            $('body').css('overflow','auto');
            $('.loading').remove();
        })
    })
})


//-----------------------side-bar-----------------------

$('.open').on('click',function(){
    $('aside').css('left','0px');
    $('.open').addClass('d-none'); 
    $('.close').removeClass('d-none');
    for(let i=0;i<5;i++){
        $('.links ul li').eq(i).animate({top:'0px'},(i+3)*100);

    }  
})

$('.close').on('click',function(){
    $('aside').css('left','-255px');
    $('.close').addClass('d-none'); 
    $('.open').removeClass('d-none');
    for(let i=0;i<5;i++){
        $('.links ul li').eq(i).animate({top:'200px'},(i+3)*100);

    }
   
})

//-----------------------search-----------------------

async function getByNameSearch(name) {
    try {
     let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
     let data = await res.json();
     if (data.meals && data.meals.length > 0) {
        // console.log(data.meals);
        displayMealByNameOrLetter(data.meals);
 }
    else {
        displayNoResults(); 
 }   
    } catch (error) {
        console.log(error);
    }
 }

 function displayMealByNameOrLetter(arr){
    let cartona = ``;
    for(let i=0;i<arr.length;i++){
        cartona+=`<div class="col-md-3 rounded-3 meal" id="${arr[i].idMeal}">
                <div class="card position-relative overflow-hidden bg-transparent">
                    <img src="${arr[i].strMealThumb}" alt="food" class="rounded-3">
                    <div class="layer w-100  h-100 rounded-3 position-absolute top-100 d-flex align-items-center" >
                        <h3 class="text-capitalize">${arr[i].strMeal}</h3>
                    </div>
                  </div>
            </div>`;
    }
    if(document.getElementById('rowSearch')) document.getElementById('rowSearch').innerHTML=cartona;

    let meal = document.querySelectorAll(".meal");
    for(let i=0;i<meal.length;i++){
       meal[i].addEventListener('click',() => {
        localStorage.setItem('mealId',meal[i].getAttribute('id'));
        location.href = "../mealDetails.html";
       })
    }
}

function displayNoResults() {;
    document.getElementById('rowSearch').innerHTML = " ";
  }

if(location.pathname == "/mealDetails.html"){
    getMealDetails(localStorage.getItem('mealId'));  
}

async function getByLetterSearch(letter) {
   try {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    let data = await res.json();
    if(data.meals && data.meals.length >0){
        console.log(data.meals) ; 
        displayMealByNameOrLetter(data.meals);
    }
    else{
        displayNoResults();
    }
   } catch (error) {
    console.log(error);
   }
}

//-------------------index.html---------------------

async function getMeals(){
   try {
    let res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    let data = await res.json()
    // console.log(data.meals);
    displayMeals(data.meals);
   } catch (error) {
    console.log(error);
    
   }
    
}

getMeals();

function displayMeals(list){
    let cartona = ``;
    for(let i=0;i<list.length;i++){
        cartona+= `
        <div class="col-md-3 rounded-3 meal" id="${list[i].idMeal}">
                <div class="card position-relative overflow-hidden bg-transparent">
                    <img src="${list[i].strMealThumb}" alt="food" class="rounded-3">
                    <div class="layer w-100  h-100 rounded-3 position-absolute top-100 d-flex align-items-center" >
                        <h3 class="text-capitalize">${list[i].strMeal}</h3>
                    </div>
                  </div>
                  
            </div>
            `
    }
    if(document.getElementById('rowData')) document.getElementById('rowData').innerHTML = cartona;
    
    let meals = document.querySelectorAll('.meal');
    for(let i=0;i<meals.length;i++){
        meals[i].addEventListener('click',() => {
            localStorage.setItem('mealId',meals[i].getAttribute("id"));
            location.href = "../mealDetails.html";

        })
        
    }
}

async function getMealDetails(id) {
   try {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`); 
    let data = await res.json();
    // console.log(data.meals[0]); 
    displayMealDetails(data.meals[0],"rowDetails");
   } catch (error) {
    console.log(error);
    
   } 
}

if(location.pathname == "/mealDetails.html"){
    getMealDetails(localStorage.getItem('mealId'));  
}

 function displayMealDetails(meal,rowId){
    let ingredients = [];
    for(let i=1;i<=20;i++){
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if(ingredient != "" ){
            ingredients+=`<li class="rounded-3 p-1 me-3 mb-3 ms-2 alert alert-info">${measure} ${ingredient}</li>`;  
        } 
    }
    let tags = (meal.strTags)?meal.strTags.split(","): [];
    let tag = '';
    for(let i=0;i<tags.length;i++){
        tag+=`<li class="rounded-3 p-1 me-3 mb-3 ms-2 alert alert-danger">${tags[i]}</li>`; 
    }
    // console.log(ingredients);
    let cartona =`
      <div class="col-md-4">
                <img src="${meal.strMealThumb}" alt="" class="w-100 rounded-3">
                <h3 class="fs-2">${meal.strMeal}</h3>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                 <h3>Area <span>:  ${meal.strArea}</span></h3>
                 <h3>Category <span>: ${meal.strCategory}</span></h3>
                 <h3>Recipes :</h3>
                 <ul class="list-unstyled d-flex flex-wrap" id="recipes">
                  ${ingredients}
                 </ul>
                 <h3>Tags :</h3>
                 <ul class="list-unstyled d-flex" id="mealTags">
                 ${tag}
                 </ul>
                 <button class="btn btn-success mb-5"><a href="${meal.strSource}" target="_blank" class="text-decoration-none text-white">Source</a></button>
                 <button class="btn btn-danger mb-5"><a href="${meal.strYoutube}" target="_blank"  class="text-decoration-none text-white">Youtube</a></button>

            </div>`
            
            if(document.getElementById(rowId)) document.getElementById('rowDetails').innerHTML = cartona;
            
 }


 //-----------------------Categories-----------------------

 async function getMealCateg() {
   try {
    let res = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    let data = await res.json();
    // console.log(data.categories);  
    displayCateg(data.categories);
   } catch (error) {
    console.log(error);
    
   }
 }
 
if(location.pathname == "/categories.html"){
    getMealCateg();
}

function displayCateg(categArr){
    let cartona = ``;
    for(let i=0;i<categArr.length;i++){
        cartona+=` <div class="col-md-3 rounded-3 overflow-hidden mealCateg">
                    <div class="item position-relative">
                        <img src="${categArr[i].strCategoryThumb}" alt="" class="w-100 rounded-3">
                        <div class="layer position-absolute top-100 start-0 w-100 h-100 text-center rounded-2 p-1">
                        <h3 class="text-capitalize pt-1">${categArr[i].strCategory}</h3>
                        <p class="px-1">${categArr[i].strCategoryDescription}</p>
                    </div>
                    </div>
                </div>`
    }
    document.getElementById('rowCateg').innerHTML=cartona;

    let mealCateg = document.querySelectorAll('.mealCateg');
    for(let i=0;i<mealCateg.length;i++){
        mealCateg[i].addEventListener('click',function(){
            localStorage.setItem('mealCategName',mealCateg[i].querySelector('h3').innerText);
            location.href = "../mealCategory.html"; 
            // console.log(mealCateg[i].querySelector('h3').innerText);      
        }) 
    }
}

async function getCategMeals(category) {
    try {
        let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        let data = await res.json();
        // console.log(data.meals);  
        displaycategMeals(data.meals);
    } catch (error) {
       console.log(error);
        
    }
}

if(location.pathname == "/mealCategory.html"){
    getCategMeals(localStorage.getItem('mealCategName'));
}
function displaycategMeals(list){
    let cartona= ``;
    let lnumOfMeals = Math.min(list.length,20);
    for(let i=0;i<lnumOfMeals;i++){
    cartona+= `
        <div class="col-md-3 rounded-3 mealCateg" id="${list[i].idMeal}">
                <div class="card position-relative overflow-hidden bg-transparent">
                    <img src="${list[i].strMealThumb}" alt="food" class="rounded-3">
                    <div class="layer w-100  h-100 rounded-3 position-absolute top-100 d-flex align-items-center" >
                        <h3 class="text-capitalize">${list[i].strMeal}</h3>
                    </div>
                  </div>
                   
            </div>
            `
    }
    if(document.getElementById('rowMealCateg')) document.getElementById('rowMealCateg').innerHTML = cartona;

    let mealCateg = document.querySelectorAll('.mealCateg');
    for(let i=0;i<mealCateg.length;i++){
        mealCateg[i].addEventListener('click',() => {
            console.log(mealCateg[i].getAttribute('id'));
            localStorage.setItem('mealId',mealCateg[i].getAttribute('id'));
            location.href = "../mealDetails.html"
            
        })
    }

    }

if(location.pathname == "/mealDetails.html"){
    getMealDetails(localStorage.getItem('mealId'));  
}


//-----------------------Area-----------------------

async function getArea() {
    try {
        let res = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
        let data = await res.json();
        // console.log(data.meals);  
        displayAreas(data.meals); 
    } catch (error) {
        console.log(error);
        
    }
}
if(location.pathname == "/area.html"){
    getArea();
}
function displayAreas(arr){
    let cartona=``;
    for(let i=0;i<arr.length;i++){
        cartona+=`<div class="col-md-3 areaMeals">
                <div class="text-white">
                    <i class="fa-solid fa-house-laptop"></i>
                    <h3>${arr[i].strArea}</h3>
                </div>
             </div>`

    }
    if(document.getElementById('rowArea')) document.getElementById('rowArea').innerHTML=cartona;

    let areaMeals = document.querySelectorAll('.areaMeals');
    for(let i=0;i<areaMeals.length;i++){
        areaMeals[i].addEventListener('click',() => {
            // console.log(areaMeals[i].querySelector('h3').innerText);
            localStorage.setItem('areaMeals',areaMeals[i].querySelector('h3').innerText);
            location.href = "../mealsOfArea.html";
            
        })
    }
}
async function getAreaMeals(area) {
    try {
        let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        let data = await res.json();
        displayAreaMeals(data.meals) ;
        // console.log(data.meals);
    } catch (error) {
        console.log(error);
        
    }
      
}
if(location.pathname == "/mealsOfArea.html"){
  getAreaMeals(localStorage.getItem('areaMeals'))
}
function displayAreaMeals(arr){
    let cartona=``;
    let minNum = Math.min(arr.length,20);
    for(let i=0;i<minNum;i++){
        cartona+=`<div class="col-md-3 rounded-3 areaMealDetails" id="${arr[i].idMeal}">
                <div class="card position-relative overflow-hidden bg-transparent">
                    <img src="${arr[i].strMealThumb}" alt="food" class="rounded-3">
                    <div class="layer w-100  h-100 rounded-3 position-absolute top-100 d-flex align-items-center" >
                        <h3 class="text-capitalize">${arr[i].strMeal}</h3>
                    </div>
                  </div> 
            </div>`
    }
   if(document.getElementById('everyAreaMeals')) document.getElementById('everyAreaMeals').innerHTML = cartona;
   let areaMealDetails = document.querySelectorAll('.areaMealDetails');
   for (let i = 0; i < areaMealDetails.length; i++) {
       areaMealDetails[i].addEventListener('click',() => {
        localStorage.setItem('mealId',areaMealDetails[i].getAttribute('id'));
        location.href = "../mealDetails.html"
       })
    
   }
}
if(location.pathname == "/mealDetails.html"){
    getMealDetails(localStorage.getItem('mealId'));
}


//-----------------------Ingredients-----------------------

async function getIngredients() {
   try {
    let res = await fetch('https:/www.themealdb.com/api/json/v1/1/list.php?i=list');
    let data = await res.json();
    // console.log(data.meals);
    displayIngredients(data.meals) ; 
   } catch (error) {
    console.log(error);
    
   } 
}
if(location.pathname == '/ingredients.html'){
    getIngredients();
}
function displayIngredients(arr) {
    let cartona = ``;
    let minNum = Math.min(arr.length,20)
    for(let i=0;i<minNum;i++){
        cartona+=`<div class="col-md-3 ingredientsMeals">
                <div class="text-white overflow-hidden">
                    <i class="fa-solid fa-drumstick-bite"></i>
                    <h3>${arr[i].strIngredient}</h3>
                    <p>${arr[i].strDescription}</p>
                </div>
             </div>`;
    }
    if(document.getElementById('ingredients')) document.getElementById('ingredients').innerHTML=cartona;

    let ingredientsMeals = document.querySelectorAll(".ingredientsMeals");
    for(let i=0;i<ingredientsMeals.length;i++){
        ingredientsMeals[i].addEventListener('click',() => {
            localStorage.setItem('ingredientName',ingredientsMeals[i].querySelector('h3').innerText);
            location.href = "../ingredientMeals.html";   
        })
    }
}
async function getIngredientMeals(mainIngredient) {
    try {
        let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${mainIngredient}`);
        let data = await res.json();
        // console.log(data.meals) ;
       if(data && data.meals){
        displayIngredientMeals(data.meals); 
       }
    } catch (error) {
        console.log(error);
        
    }
}
if(location.pathname == "/ingredientMeals.html"){
    getIngredientMeals(localStorage.getItem('ingredientName'));
}

function displayIngredientMeals(arr) {
    let cartona = ``;
    let minNum = Math.min(arr.length,20);
    for(let i=0;i<minNum;i++){
        cartona+=`<div class="col-md-3 rounded-3 ingredientMealDetails" id="${arr[i].idMeal}">
                <div class="card position-relative overflow-hidden bg-transparent">
                    <img src="${arr[i].strMealThumb}" alt="food" class="rounded-3">
                    <div class="layer w-100  h-100 rounded-3 position-absolute top-100 d-flex align-items-center" >
                        <h3 class="text-capitalize">${arr[i].strMeal}</h3>
                    </div>
                  </div> 
            </div>`;
    }
    document.getElementById('ingredientMeals').innerHTML=cartona;

    let ingredientMealDetails = document.querySelectorAll('.ingredientMealDetails');
    for (let i = 0; i < ingredientMealDetails.length; i++) {
        ingredientMealDetails[i].addEventListener('click',() => {
            localStorage.setItem('mealId',ingredientMealDetails[i].getAttribute('id'));
            location.href = "../mealDetails.html";
        });
        
    }
    
}
if(location.pathname == "/mealDetails.html"){
    getIngredientMeals(localStorage.getItem('mealId'));
}


// -------------------validation--------------------
    
function validateInputs(element){
    let NameFlag = false;
    let emailFlag = false;
    let phoneFlag = false;
    let ageFlag = false;
    let passwordFlag = false;
    let repasswordFlag = false;

    const regex = {
        userName: /^[a-zA-Z ]+$/,
        email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        phone: /^[0-9]{11}$/,
        age: /^\d{1,2}$/,
        password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 
        repassword: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    };

    if (regex[element.id].test(element.value)) {
        element.nextElementSibling.classList.replace('d-block', 'd-none');
    } else {
        element.nextElementSibling.classList.replace('d-none', 'd-block');
    }


    if (regex.userName.test(userName.value)) {
        NameFlag = true;
    }
    if (regex.email.test(email.value)) {
        emailFlag = true;
    }
    if (regex.phone.test(phone.value)) {
        phoneFlag = true;
    }
    if (regex.age.test(age.value)) {
        ageFlag = true;
    }
    if (regex.password.test(password.value)) {
        passwordFlag = true;
    }
    if (regex.repassword.test(repassword.value) && repassword.value === password.value) {
        repasswordFlag = true;
    }

    if (NameFlag && emailFlag && phoneFlag && ageFlag && passwordFlag && repasswordFlag) {
        document.querySelector(".submitBtn").removeAttribute('disabled');
    } else {
        document.querySelector(".submitBtn").setAttribute('disabled', true);
    }
}

if(location.pathname == "/contact.html"){
    userName.addEventListener('input', function() {
        validateInputs(this);
    });
    email.addEventListener('input', function() {
        validateInputs(this);
    });
    phone.addEventListener('input', function() {
        validateInputs(this);
    });
    age.addEventListener('input', function() {
        validateInputs(this);
    });
    password.addEventListener('input', function() {
        validateInputs(this);
    });
    repassword.addEventListener('input', function() {
        validateInputs(this);
    });
}

