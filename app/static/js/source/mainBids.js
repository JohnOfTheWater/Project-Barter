(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    $('#loginPanel').hide();
    $('#myItemsPanel').hide();
    $('.acceptBid').hide();
    $('.bids').hide();
    $('.sdescription').hide();
    $('#loginButton').click(showLogin);
    $('#userButton').click(showUserPanel);
    $('#myItems').click(showMyItems);
    $('#login').click(loginUser);
    $('#close').click(closeUserPanel);
    $('#closeMI').click(closeMyItemsPanel);
    $('#myBids').click(goToMyBids);
    $('.picture3').click(showTrade);
    $('.acceptBid').click(finalTrade);
    $('.spicture').mouseenter(showDescription);
    $('.spicture').mouseleave(hideDescription);
    hideWelcome();
    //getMyBids();
  }

  //---------GlobalVariables-------------------------//

  var actualVal = '';


  //---------Animation-------------------------//

  function showTrade(){
    actualVal = $(this).attr('val');
    $('.acceptBid[val="'+actualVal+'"]').fadeToggle();
    $('.bids[val="'+actualVal+'"]').fadeToggle();
    $('.opzione').remove();
    getMyBids();
  }
//-----------getMyBids------------//
  function getMyBids(){
    var id = actualVal;
    var url = window.location.origin.replace(/[0-9]{4}/, '4000') + '/findMyBids/' + id;
    $.getJSON(url, displayOption);
  }

  function displayOption(data){
    console.log(data.item.bids);
    for(var i = 0; i < data.item.bids.length; i++){
      appendOptions(data.item.bids[i]);
    }
  }

  function appendOptions(bid){
    console.log(bid);
    var $option = $('<option>');

    $option.text(bid).addClass('opzione');

    $('.bids[val="'+actualVal+'"]').append($option);
  }
//-----------EndGetMyBids------------//

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
    $('#myItemsPanel').fadeIn('slow');
    $('#search').focus();
    getMyItems();
  }

  function showUserPanel(){
    $('#userPanel').animate({margin:'+0 +0 +0 +620'},1000);
    $('#search').focus();
    var user = $(this).text();
    getUser(user);
  }

  function closeMyItemsPanel(){
    $('#myItemsPanel').fadeOut('slow');
    $('#search').focus();
  }

  function closeUserPanel(){
    //$('#userPanel').fadeToggle('slow');
    $('#userPanel').animate({margin:'+0 +0 +0 +0'},1000);
    $('#search').focus();
  }


  function showLogin(){
    var text = $('#loginButton').text();
    if(text === 'Register/Login'){
      $('#loginButton').text('close');
    }else{
      $('#loginButton').text('Register/Login');
    }
    $('#loginPanel').fadeToggle('slow');
    $('#userName').focus();
  }

  function finalTrade(){
    debugger;
    var id = $(this).attr('val');
    var name = $('.bids[val="'+actualVal+'"]').val();
    //var name = $('#lollo').val();
    var data = {name:name};
    var url = window.location.origin.replace(/[0-9]{4}/, '4000') + '/removeItems/' + id;
    var type = 'DELETE';
    //actualId = id;
    var success = removeAlbum;

    $.ajax({url:url, type:type, data:data, success:success});

  }

  function removeAlbum(data){
    console.log(data);
    if(data){
      var user = $('#userButt').text();
      alert('Congratulations '+user+'! Check your emails for reviewing your transaction!');
      window.location.replace('/myBids/'+user);
    }
  }

  //---------goToMyBids-------------------------//

  function goToMyBids(){
    var user = $('#userButt').text();
    window.location.replace('/myBids/'+user);
  }

  //---------getMyBids-------------------------//
/*
  function getMyBids(){
    var user = $('#userButton').text();
    var url = window.location.origin.replace(/[0-9]{4}/, '4000') + '/myItems/' + user;
    $.getJSON(url, displayMyItems);
  }
*/
  //---------getMyItems-------------------------//
  function getMyItems(){
    //$.hide();
    //$.remove();
    //var item = actualItem;
    var user = $('#userButt').text();
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
    $name.text('User Name: '+data.user.name).addClass('name').attr('data-id', data.user._id);
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


