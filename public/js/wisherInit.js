var isMobile = {
  Android: function() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};

function createIframe(src) {
  console.log('wnd', window.innerWidth, window.innerHeight)
  var iframe = document.createElement('iframe');
  iframe.frameBorder = 0;
  iframe.setAttribute('src', src);
  iframe.style.width = window.innerWidth;
  iframe.style.height = window.innerHeight;
  return iframe;
}

function wisherInit() {

  if (isMobile.any()) {
    if (window.innerWidth > window.innerHeight)
      $('#orientation').css('display', 'block');
    else {
      $('#wisher').css('display', 'block');
    }
  } else {
    $('#phone .screen').append(createIframe('wisher.html'));
    $('#phone').css('display', 'block');
  }

  $('.page').css('width', window.innerWidth)

  if (window.DeviceOrientationEvent) {
    window.addEventListener('orientationchange', function() {
      if (window.orientation & 2) {
        $('#orientation').css('display', 'block');
        $('#wisher').css('display', 'none');
      } else {
        $('#orientation').css('display', 'none');
        $('#wisher').css('display', 'block');
      }
    }, false);
  } else {
    console.error('DeviceOrientationEvent not supported');
  }
}