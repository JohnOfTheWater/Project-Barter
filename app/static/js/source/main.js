(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    $('#loginPanel').hide();
    $('#myItemsPanel').hide();
    $('.sdescription').hide();
    $('#searchPanel').hide();
    $('#searchResult').hide();
    $('#searchButton').click(search);
    $('#loginButton').click(showLogin);
    $('#userButton').click(showUserPanel);
    $('#myItems').click(showMyItems);
    $('#cerca').click(showSearchPanel);
    $('#login').click(loginUser);
    $('#close').click(closeUserPanel);
    $('#closeS').click(closeSearchPanel);
    $('#closeMI').click(closeMyItemsPanel);
    $('#closeSR').click(closeSearch);
    $('#myBids').click(goToMyBids);
    $('#sn').click(searchByName);
    $('#sc').click(searchByCat);
    $('#feelLucky').click(searchByLuck);
    $('#searchResult').on('click', '.fotoS', showItemPage);
    $('.spicture').mouseenter(showDescription);
    $('.spicture').mouseleave(hideDescription);
    hideWelcome();
  }

  //---------GlobalVariables-------------------------//
/*
  var counter = 0;

*/
  //---------Animation-------------------------//

  function showDescription(){
    $('.sdescription').fadeIn();
  }

  function hideDescription(){
    $('.sdescription').fadeOut();
  }

  function hideWelcome(){
    $('.welcome').fadeOut(4000);
    $('.welcome2').fadeOut(4000);
  }

  function showMyItems(){
    $('#searchPanel').hide();
    $('#myItemsPanel').fadeIn('slow');
    $('#search').focus();
    getMyItems();
  }

  function showSearchPanel(){
    $('#myItemsPanel').hide();
    $('#searchPanel').fadeIn('slow');
    $('#byName').focus();
  }

  function showUserPanel(){
    //var text = $('#userButton').text();
    //if(text === 'Giovanni'){
    //$('#userButton').text('close');
    //}else{
    //$('#userButton').text('Giovanni');
    //}
    //$('#userPanel').fadeToggle('slow');
    $('#userPanel').animate({margin:'+0 +0 +0 +620'},1000);
    $('#search').focus();
    var user = $(this).text();
    getUser(user);
  }

  function closeMyItemsPanel(){
    $('#myItemsPanel').fadeOut('slow');
    $('#search').focus();
  }

  function closeSearchPanel(){
    $('#searchPanel').fadeOut('slow');
    $('#search').focus();
  }

  function closeSearch(){
    $('#searchResult').fadeOut('slow');
    $('#search').focus();
  }


  function closeUserPanel(){
    //$('#userPanel').fadeToggle('slow');
    $('#userPanel').animate({margin:'+0 +0 +0 +0'},1000);
    $('#search').focus();
  }


  function showLogin(){
    var text = $('#loginButton').text();
    if(text === 'Login'){
      $('#loginButton').text('close');
    }else{
      $('#loginButton').text('Login');
    }
    $('#loginPanel').fadeToggle('slow');
    $('#userName').focus();
  }
  //---------SearchFunctions---------------------//

  function searchByName(){
    $('#searchResult').fadeIn('slow');
    var name = $('#byName').val();
    //$.replace(/\s/g, '-');
    var url = window.location.origin.replace(/[0-9]{4}/, '4000') + '/searchByName/' + name;
    $.getJSON(url, displaySearch);
  }

  function searchByCat(){
    $('#searchResult').fadeIn('slow');
    var cat = $('#byCategory').val();
    //$.replace(/\s/g, '-');
    var url = window.location.origin.replace(/[0-9]{4}/, '4000') + '/searchByCat/' +cat;
    $.getJSON(url, displaySearch);
  }

  function searchByLuck(){
    $('#searchResult').fadeIn('slow');
    var url = window.location.origin.replace(/[0-9]{4}/, '4000') + '/searchByLuck';
    $.getJSON(url, displaySearch);
  }

  function search(){
    debugger;
    var name = $('#search').val();
    var url = window.location.origin.replace(/[0-9]{4}/, '4000') + '/searchByName/' + name;
    $.getJSON(url, goToSearch);
  }

  function goToSearch(data){
    debugger;
    console.log(data.items._id);
    var id = data.items[0]._id;
    var userName = $('#userButton').text();
    window.location.replace('/item/'+id+userName);
  }

  function displaySearch(data){
    $('.fotoS').remove();
    for(var i = 0; i < data.items.length; i++){
      appendMySearch(data.items[i]);
    }
  }

  function appendMySearch(item){
    $('.photoS').remove();

    var $photo = $('<div>');
    var $name = $('<div>');
    var $cost = $('<div>');
    var $owner = $('<div>');


    $photo.css('background-image', 'url("'+item.photo+'")').attr('data-id', item._id).addClass('fotoS');
    $name.text(item.name).addClass('nomeS').attr('data-id', item._id);
    $cost.text('Cost: $'+item.cost).addClass('costoS').attr('data-id', item._id);
    $owner.text('Owner: '+item.owner).addClass('ownerS').attr('data-id', item._id);

    $('#searchResult').append($photo);
    $photo.append($name);
    $name.append($owner);
    $owner.append($cost);
  }

  function showItemPage(){
    debugger;
    var id = $(this).attr('data-id');
    var userName = $('#userButton').text();
    window.location.replace('/item/'+id+userName);
  }


  //---------goToMyBids-------------------------//

  function goToMyBids(){
    var user = $('#userButton').text();
    window.location.replace('/myBids/'+user);
  }

  //---------getMyItems-------------------------//

  function getMyItems(){
    //$.hide();
    //$.remove();
    //var item = actualItem;
    var user = $('#userButton').text();
    //$.replace(/\s/g, '-');
    var url = window.location.origin.replace(/[0-9]{4}/, '4000') + '/myItems/' + user;
    $.getJSON(url, displayMyItems);
  }

  function displayMyItems(data){
    $('.fotoMI').remove();
    $('.nomeMI').remove();
    $('.costoMI').remove();
    for(var i = 0; i < data.items.length; i++){
      appendMyItems(data.items[i]);
    }
  }

  function appendMyItems(item){

    var $photo = $('<div>');
    var $name = $('<div>');
    var $cost = $('<div>');

    $photo.css('background-image', 'url("'+item.photo+'")').attr('data-id', item._id).addClass('fotoMI');
    $name.text(item.name).addClass('nomeMI').attr('data-id', item._id);
    $cost.text('$'+item.cost).addClass('costoMI').attr('data-id', item._id);

    $('#nomeI').append($name);
    $('#fotoI').append($photo);
    $('#costoI').append($cost);
  }
  //---------getUser-------------------------//

  function getUser(user){
    console.log(user);
    var url = window.location.origin.replace(/[0-9]{4}/, '4000') + '/showUser/' + user;
    $.getJSON(url, displayUser);
  }

  function displayUser(data){
    console.log(data.user.name);
    console.log(data.user.email);
    console.log(data.user.photo);

    $('.photo').remove();
    $('.name').remove();
    $('.email').remove();

    var $photo = $('<div>');
    var $name = $('<div>');
    var $email = $('<div>');

    $photo.css('background-image', 'url("'+data.user.photo+'")').attr('data-id', data.user._id).addClass('photo');
    $name.text('User: '+data.user.name).addClass('name').attr('data-id', data.user._id);
    $email.text('Email: '+data.user.email).addClass('email').attr('data-id', data.user._id);

    $('#userP').append($photo);
    $('#userN').append($name);
    $('#userE').append($email);
  }

  //---------Login-------------------------//

  function loginUser(){
    var email = $('#userName').val();
    var password = $('#password').val();
    var data = {email:email, password:password};
    var url = '/login';
    var type = 'POST';
    var success = pippo;
    $.ajax({url:url, type:type, data:data, success:success});
    event.preventDefault();
  }

  function pippo(data){
    var user = data.user.name;
    if(data.error === undefined){
      window.location.replace('/user/'+user);
    }else{
      alert(data.error);
    }
  }

//---------Register/Login----------------------//
/*
  function registerNewUser(event){
    debugger;
    var url = '/register';
    var type = 'POST';
    var data = $('#loginPanel').serialize();
    var success = returnHome;
    $.ajax({url:url, type:type, data:data, success:success});
    event.preventDefault();
  }


  function returnHome(data){
    debugger;
    if (data.error === undefined){
      window.location.replace('/');
    }else{
      alert(data.error);
      $('#userName2').focus();
    }
  }
*/
})();


