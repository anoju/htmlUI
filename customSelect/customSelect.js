const uiSelect = {
  class: {
    init: 'init',
    wrap: 'custom-select',
    disabled: 'disabled',
    btn: 'custom-select-btn',
    btnActive: 'open',
    optgroup: 'custom-select-optgroup',
    optgroupLabel: 'custom-select-optgroup-lbl',
    options: 'custom-select-options',
    option: 'custom-select-option',
    optionSelected: 'selected'
  },
  ready: function () {
    const customSelects = document.querySelectorAll('.' + uiSelect.class.wrap);
    if (!customSelects.length) return;

    customSelects.forEach(function (_select) {
      if (_select.closest('#__selectBoxTemp')) return; // 예외처리
      if (_select.closest('.readOnlyCase')) return; // 예외처리 2

      const selElmnt = _select.querySelector('select');
      uiSelect.changeEvt(selElmnt);
      selElmnt.classList.add(uiSelect.class.init);
      selElmnt.tabIndex = -1;
      if (typeof jQuery != 'undefined') {
        $(selElmnt).off('change', uiSelect.changeEvt);
        $(selElmnt).on('change', uiSelect.changeEvt);
      } else {
        selElmnt.removeEventListener('change', uiSelect.changeEvt);
        selElmnt.addEventListener('change', uiSelect.changeEvt);
      }
      selElmnt.removeEventListener('focus', uiSelect.focusEvt);
      selElmnt.addEventListener('focus', uiSelect.focusEvt);
    });
  },
  changeEvt: function (e) {
    const selElmnt = e.type === 'change' ? e.target : e;
    if (!selElmnt) return;
    const _select = selElmnt.closest('.' + uiSelect.class.wrap);
    if (selElmnt.disabled) _select.classList.add(uiSelect.class.disabled);
    else _select.classList.remove(uiSelect.class.disabled);
    uiSelect.btn(_select);
  },
  focusEvt: function (e) {
    const $target = e.target;
    const $wrap = $target.closest('.' + uiSelect.class.wrap);
    const $btn = $wrap.querySelector('.' + uiSelect.class.btn);
    if ($btn) $btn.focus();
  },
  btn: function (el) {
    const selElmnt = el.querySelector('select');
    const seletedIndex = selElmnt.selectedIndex;
    const selValue = selElmnt.value;
    let btn = el.querySelector('.' + uiSelect.class.btn);
    if (!btn) {
      const Html = document.createElement('button');
      Html.type = 'button';
      Html.className = uiSelect.class.btn;
      el.appendChild(Html);
      btn = Html;
    }
    if (selElmnt.disabled) btn.disabled = true;
    else btn.disabled = false;

    if (seletedIndex >= 0) {
      const btnTxt = selElmnt.options[seletedIndex].innerHTML;
      btn.innerHTML = btnTxt;
      btn.dataset.value = selValue;
      btn.dataset.index = seletedIndex;
    }
  },
  options: function (el) {
    const selElmnt = el.querySelector('select');
    const seletedIndex = selElmnt.selectedIndex;
    let options = el.querySelector('.' + uiSelect.class.options);
    if (!options) {
      const Html = document.createElement('div');
      Html.className = uiSelect.class.options;
      el.appendChild(Html);
      options = Html;
    }
    let optionsHtml = '';
    /*
    const selOptions = selElmnt.options;
    if (selOptions.length) {
      Array.from(selOptions).forEach(function (option, i) {
        const selected = i === seletedIndex ? ' ' + uiSelect.class.optionSelected : '';
        const disabled = option.disabled ? ' disabled' : '';
        optionsHtml += '<button type="button" class="' + uiSelect.class.option + selected + '" data-value="' + option.value + '" data-index="' + i + '"' + disabled + '>' + option.textContent + '</button>';
      });
    }*/
    function makeOption(el, idx){
      const selected = idx === seletedIndex ? ' ' + uiSelect.class.optionSelected : '';
      const disabled = el.disabled ? ' disabled' : '';
      return '<button type="button" class="' + uiSelect.class.option + selected + '" data-value="' + el.value + '" data-index="' + idx + '"' + disabled + '>' + el.textContent + '</button>'
    }
    const selChild = selElmnt.children;
    if (selChild.length) {
      Array.from(selChild).forEach(function (child, i) {
        if (child.tagName.toLowerCase() === 'optgroup') {
          optionsHtml += '<div class="' + uiSelect.class.optgroup + '">';
          optionsHtml += '<div class="' + uiSelect.class.optgroupLabel + '">' + child.label + '</div>';
          Array.from(child.children).forEach(function (option, j) {
            const optionIndex = Array.from(selElmnt.options).indexOf(option);
            optionsHtml +=makeOption(option, optionIndex);
          });
          optionsHtml += '</div>';
        } else if (child.tagName.toLowerCase() === 'option') {
          optionsHtml +=makeOption(child, i);
        }
      });
    }
    options.innerHTML = optionsHtml;
  },
  position: function () {
    const customSelect = document.querySelectorAll('.' + uiSelect.class.wrap);
    if (!customSelect.length) return;
    customSelect.forEach(function (_select) {
      if (_select.classList.contains('fixed')) {
        const selectWidth = _select.offsetWidth;
        const selectHeight = _select.offsetHeight;
        const selectLeft = getOffset(_select).left;
        const selectTop = getOffset(_select).top;
        const items = _select.querySelector('.' + uiSelect.class.options);
        if (items && isElementVisible(_select)) {
          items.style.minWidth = selectWidth + 'px';
          items.style.left = selectLeft + 'px';
          items.style.top = selectTop + selectHeight + 'px';
        }
      }
    });
  },
  close: function (el) {
    const selectBtn = document.querySelectorAll('.' + uiSelect.class.btn + '.' + uiSelect.class.btnActive);
    if (!selectBtn.length) return;
    selectBtn.forEach(function (_btn) {
      if (_btn !== el) _btn.classList.remove(uiSelect.class.btnActive);
    });
  },
  clickOption: function (el) {
    const $el = el;
    const $idx = $el.dataset.index;
    const $wrap = $el.closest('.' + uiSelect.class.wrap);
    const $btn = $wrap.querySelector('.' + uiSelect.class.btn);
    const $options = $el.closest('.' + uiSelect.class.options);
    const selElmnt = $wrap.querySelector('select');
    if (selElmnt && $idx >= 0 && $idx < selElmnt.options.length) {
      selElmnt.selectedIndex = $idx;
      if (typeof jQuery != 'undefined') $(selElmnt).change();
      else selElmnt.dispatchEvent(new Event('change'));
      $options.remove();

      setTimeout(function () {
        $btn.focus();
      }, 10);
    }
  },
  UI: function () {
    document.addEventListener('click', function (e) {
      const $target = e.target;
      if ($target.classList.contains(uiSelect.class.btn)) {
        e.preventDefault();
        uiSelect.close($target);
        $target.classList.toggle(uiSelect.class.btnActive);
        const $select = $target.closest('.' + uiSelect.class.wrap);
        uiSelect.options($select);
        uiSelect.position();
      } else if (!$target.classList.contains(uiSelect.class.optgroupLabel)){
        uiSelect.close();
      }

      if ($target.classList.contains(uiSelect.class.option)) {
        e.preventDefault();
        uiSelect.clickOption($target);
      }
    });
    window.addEventListener('resize', uiSelect.position);

    // 추가 키보드 move 이벤트
    $(document).on('keydown keypress', '.' + uiSelect.class.wrap + ' .' + uiSelect.class.btn + ', .' + uiSelect.class.wrap + ' .' + uiSelect.class.option, function (e) {
      const $this = $(this);
      const $wrap = $this.closest('.' + uiSelect.class.wrap);
      const $btn = $wrap.find('.' + uiSelect.class.btn);
      const $options = $wrap.find('.' + uiSelect.class.options);
      if (!$options.length) return;
      const $item = $options.find('.' + uiSelect.class.option);
      if (!$item.length) return;

      const $keyCode = e.keyCode ? e.keyCode : e.which;
      const isUp = $keyCode === 38;
      const isDown = $keyCode === 40;
      if (isUp || isDown) {
        let focusEl;

        // 버튼일때
        if ($this.hasClass(uiSelect.class.btn) && $this.hasClass(uiSelect.class.btnActive)) {
          e.preventDefault();
          if (isUp) focusEl = $item.last();
          else if (isDown) focusEl = $item.first();
        }

        // 옵션일때
        if ($this.hasClass(uiSelect.class.option)) {
          e.preventDefault();
          if (isUp) focusEl = $this.prev().length ? $this.prev() : $btn;
          else if (isDown) focusEl = $this.next().length ? $this.next() : $btn;
        }

        if (focusEl) focusEl.focus();
      }
    });
  }
};