/**
 * なでしこ3 Maplatプラグイン
 * Plugin_Maplat ver 0.9.0.1
 * 古地図ビューアライブラリMaplatを、なでしこv3で使うためのプラグイン
 * ・Maplat(https://github.com/code4history/Maplat/wiki)
 * ・なでしこ(https://nadesi.com/)
 */

const PluginMaplat = {
  // @Maplatを使う
  'MaplatHTML': {type: 'const', value:'<div class="mainview" id="mainview"><div id="map_div"></div></div>'}, // @MaplatHTML
  'MaplatApp': {type: 'const', value:''}, // @MaplatApp
  'Maplatマーカー非表示ボタン': {type: 'var', value: 0}, // @Maplatまーかーひひょうじぼたん
  'Maplat地図境界表示ボタン': {type: 'var', value: 0}, // @Maplatちずきょうかいひょうじぼたん
  'Maplat共有ボタン': {type: 'var', value: 0}, // @Maplatきょうゆうぼたん
  'Maplat作成時': { // @Maplatオブジェクト作成 // @Maplatさくせいしたとき
    type: 'func',
    josi: [['を'],['で','の']],
    fn: function (fn, option, sys) {
      //オプションが文字列だったら、appidということにする。
      if (typeof option === 'string') {
        option = {
          appid: option,
          enableHideMarker: sys.__v0['Maplatマーカー非表示ボタン'],
          enableBorder: sys.__v0['Maplat地図境界表示ボタン'],
          enableShare: sys.__v0['Maplat共有ボタン']
        };}
      Maplat.createObject(option).then(function(app) {
        window.setTimeout(function(){
          sys.__v0['MaplatApp'] = app.core
          return fn(app, sys)
        }, 1);
      });
    }
  },

  // @イベント
  '対象詳細': {type: 'const', value:''}, // @たいしょうしょうさい
  'マーカークリック時': { // @マーカーをクリックした時に実行するイベントを設定。『対象』にマーカーのnamespaceIDが設定される。 // @まーかーくりっくしたとき
    type: 'func',
    josi: [['で']],
    fn: function (fn, sys) {
      sys.__v0['MaplatApp'].addEventListener('clickMarker', function(evt) {
        sys.__v0['対象'] = evt.detail.namespaceID
        sys.__v0['対象詳細'] = evt.detail
        sys.__v0['対象イベント'] = evt
        return fn(evt, sys)
      });
    }
  },
  '地図クリック時': { // @地図をクリックした時に実行するイベントを設定。『対象』にlnglatが設定される。 // @ちずくりっくしたとき
    type: 'func',
    josi: [['で']],
    fn: function (fn, sys) {
      sys.__v0['MaplatApp'].addEventListener('clickMap', function(evt) {
        sys.__v0['対象'] = [evt.detail.longitude,evt.detail.latitude]
        sys.__v0['対象詳細'] = evt.detail
        sys.__v0['対象イベント'] = evt
        return fn(evt, sys)
      });
    }
  },

  // @地図変更
  '地図変更': { // @表示状態の地図をmapIDに変更する。 // @ちずへんこう
    type: 'func',
    josi: [['に', 'へ']],
    fn: function (mapID, sys) {
      sys.__v0['MaplatApp'].changeMap(mapID)
    }
  },

  // @マーカー関連
  '全マーカー表示': { // @全てのマーカーを表示する（『レイヤー隠す』で隠されているレイヤーは表示されない） // @まーかーひょうじ
    type: 'func',
    josi: [],
    fn: function (sys) {
      sys.__v0['MaplatApp'].showAllMarkers()
    }
  },
  '全マーカー隠': { // @全てのマーカーを隠す // @まーかーかくす
    type: 'func',
    josi: [],
    fn: function (sys) {
      sys.__v0['MaplatApp'].hideAllMarkers()
    }
  },
  'マーカー選択': { // @マーカーを選択状態にする // @まーかーせんたく
    type: 'func',
    josi: [['の', 'を']],
    fn: function (marker, sys) {
      sys.__v0['MaplatApp'].selectMarker(marker)
    }
  },
  'マーカー選択解除': { // @マーカーの選択状態を全て解除する。 // @まーかーせんたくかいじょ
    type: 'func',
    josi: [],
    fn: function (sys) {
      sys.__v0['MaplatApp'].unselectMarker()
    }
  },
  'レイヤー表示': { // @指定したレイヤーを表示する // @れいやーひょうじ
    type: 'func',
    josi: [['の', 'を']],
    fn: function (layer, sys) {
      sys.__v0['MaplatApp'].showPoiLayer(layer)
    }
  },
  'レイヤー隠': { // @指定したレイヤーを隠す // @れいやーかくす
    type: 'func',
    josi: [['の', 'を']],
    fn: function (layer, sys) {
      sys.__v0['MaplatApp'].hidePoiLayer(layer)
    }
  },
  'マーカークリア': { // @指定したレイヤー上のマーカーを削除（レイヤー自体は残ります） // @まーかーくりあ
    type: 'func',
    josi: [['の']],
    fn: function (layer, sys) {
      sys.__v0['MaplatApp'].clearMarker(layer)
    }
  },
  'マーカー削除': { // @指定したマーカーを削除。 // @まーかーさくじょ
    type: 'func',
    josi: [['の', 'を']],
    fn: function (marker, sys) {
      sys.__v0['MaplatApp'].removeMarker(marker)
    }
  },
  'マーカー追加': { // @layerへpoiDataのマーカーを追加 // @まーかーついか
    type: 'func',
    josi: [['の', 'を'],['に', 'へ']],
    fn: function (poiData,layer, sys) {
      sys.__v0['MaplatApp'].addMarker(poiData,layer)
    }
  },
  'レイヤー追加': { // @レイヤーを追加。（iconDataで、そのレイヤーで使うマーカーが設定できる。省略可） // @れいやーついか
    type: 'func',
    josi: [['の', 'を'],['で']],
    fn: function (layer,iconData, sys) {
      sys.__v0['MaplatApp'].addPoiLayer(layer,iconData)
    }
  },
  'マーカー更新': { // @markerをpoiDataの内容で更新 // @まーかーこうしん
    type: 'func',
    josi: [['の', 'を'],['で', 'に']],
    fn: function (marker,poiData, sys) {
      sys.__v0['MaplatApp'].updateMarker(marker,poiData)
    }
  },

  // @描画
  'Maplat線色': {type: 'var', value: '#000000'}, // @Maplatせんいろ
  'Maplat線太': {type: 'var', value: 2}, // @Maplatせんふとさ
  'Maplat線種類': {type: 'var', value: ''}, // @Maplatせんしゅるい
  '線引': { // @lnglatsの座標配列を指定して地図上に線を引く。 // @せんひく
    type: 'func',
    josi: [['の','で']],
    fn: function (lineData, sys) {
      var w = sys.__v0['Maplat線太']
      //lineDataがただの配列だったらlnglatsと判断
      if(Object.prototype.toString.call(lineData) === '[object Array]'){
        lineData = {
          "lnglats": lineData,
          "stroke": {
            "lineCap": "round",
            "color": sys.__v0['Maplat線色'],
            "width": sys.__v0['Maplat線太']
          }
        }
        if (sys.__v0['Maplat線種類'] == "点線") {
          lineData["stroke"]["lineCap"]="butt"
          lineData["stroke"]["lineDash"]=[2*w, 2*w, 2*w, 2*w]
        } else if (sys.__v0['Maplat線種類'] == "破線") {
          lineData["stroke"]["lineCap"]="butt"
          lineData["stroke"]["lineDash"]=[4*w, 2*w, 4*w, 2*w]
        } else if (sys.__v0['Maplat線種類'] == "一点鎖線") {
          lineData["stroke"]["lineCap"]="butt"
          lineData["stroke"]["lineDash"]=[6*w, 2*w, 2*w, 2*w]
        } else if  (sys.__v0['Maplat線種類'] == "丸点線") {
          lineData["stroke"]["lineCap"]="round"
          lineData["stroke"]["lineDash"]=[1, 2*w, 1, 2*w]
        }
      }
      sys.__v0['MaplatApp'].addLine(lineData)
    }
  },
  '線消': { // @地図線描画で描画した線を全て消去する。 // @せんけす
    type: 'func',
    josi: [],
    fn: function (sys) {
      sys.__v0['MaplatApp'].clearLine()
    }
  },

  // @ビューポイント
  'Maplatビューポイント設定': { // @viewpointオブジェクトを指定しViewpointをまとめて設定 // @Maplatびゅーぽいんとせってい
    type: 'func',
    josi: [['で']],
    fn: function (viewpoint, sys) {
      sys.__v0['MaplatApp'].setViewpoint(viewpoint)
    }
  },
  '地図経緯度移動': { // @地球上での経緯度(WGS84)に移動 // @ちずけいいどいどう
    type: 'func',
    josi: [['に', 'へ']],
    fn: function (lngLat, sys) {
      const viewpoint = {
        longitude: lngLat[0],
        latitude: lngLat[1]
      }
      sys.__v0['MaplatApp'].setViewpoint(viewpoint)
    }
  },

  '古地図ズーム': { // @古地図の座標上でのズーム // @こちずずーむ
    type: 'func',
    josi: [['で']],
    fn: function (zoom, sys) {
      const viewpoint = {
        zoom: zoom
      }
      sys.__v0['MaplatApp'].setViewpoint(viewpoint)
    }
  },
  '地図ズーム': { // @メルカトル座標上でのズーム // @ちずずーむ
    type: 'func',
    josi: [['で']],
    fn: function (mercZoom, sys) {
      const viewpoint = {
        mercZoom: mercZoom
      }
      sys.__v0['MaplatApp'].setViewpoint(viewpoint)
    }
  },
  '古地図回転': { // @古地図の正位置を角度0としての回転率 // @こちずかいてん
    type: 'func',
    josi: [['で']],
    fn: function (rotation, sys) {
      const viewpoint = {
        rotation: rotation
      }
      sys.__v0['MaplatApp'].setViewpoint(viewpoint)
    }
  },
  '地図回転': { // @北が上になるのを角度0としての回転率 // @ちずかいてん
    type: 'func',
    josi: [['で']],
    fn: function (direction, sys) {
      const viewpoint = {
        direction: direction
      }
      sys.__v0['MaplatApp'].setViewpoint(viewpoint)
    }
  },
  
  // @透過
  '地図透過度設定': { // @重ね合わせの透過度(0-100で表示地図を透過させる比率を設定) // @ちずとうかどせってい
    type: 'func',
    josi: [['で','に']],
    fn: function (ratio, sys) {
      sys.__v0['MaplatApp'].setTransparency(ratio)
    }
  }
}
// モジュールのエクスポート(必ず必要)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PluginMaplat
}
//プラグインの自動登録
if (typeof (navigator) === 'object') {
  navigator.nako3.addPluginObject('PluginMaplat', PluginMaplat)
}
