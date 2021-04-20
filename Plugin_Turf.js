/**
 * なでしこ3 プラグイン
 * PluginTurf 1
 * ・Turf.jsが必要。
 *   <script src='https://unpkg.com/@turf/turf@6.3.0/turf.min.js'></script>
 */
const PluginTurf = {
  'Turf単位': {type: 'var', value: 'meters'}, // @Turfたんい
  // @道進所(along,helpers)
  '道進所': { // @lnglatsで道程を設定し、スタート地点からvだけ進んだ位置を返す // @みちすすんだところ
    type: 'func',
    josi: [['を'],['だけ']],
    fn: function (lnglats, v, sys) {
      var line = turf.helpers.lineString(lnglats);
      var options = {units: sys.__v0['Turf単位']};
      var along = turf.along(line, v, options);
      return along.geometry.coordinates;
    }
  },
  // @面積取得(area,helpers)
  '面積取得': { // @lnglatsで面積を取得。平方メートル // @めんせきしゅとく
    type: 'func',
    josi: [['の', 'で']],
    fn: function (lnglats, sys) {
      if (lnglats[0][0][0] == undefined) {lnglats = [lnglats]}
      var polygon = turf.helpers.polygon(lnglats);
      return turf.area(polygon);
    }
  },
  // @方角取得(bearing,helpers)
  '方角取得': { // @lnglatで二点間の地理的方位（北の線からの角度） // @ほうがくしゅとく
    type: 'func',
    josi: [['と', 'から'], ['の', 'で']],
    fn: function (p1, p2, sys) {
      p1 = turf.helpers.point(p1);
      p2 = turf.helpers.point(p2);
      return turf.bearing(p1, p2);
    }
  },
  // @中心点(center,helpers)
  '中心点': { // @lnglatsで複数の地点の絶対中心点 // @ちゅうしんてん
    type: 'func',
    josi: [['の', 'で']],
    fn: function (lnglats, sys) {
      var features = turf.helpers.points(lnglats);
      var center = turf.center(features);
      return center.geometry.coordinates;
    }
  },
  // @重心点(centroid,helpers)
  '重心点': { // @lnglatsですべての頂点の平均を使用して重心を計算 // @じゅうしんてん
    type: 'func',
    josi: [['の', 'で']],
    fn: function (lnglats, sys) {
      if (lnglats[0][0][0] == undefined) {lnglats = [lnglats]}
      var polygon = turf.helpers.polygon(lnglats);
      var centroid = turf.centroid(polygon);
      return centroid.geometry.coordinates;
    }
  },
  // @距離取得(distance,helpers)
  '距離取得': { // @lnglatで二点間の距離を取得 // @きょりしゅとく
    type: 'func',
    josi: [['と', 'から'], ['の', 'で', 'までの']],
    fn: function (p1, p2, sys) {
      p1 = turf.helpers.point(p1);
      p2 = turf.helpers.point(p2);
      var options = {units: sys.__v0['Turf単位']};
      return turf.distance(p1, p2, options);
    }
  },
  // @道程取得(length,helpers)
  '道程取得': { // @lnglatsの線の長さを取得 // @みちのりしゅとく
    type: 'func',
    josi: [['の']],
    fn: function (lnglats, sys) {
      var line = turf.helpers.lineString(lnglats);
      var options = {units: sys.__v0['Turf単位']};
      return turf.length(line, options);
    }
  },
  // @道程分割(lineChunk,length,explode,helpers)
  '道程分割': { // @lnglatsの線を個数vに分割 // @みちのりぶんかつ
    type: 'func',
    josi: [['を'],['に', 'で']],
    fn: function (lnglats, v, sys) {
      var line = turf.helpers.lineString(lnglats);
      var options = {units: sys.__v0['Turf単位']};
      var lineLength = turf.length(line, options);
      var divLength = lineLength / v;
      var chunk = turf.lineChunk(line, divLength, options);
      var points = chunk.features.map(function(line) {
        var nodes = turf.explode(line);
        return nodes.features[0].geometry.coordinates;
      });
      if (lnglats[0].toString() != lnglats[lnglats.length-1].toString()) {
        points.push(lnglats[lnglats.length-1]);
      }
      return points;
    }
  }
}

// モジュールのエクスポート(必ず必要)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PluginTurf
}
//プラグインの自動登録
if (typeof (navigator) === 'object') {
  navigator.nako3.addPluginObject('PluginTurf', PluginTurf)
}
