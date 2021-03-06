// Flickr API key
const API_KEY = 'd56709c20967fa2852731e4d217b76d3';

// Flickr画像データのURLを返す
const getFlickrImageURL = (photo, size) => {
  let url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${
    photo.secret
  }`;
  if (size) {
    // サイズ指定ありの場合
    url += `_${size}`;
  }
  url += '.jpg';
  return url;
};

// Flickr画像の元ページのURLを返す
const getFlickrPageURL = (photo) => `https://www.flickr.com/photos/${photo.owner}/${photo.id}`;

// Flickr画像のaltテキストを返す
const getFlickrText = (photo) => {
  let text = `"${photo.title}" by ${photo.ownername}`;
  if (photo.license === '4') {
    // Creative Commons Attribution（CC BY）ライセンス
    text += ' / CC BY';
  }
  return text;
};

// リクエストパラメータを作る
const parameters = $.param({
  method: 'flickr.photos.search',
  api_key: API_KEY,
  tags: 'CLHphoto', // 検索タグ
  tag_mode: 'all', // 複数検索タグの処理
  sort: 'interestingness-desc', // ソート論理
  per_page: 100, // 取得件数
  license: '0', // All Rights Reserved
  extras: 'owner_name,license', // 追加で取得する情報
  format: 'json', // レスポンスをJSON形式に
  nojsoncallback: 1, // レスポンスの先頭に関数呼び出しを含めない
});
const url = `https://api.flickr.com/services/rest/?${parameters}`;
console.log(url);

// リクエストパラメータの画像を検索して表示
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    // データが取得できなかった場合
    if (data.stat !== 'ok') {
      throw new Error('データの取得に失敗しました。');
    }

    // 空の<div>を作る
    const $div = $('<div class="photo-list">');

    for (let i = 0; i < data.photos.photo.length; i++) {
      const photo = data.photos.photo[i];
      const photoText = getFlickrText(photo);

      // $divに <a href="..." ...><img src="..." ...></a> を追加する
      $div.append(
        $('<div>', {
          class: 'gallery-photo img-tooltip',
          'data-text': photoText,
        }).append(
        $('<a>', {
          href: getFlickrPageURL(photo),
          rel: 'noopener noreferrer',
          target: '_blank', // リンクを新規タブで開く
        }).append(
          $('<img>', {
            src: getFlickrImageURL(photo, 'z'),
            alt: photoText,
          }),
        ),
        ),
      );
    }

    // ヒット件数
    // $div.append(`<div>${data.photos.total} 件</div>`);

    // $divをclass:main-contentsに追加する
    $div.appendTo('.main-contents');
    $('.photo-list').pagination({
      itemElement : '> .gallery-photo',
      displayItemCount : 8,
      paginationClassName : 'pagination',
      paginationInnerClassName : 'pagination-inner',
      pageNumberClassName : 'pagination-number',
      bothEndsBtnHideDisplay : true,
    });
  }).catch((error) => {
    console.error(`エラーが発生しました： ${error.message}`);
});