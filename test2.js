var variants = {},
defaultVariant = null,
optionKeys = [],
puts = function(a) { console.log(a); },
values = function(hash) {
  return $.map(hash, function(value, key) {
    return value;
  });
},
norm = function(value) {
  return value.replace(/[ -\/]/g, '').toLocaleLowerCase();
},
addVariant = function(variant){
  var key = $.map(variant.options, function(value, optionKey) {
    addOptionKey(optionKey);
    return norm(value);
  }).join('-');
  if (variant.available && !defaultVariant) {
    defaultVariant = variant;
  }
  variants[key] = variant;
},
addOptionKey = function(optionKey) {
  if (optionKeys.indexOf(optionKey) == -1) {
    optionKeys.push(optionKey);
  }
},
currentOptionValue = function(optionKey) {
  var elements = $('#options .' + optionKey + ' .btn'),
  element = elements.filter('.over')[0] || elements.filter('.active')[0];
  return $(element).find('input').val();
},
currentKey = function() {
  return $.map(optionKeys, function(optionKey) {
    return currentOptionValue(optionKey);
  }).join('-');
},
option = function(optionKey, optionValue) {
  return $('#options .' + optionKey + ' .btn').filter(function() {
    return $(this).find('input[value=' + norm(optionValue) + ']')[0];
  });
},
update = function() {
  var key = currentKey(),
  variant = variants[key];
  if (variant) {
    $('#product-select').val(variant.id);
  }
},
setAvailability = function(optionKey, possibleVariants) {
  var sibblingVariants = $.grep(possibleVariants, function(variant) {
    var optionValue = norm(variant.options[optionKey]);
    option(optionKey, optionValue)
      .toggleClass('unavailable', !variant.available);
    return (optionValue == currentOptionValue(optionKey));
  });
  return sibblingVariants;
},
// setAvailability = function(optionKey, possibleVariants) {
//   var sibblingVariants = $.grep(possibleVariants, function(variant) {
//     return option(optionKey, variant.options[optionKey])
//       .toggleClass('unavailable', !variant.available)
//       .hasClass('active');
//   });
//   return sibblingVariants;
// },
setAvailabilites = function() {
  var possibleVariants = values(variants);
  $.each(optionKeys, function(index, optionKey) {
    possibleVariants = setAvailability(optionKey, possibleVariants);
  });
},
init = function(variant) {
  $.each(variant.options, function(optionKey, optionValue) {
    option(optionKey, optionValue)
      .triggerHandler('click');
  });
};

$(document).ready(function() {
  $('#options .btn').on('click', function(event) {
    $(this).not('.unavailable').not('.active').each(function() {
      $(this).addClass('active')
        .find('input:radio')
          .attr('checked', true).end()
        .siblings()
          .removeClass('active');
      update();
      setAvailabilites();
    });
  }).on('mouseover', function() {
    $(this).not('.unavailable').not('.active').each(function() {
      $(this).addClass('over')
        .siblings()
          .removeClass('over');
      update();
    });
  }).on('mouseout', function() {
    $(this).not('.unavailable').not('.active').each(function() {
      $(this).removeClass('over');
      update();
    });
  });
});
