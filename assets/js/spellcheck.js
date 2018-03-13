
var editor;

(function () {
    editor = {
        $elem: $('#editor'),
        $runBtn: $('#run-spell-check'),
        spellCheck: spellCheck,
        reloadLang: reloadLang,
        $langSelect: $('#lang-select'),
        $outer: $('#editor-outer'),
    }

    editor.$langSelect.on('change', function (e) {
        var text = $(this).find('option:selected').text();
        reloadLang(text, $(this).val())
    });

    function reloadLang(text, lang) {
        loader(true);
        loadLang(lang);
        console.log('reloading language', lang);
        editor.unloadLang && editor.unloadLang();
    }

    function loader(show) {
        show ? editor.$outer.addClass('loading') : editor.$outer.removeClass('loading')
    }
    function button(interactive) {
        !interactive
            ? editor.$runBtn.find('.icon')
                .removeClass('refresh')
                .addClass('stop')
            : editor.$runBtn.find('.icon')
                .addClass('refresh')
                .removeClass('stop');
        editor.$runBtn.attr('disabled', !interactive);
    }

    var lang;
    function loadLang(name) {
        lang = BJSpell("./assets/js/" + name + ".js", function () {
            loader(false);
            button(true);
            editor.$runBtn.on('click.spellcheck', runSpellCheck.bind(editor.$elem));
            editor.$elem.on('input.spellcheck change.spellcheck', function () {
                button(true);
            });
            editor.unloadLang = function () {
                editor.$elem.off('spellcheck')
            }
        });
    }
    loadLang('en_US');
    loader(true);

    function runSpellCheck(e) {
        triggerPopoversHide();
        button(false);
        loader(true);
        var _this = this;
        setTimeout(function () {
            spellCheck.call(_this);
        }, 100);
    }

    var testableWordMatcher = /^([!:?,.()/\-"' ;]*)(.+?)([!?,./()\-:"' ;]*)$/;
    var wTest = /[A-Za-z][a-z]/;
    function spellCheck(e) {
        var text = $(this).get(0).innerText
        var word = text.split(/(?=[/\\\s\n-]+)/g);
        var newHTML = "";

        $.each(word, function (index, value) {
            if (wTest.test(value) && !lang.check(value.replace(testableWordMatcher, '$2').trim())) {
                newHTML += '<span class="misspelled" data-word-id="' + index + '">' + value.replace(/\n/g,"<br>") + '</span>';
            } else {
                newHTML += "<span class='other'>" + value.replace(/\n/g,"<br>") + "</span>";
            }
        });
        $(this).html(newHTML);

        loader(false);

        //// Set cursor postion to end of text
        var child = $(this).children();
        var range = document.createRange();
        var sel = window.getSelection();
        try {
            range.setStart(child[child.length - 1], 1);
        } catch (err) { console.error(err) }
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        $(this)[0].focus();
    }

    $(document).on('mouseenter', '.misspelled', function (e) {
        var wchars = $(this).text().replace(testableWordMatcher, '$2');
        var content = lang.suggest(wchars, 5)
        var spellId = $(this).data('word-id');
        content = content.map(function (word) {
            return '<a onclick="handleSuggestionClick(event, this, ' + spellId + ')" class="suggestion-item" role="button">' + word + '</a>'
        });
        $(this).popover({
            container: 'body',
            placement: 'bottom',
            title: 'Suggestions for: <b>' + $(this).html().replace(testableWordMatcher, '$2') + '</b>',
            content: content.join(', '),
            html: true,
        });
        triggerPopoversHide();
        $(this).popover('show');
    });
    $(document).on('click touch', function (e) {
        if ($(e.target).closest('.popover').length > 0)
            return;
        triggerPopoversHide();
    });
    function triggerPopoversHide() {
        editor.$elem.find('.misspelled[aria-describedby]').popover('hide');
    }
    function handleSuggestionClick(e, _this, wordId) {
        console.log('suggestion', $(_this), wordId);
        var $elem = editor.$elem.find('[data-word-id=' + wordId + ']');
        var res = $elem.text().replace(testableWordMatcher, function (match, p1, p2, p3) { return p1 + $(_this).text() + p3; })
        $elem
            .html(res + '&nbsp;')
            .removeClass('misspelled')
            .addClass('other')
            .popover('hide');
    }
    window.handleSuggestionClick = handleSuggestionClick;
})();

