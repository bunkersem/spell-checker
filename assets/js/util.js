(function () {

    // Get the modal
    var modal = document.getElementById('imgmodal');
    if (modal === null)
        return;
    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var modalImg = modal.querySelector("#modal-img");
    var captionText = modal.querySelector("#modal-caption");
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('modal-image')) {
            modal.style.display = "block";
            modal.setAttribute('aria-expanded', 'true');
            modalImg.setAttribute('style', "background-image: url(" + e.target.src + ")");
            captionText.innerHTML = e.target.alt;
        }
    });
    // Get the <span> element that closes the modal
    var span = modal.querySelector('.close');
    // When the user clicks on <span> (x), close the modal
    span.onclick = function (e) {
        modal.style.display = "none";
        modal.setAttribute('aria-expanded', 'false');
    };
})();


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function encodeIntoQuery(data, discardEmptyOrNull) {
    var ret = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (discardEmptyOrNull && !data[key] && typeof data[key] !== 'number')
                continue;
            ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
    }
    return ret ? '?' + ret.join('&') : '';
}

function decodeQuery(url, discardEmpty) {
    url = (url || window.location.href).split('?')[1].split('#')[0];
    var ret = {}, url, qKVP, qParts = url.split('&');
    for (var i = 0; i < qParts.length; i++) {
        qKVP = qParts[i].split('=');
        if (discardEmpty && (!qKVP[0] || !qKVP[1])) continue;
        ret[decodeURIComponent(qKVP[0])] = decodeURIComponent(qKVP[1]);
    }
    return ret;
}
function urlEncode(data) {
    var ret = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
    }
    return ret;
}

function spawnModal(title, body, canUserClose) {
    $('#msg-modal').find('.modal-title').text(title);
    $('#msg-modal').find('.modal-body').text(body);
    $('#msg-modal').modal('show');
    // $('#msg-modal [data-dismiss="modal"]').css('display', canUserClose ? '' : 'none');
    return $('#msg-modal');
}
