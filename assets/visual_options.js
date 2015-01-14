var variants = {},
images = [],
defaultVariant = null,

preload = function(url) {
  if (url) {
    images[url] = new Image();
    images[url].src = url;
  }
},

values = function(hash) {
  return $.map(hash, function(value, key) {
    return value;
  });
},

norm = function(value) {
  return value.replace(/[ .\/]/g, '').replace(/ß/, 's').replace(/ü/, 'u');
},

addVariant = function(variant){
  var key = variantKey(variant);

  if (!defaultVariant || !defaultVariant.available) {
    defaultVariant = variant;
  }
  preload(variant.image);
  renderButtons(variant);
  variants[key] = variant;
},

optionKeys = function() {
  return $('#options div').map(function() {
    return $(this).first().find('input').attr('name');
  });
},

option = function(optionKey, optionValue) {
  return $('#options .' + optionKey + ' .option').filter(function() {
    return $(this).find('input[value=' + norm(optionValue) + ']')[0];
  });
},

variantKey = function(variant) {
  return $.map(variant.options, function(optionValue, optionKey) {
    return norm(optionValue);
  }).join('-');
},

currentOptionValue = function(optionKey) {
  var elements = $('#options .' + optionKey + ' .option'),
  element = elements.filter('.over')[0] || elements.filter('.active')[0];

  return $(element).find('input').val();
},

currentVariantKey = function() {
  return $.map(optionKeys(), function(optionKey) {
    return currentOptionValue(optionKey);
  }).join('-');
},

update = function() {
  var key = currentVariantKey(),
  toggleElement = $('#product'),
  variant = variants[key];
  if (variant) {
    $('#productSelect').val(variant.id);
    if (variant.image) {
      $('#productPhoto img[src*="/products/"]:first').attr('src', variant.image);
    }
    toggleElement.toggleClass('unavailable', variant.quantity < 1 && !variant.available);
    toggleElement.toggleClass('preorder',    variant.quantity < 1 && variant.available);
    toggleElement.toggleClass('on-sale',     variant.onSale);
    $('#productPrice').html(variant.price);
    $('#comparePrice').html(variant.comparePrice);
  }
  else {
    toggleElement.addClass('unavailable');
  }
},

setAvailability = function(optionKey, possibleVariants) {
  var elements = $('#options .' + optionKey + ' .option'),
  sibblingVariants = [];

  elements.trigger('availability', false);
  sibblingVariants = $.grep(possibleVariants, function(variant) {
    return option(optionKey, variant.options[optionKey])
      .trigger('availability', variant.available)
      .hasClass('active');
  });
  elements.trigger('resolveAvailabilityConflict');
  return sibblingVariants;
},

setAvailabilites = function() {
  var possibleVariants = values(variants);

  $.each(optionKeys(), function(index, optionKey) {
    possibleVariants = setAvailability(optionKey, possibleVariants);
  });
},

toggleClassName = function(node, className) {
  return node.addClass(className).siblings().removeClass(className).end();
},

renderButton = function(optionKey, optionValue, display) {
  var button = $('<input type="radio" name="' + optionKey + '" value="' + optionValue +'">');

  return $('<label class="btn--secondary option optionValue' + optionValue + '">')
    .attr('title', optionKey + ': ' + display)
    .append(button, $('<span>' + display + '</span>'))
    .on('click', function(event) {
      $(this).not('.unavailable').not('.active').each(function() {
        toggleClassName($(this), 'active')
          .find('input:radio')
            .prop('checked', true)
            .siblings()
            .prop('checked', false);
        update();
        setAvailabilites();
      });
    }).on('mouseover', function() {
      $(this).not('.unavailable').not('.active').each(function() {
        toggleClassName($(this), 'over');
        update();
      });
    }).on('mouseout', function() {
      $(this).not('.unavailable').not('.active').each(function() {
        $(this).removeClass('over');
        update();
      });
    })
    .on('availability', function(event, available) {
      $(this)
        .toggleClass('unavailable', !available)
        .toggleClass('disabled', !available)
        .find('input:radio')
          .attr('disabled', !available);
    })
    .on('resolveAvailabilityConflict', function() {
      $(this).filter('.active.unavailable').each(function() {
        $(this)
          .siblings().not('.unavailable').first()
          .click();
      });
    });
},

renderButtons = function(variant) {
  $.each(variant.options, function(optionKey, value) {
    var optionValue = norm(value);
    $('#options div.' + optionKey)
      .filter(function() {
        return !$(this).find('input[value=' + optionValue + ']')[0];
      })
      .append(function() {
        return renderButton(optionKey, optionValue, value);
      });
  });
},

init = function(variant) {
  $.each(variant.options, function(optionKey, optionValue) {
    $('#options select.' + optionKey).hide();
    option(optionKey, optionValue)
      .click();
  });
};
