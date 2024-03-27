$(function() {
  // 「すべてを選択」changeイベント
  $('.js-check-all').on('change', function(event) {
    // data-check-allで対象グループを取得
    var group = $(event.target).data('check-all');
    // data-check-all="hobby" の形式に直す
    var dataCheckGroup = '[data-check-all="' + group + '"]';

    // 「すべてを選択」がチェックされているとき
    if ($(event.target).prop('checked')) {
      // 同じ対象内のチェックボックスをすべてチェックする (disabledを除く)
      $('.js-check-all-target')
        .filter(dataCheckGroup)
        .find('input[type="checkbox"]:not(:disabled)')
        .prop('checked', true);

        return;
    }

    // 「すべてを選択」がチェックされていないとき
    // 同じ対象内のチェックボックスをすべてチェックを外す (disabledを除く)
    $('.js-check-all-target')
      .filter(dataCheckGroup)
      .find('input[type="checkbox"]:not(:disabled)')
      .prop('checked', false);
  });
});
